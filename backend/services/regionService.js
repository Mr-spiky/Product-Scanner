/**
 * Simple region-based rule engine.
 * This is NOT legally complete – it's a placeholder example.
 */
const regionalRules = {
  US: {
    bannedIngredients: ["potassium bromate", "azodicarbonamide"],
    regulations: "FDA",
  },
  EU: {
    bannedIngredients: ["potassium bromate", "azodicarbonamide", "BHA", "BHT"],
    regulations: "EFSA",
  },
  IN: {
    bannedIngredients: ["carmoisine", "sunset yellow"],
    regulations: "FSSAI",
  },
};

function computeRegionFlags(product, regionCode = "US") {
  const rules = regionalRules[regionCode] || regionalRules.US;
  const ingredients = (product.ingredients || []).map((i) =>
    i.name.toLowerCase()
  );
  const violations = [];

  rules.bannedIngredients.forEach((banned) => {
    if (
      ingredients.some((name) =>
        name.includes(banned.toLowerCase())
      )
    ) {
      violations.push({
        ingredient: banned,
        reason: `Banned or restricted in ${regionCode} by ${rules.regulations}`,
      });
    }
  });

  return {
    region: regionCode,
    violations,
  };
}

module.exports = { computeRegionFlags };
