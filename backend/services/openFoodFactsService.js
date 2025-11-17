const axios = require("axios");

/**
 * Fetch product info from Open Food Facts.
 * This API is public and does not require an API key.
 */
async function fetchProductFromOpenFoodFacts(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  try {
    const res = await axios.get(url, { timeout: 12000 });
    if (!res.data || res.data.status !== 1) return null;

    const p = res.data.product;

    const ingredients = (p.ingredients || []).map((ing) => ({
      name: ing.text || "Unknown ingredient",
      percentage: ing.percent_estimate || ing.percent || undefined,
      // basic guess; AI will refine
      isHarmful: false,
      riskLevel: "low",
      description: "",
    }));

    return {
      barcode,
      productName: p.product_name || p.generic_name || "Unknown product",
      brand: (p.brands_tags && p.brands_tags[0]) || p.brands || "",
      category:
        (p.categories_tags && p.categories_tags[0]) ||
        (p.categories_tags && p.categories_tags.join(", ")) ||
        "",
      imageUrl: p.image_front_small_url || p.image_thumb_url || p.image_url,
      nutriScore: p.nutriscore_grade || "",
      nutriments: p.nutriments || {},
      ingredients,
    };
  } catch (err) {
    console.error("OpenFoodFacts error:", err.message);
    return null;
  }
}

module.exports = { fetchProductFromOpenFoodFacts };
