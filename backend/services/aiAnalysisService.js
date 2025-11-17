const OpenAI = require("openai");

let client = null;
function getClient() {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  OPENAI_API_KEY not set. AI analysis disabled.");
    return null;
  }
  client = new OpenAI({ apiKey });
  return client;
}

/**
 * Use OpenAI to analyze ingredients and nutriments.
 * Returns:
 * - safetyScore (0-10)
 * - harmfulSubstances[]
 * - healthWarnings[]
 * - ingredientRisks[] (mapped back to ingredients)
 * - summary (short human readable)
 */
async function analyzeProductWithAI(product, userContext = {}) {
  const c = getClient();
  if (!c) {
    console.log("ℹ️  Using fallback analysis (OpenAI not configured)");
    return generateFallbackAnalysis(product, userContext);
  }

  const { productName, brand, category, ingredients, nutriments, nutriScore } =
    product;

  const systemPrompt =
    "You are a cautious nutrition and ingredient safety assistant. " +
    "You explain risks in clear, non-alarming but honest language. " +
    "You always remind users that this is not medical advice.";

  const userPrompt = {
    role: "user",
    content: [
      {
        type: "text",
        text:
          "Analyze the following product for potential health risks. " +
          "Give a safetyScore from 0 (very risky) to 10 (very safe). " +
          "Identify harmful or controversial ingredients and summarize their risk. " +
          "Return JSON ONLY with keys: safetyScore (number), harmfulSubstances (array of strings), " +
          "healthWarnings (array of strings), ingredientRisks (array of {name, riskLevel, description, isHarmful}), " +
          "summary (string). Do not include any other keys or text.",
      },
      {
        type: "text",
        text: `Product name: ${productName}
Brand: ${brand}
Category: ${category}
NutriScore: ${nutriScore}
Nutriments (100g or 100ml basis, if given): ${JSON.stringify(
          nutriments || {}
        )}
Ingredients: ${ingredients
          .map((i) => `${i.name} (${i.percentage || "?"}%)`)
          .join(", ")}
User context (may influence warnings): ${JSON.stringify(userContext)}`,
      },
    ],
  };

  try {
    const completion = await c.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, userPrompt],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    // basic sanity checks
    parsed.safetyScore = Math.max(
      0,
      Math.min(10, Number(parsed.safetyScore || 0))
    );

    if (!Array.isArray(parsed.harmfulSubstances))
      parsed.harmfulSubstances = [];
    if (!Array.isArray(parsed.healthWarnings)) parsed.healthWarnings = [];
    if (!Array.isArray(parsed.ingredientRisks)) parsed.ingredientRisks = [];

    return parsed;
  } catch (err) {
    console.error("OpenAI analysis error:", err.message);
    return null;
  }
}

/**
 * Fallback analysis when OpenAI is not available
 * Provides basic rule-based analysis
 */
function generateFallbackAnalysis(product, userContext = {}) {
  const { productName, brand, ingredients, nutriments, nutriScore } = product;
  
  // Common harmful/controversial ingredients list
  const knownHarmful = [
    'palm oil', 'high fructose corn syrup', 'artificial sweetener', 
    'aspartame', 'msg', 'monosodium glutamate', 'trans fat',
    'sodium benzoate', 'artificial color', 'red 40', 'yellow 5',
    'bha', 'bht', 'sodium nitrite', 'potassium bromate'
  ];
  
  const harmfulSubstances = [];
  const ingredientRisks = [];
  const healthWarnings = [];
  
  // Analyze ingredients
  ingredients.forEach(ingredient => {
    const nameLower = ingredient.name.toLowerCase();
    const isHarmful = knownHarmful.some(harmful => nameLower.includes(harmful));
    
    if (isHarmful) {
      harmfulSubstances.push(ingredient.name);
      ingredientRisks.push({
        name: ingredient.name,
        riskLevel: 'moderate',
        description: 'This ingredient may have health concerns. Consider consulting with a healthcare professional.',
        isHarmful: true
      });
    }
  });
  
  // Analyze nutriments
  if (nutriments) {
    if (nutriments.sugars_100g > 15) {
      healthWarnings.push('High sugar content (>15g per 100g)');
    }
    if (nutriments.salt_100g > 1.5) {
      healthWarnings.push('High salt content (>1.5g per 100g)');
    }
    if (nutriments.saturated_fat_100g > 5) {
      healthWarnings.push('High saturated fat (>5g per 100g)');
    }
  }
  
  // Calculate safety score based on findings
  let safetyScore = 7; // Start with neutral-good score
  
  if (harmfulSubstances.length > 0) safetyScore -= harmfulSubstances.length * 1.5;
  if (healthWarnings.length > 0) safetyScore -= healthWarnings.length * 0.5;
  
  // NutriScore bonus/penalty
  if (nutriScore === 'a' || nutriScore === 'b') safetyScore += 1;
  if (nutriScore === 'd' || nutriScore === 'e') safetyScore -= 1;
  
  safetyScore = Math.max(0, Math.min(10, Math.round(safetyScore)));
  
  // Generate summary
  let summary = `${productName} by ${brand} `;
  if (safetyScore >= 7) {
    summary += 'appears to be relatively safe for consumption. ';
  } else if (safetyScore >= 5) {
    summary += 'has some concerns that should be considered. ';
  } else {
    summary += 'has multiple health concerns that warrant attention. ';
  }
  
  if (harmfulSubstances.length > 0) {
    summary += `Contains potentially harmful ingredients: ${harmfulSubstances.slice(0, 3).join(', ')}. `;
  }
  
  summary += 'Note: This is a basic automated analysis. For detailed health advice, consult a healthcare professional.';
  
  return {
    safetyScore,
    harmfulSubstances,
    healthWarnings,
    ingredientRisks,
    summary,
    fallbackMode: true
  };
}

module.exports = { analyzeProductWithAI };
