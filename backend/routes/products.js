const express = require("express");
const rateLimit = require("express-rate-limit");
const { analyzeAndCacheProduct } = require("../services/productService");
const { logScanToFirestore, getRecentScans, verifyUserToken } = require("../config/firebase");

const router = express.Router();

const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: "Too many scans from this IP, please try again later." },
});

router.post("/scan", scanLimiter, async (req, res) => {
  try {
    const { barcode, userRegion, userContext, idToken } = req.body || {};

    if (!barcode) {
      return res.status(400).json({ message: "Barcode is required" });
    }

    let user = null;
    if (idToken) {
      user = await verifyUserToken(idToken);
    }

    const ctx = {
      region: userRegion || "US",
      ...userContext,
      userId: user ? user.uid : null,
    };

    const { product } = await analyzeAndCacheProduct(barcode, ctx);
    if (!product) {
      return res.status(404).json({
        message:
          "Product not found in Open Food Facts. Try another barcode or add custom data later.",
      });
    }

    const harmfulIngredients = (product.ingredients || []).filter(
      (i) => i.isHarmful
    );
    const highRisk = harmfulIngredients.filter((i) => i.riskLevel === "high");

    const response = {
      ...product,
      harmfulSummary: {
        totalHarmful: harmfulIngredients.length,
        highRiskCount: highRisk.length,
        harmfulIngredients,
      },
    };

    // Log scan summary
    logScanToFirestore({
      barcode: product.barcode,
      name: product.productName,
      safetyScore: product.safetyScore,
      region: ctx.region,
      userId: user ? user.uid : null,
    }).catch(() => {});

    res.json(response);
  } catch (err) {
    console.error("Scan error:", err);
    if (err.code === "INVALID_BARCODE") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recent-scans", async (req, res) => {
  try {
    const data = await getRecentScans(10);
    res.json({ scans: data });
  } catch (err) {
    console.error("Recent scans error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
