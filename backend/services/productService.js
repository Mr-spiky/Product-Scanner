const Product = require("../models/Product");
const { fetchProductFromOpenFoodFacts } = require("./openFoodFactsService");
const { analyzeProductWithAI } = require("./aiAnalysisService");
const { computeRegionFlags } = require("./regionService");

/**
 * Validate basic barcode pattern.
 */
function validateBarcode(barcode) {
  const trimmed = String(barcode || "").trim();
  const re = /^(\d{8}|\d{12}|\d{13})$/;
  if (!re.test(trimmed)) {
    const err = new Error("Invalid barcode format. Expect EAN-8, UPC-A or EAN-13.");
    err.code = "INVALID_BARCODE";
    throw err;
  }
  return trimmed;
}

async function getProductFromCache(barcode) {
  try {
    const now = new Date();
    const cached = await Product.findOne({
      barcode,
      cacheExpiry: { $gt: now },
    });
    if (!cached) return null;

    cached.scanCount = (cached.scanCount || 0) + 1;
    cached.lastScannedAt = now;
    await cached.save();

    const obj = cached.toObject();
    obj.source = "cache";
    return obj;
  } catch (err) {
    console.error("Mongo cache read error:", err.message);
    return null;
  }
}

async function cacheProduct(doc) {
  try {
    const ttlDays = Number(process.env.CACHE_TTL_DAYS || 7);
    const now = new Date();
    const expiry = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

    const existing = await Product.findOne({ barcode: doc.barcode });
    if (existing) {
      Object.assign(existing, doc, {
        cachedAt: now,
        cacheExpiry: expiry,
      });
      await existing.save();
      return existing.toObject();
    }

    const created = await Product.create({
      ...doc,
      cachedAt: now,
      cacheExpiry: expiry,
      scanCount: 1,
      lastScannedAt: now,
    });
    return created.toObject();
  } catch (err) {
    console.error("Mongo cache write error:", err.message);
    return doc;
  }
}

async function analyzeAndCacheProduct(barcode, userContext = {}) {
  const validBarcode = validateBarcode(barcode);

  // 1. Try cache
  const cached = await getProductFromCache(validBarcode);
  if (cached) {
    return { product: cached, fromCache: true };
  }

  // 2. Fetch from OpenFoodFacts
  const raw = await fetchProductFromOpenFoodFacts(validBarcode);
  if (!raw) {
    return { product: null, fromCache: false };
  }

  // 3. AI analysis
  const ai = await analyzeProductWithAI(raw, userContext);
  if (!ai) {
    // still return raw info, but mark low confidence
    const doc = {
      ...raw,
      safetyScore: null,
      summary: "AI analysis unavailable. Showing raw data only.",
      healthWarnings: [],
      harmfulSubstances: [],
      ingredients: raw.ingredients,
    };
    const regionFlag = computeRegionFlags(doc, userContext.region || "US");
    doc.regionFlags = { [regionFlag.region]: regionFlag.violations };
    const cachedDoc = await cacheProduct(doc);
    return { product: cachedDoc, fromCache: false };
  }

  // merge AI ingredientRisks back to ingredients
  const enrichedIngredients = raw.ingredients.map((ing) => {
    const match = ai.ingredientRisks.find(
      (r) => r.name.toLowerCase() === ing.name.toLowerCase()
    );
    if (!match) return ing;
    return {
      ...ing,
      isHarmful: !!match.isHarmful,
      riskLevel: match.riskLevel || "low",
      description: match.description || "",
    };
  });

  const doc = {
    ...raw,
    ingredients: enrichedIngredients,
    safetyScore: ai.safetyScore,
    summary: ai.summary,
    healthWarnings: ai.healthWarnings,
    harmfulSubstances: ai.harmfulSubstances,
  };

  const regionFlag = computeRegionFlags(doc, userContext.region || "US");
  doc.regionFlags = { [regionFlag.region]: regionFlag.violations };

  const cachedDoc = await cacheProduct(doc);
  return { product: cachedDoc, fromCache: false };
}

module.exports = {
  analyzeAndCacheProduct,
  validateBarcode,
};
