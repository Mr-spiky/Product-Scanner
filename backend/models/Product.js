const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number },
  isHarmful: { type: Boolean, default: false },
  riskLevel: {
    type: String,
    enum: ["low", "moderate", "high"],
    default: "low",
  },
  description: { type: String },
});

const ProductSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true, unique: true },
    productName: { type: String },
    brand: { type: String },
    category: { type: String },
    imageUrl: { type: String },
    nutriScore: { type: String },
    nutriments: { type: Object }, // raw nutriments from API
    ingredients: [IngredientSchema],

    // AI analysis
    safetyScore: { type: Number, min: 0, max: 10 },
    summary: { type: String },
    healthWarnings: [String],
    harmfulSubstances: [String],

    regionFlags: { type: Object }, // per region violations

    // meta
    cachedAt: { type: Date },
    cacheExpiry: { type: Date },
    scanCount: { type: Number, default: 0 },
    lastScannedAt: { type: Date },
    source: { type: String, default: "live" }, // live | cache
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
