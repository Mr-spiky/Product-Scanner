"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BarcodeScanner } from "@/components/BarcodeScanner";

// Mock product data for demo
const DEMO_PRODUCTS: any = {
  "737628064502": {
    productName: "Coca-Cola Classic",
    brand: "Coca-Cola",
    category: "Beverages",
    nutriScore: "e",
    safetyScore: 4,
    ingredients: [
      { name: "Carbonated Water", percentage: "89", isHarmful: false, riskLevel: "safe" },
      { name: "High Fructose Corn Syrup", percentage: "10", isHarmful: true, riskLevel: "high" },
      { name: "Caramel Color", percentage: "0.5", isHarmful: true, riskLevel: "moderate" },
      { name: "Phosphoric Acid", percentage: "0.3", isHarmful: false, riskLevel: "low" },
      { name: "Natural Flavors", percentage: "0.2", isHarmful: false, riskLevel: "safe" }
    ],
    nutriments: {
      sugars_100g: 10.6,
      salt_100g: 0.04,
      saturated_fat_100g: 0
    },
    harmfulSubstances: ["High Fructose Corn Syrup", "Caramel Color"],
    healthWarnings: ["High sugar content (>15g per 100g)", "Contains artificial coloring"],
    summary: "Coca-Cola Classic contains high levels of sugar and artificial ingredients that may pose health risks with regular consumption. Consider healthier beverage alternatives."
  },
  "012345678905": {
    productName: "Organic Apple Juice",
    brand: "Nature's Best",
    category: "Beverages",
    nutriScore: "b",
    safetyScore: 8,
    ingredients: [
      { name: "Organic Apple Juice", percentage: "100", isHarmful: false, riskLevel: "safe" }
    ],
    nutriments: {
      sugars_100g: 10,
      salt_100g: 0.01,
      saturated_fat_100g: 0
    },
    harmfulSubstances: [],
    healthWarnings: [],
    summary: "100% organic apple juice with no additives or preservatives. A healthy beverage choice with natural sugars."
  },
  "894756231504": {
    productName: "Chocolate Chip Cookies",
    brand: "Sweet Treats",
    category: "Snacks",
    nutriScore: "d",
    safetyScore: 5,
    ingredients: [
      { name: "Wheat Flour", percentage: "45", isHarmful: false, riskLevel: "safe" },
      { name: "Sugar", percentage: "25", isHarmful: false, riskLevel: "moderate" },
      { name: "Palm Oil", percentage: "15", isHarmful: true, riskLevel: "moderate" },
      { name: "Chocolate Chips", percentage: "10", isHarmful: false, riskLevel: "low" },
      { name: "Eggs", percentage: "3", isHarmful: false, riskLevel: "safe" },
      { name: "Artificial Vanilla", percentage: "2", isHarmful: true, riskLevel: "low" }
    ],
    nutriments: {
      sugars_100g: 25,
      salt_100g: 0.8,
      saturated_fat_100g: 12
    },
    harmfulSubstances: ["Palm Oil", "Artificial Vanilla"],
    healthWarnings: ["High sugar content", "High saturated fat", "Contains palm oil"],
    summary: "These cookies contain high levels of sugar and saturated fat. Palm oil and artificial flavoring are present. Best consumed occasionally as a treat."
  },
  "765432189012": {
    productName: "Whole Grain Bread",
    brand: "Baker's Choice",
    category: "Bakery",
    nutriScore: "a",
    safetyScore: 9,
    ingredients: [
      { name: "Whole Wheat Flour", percentage: "70", isHarmful: false, riskLevel: "safe" },
      { name: "Water", percentage: "25", isHarmful: false, riskLevel: "safe" },
      { name: "Yeast", percentage: "2", isHarmful: false, riskLevel: "safe" },
      { name: "Salt", percentage: "2", isHarmful: false, riskLevel: "safe" },
      { name: "Olive Oil", percentage: "1", isHarmful: false, riskLevel: "safe" }
    ],
    nutriments: {
      sugars_100g: 3,
      salt_100g: 1.2,
      saturated_fat_100g: 0.5
    },
    harmfulSubstances: [],
    healthWarnings: [],
    summary: "Healthy whole grain bread with simple, natural ingredients. Good source of fiber and nutrients. Excellent choice for daily consumption."
  },
  "555666777888": {
    productName: "Energy Drink Extreme",
    brand: "PowerBoost",
    category: "Beverages",
    nutriScore: "e",
    safetyScore: 3,
    ingredients: [
      { name: "Carbonated Water", percentage: "85", isHarmful: false, riskLevel: "safe" },
      { name: "Sugar", percentage: "11", isHarmful: false, riskLevel: "high" },
      { name: "Caffeine", percentage: "2", isHarmful: true, riskLevel: "high" },
      { name: "Taurine", percentage: "1", isHarmful: true, riskLevel: "moderate" },
      { name: "Artificial Colors", percentage: "0.5", isHarmful: true, riskLevel: "high" },
      { name: "Artificial Sweeteners", percentage: "0.5", isHarmful: true, riskLevel: "moderate" }
    ],
    nutriments: {
      sugars_100g: 11,
      salt_100g: 0.2,
      saturated_fat_100g: 0
    },
    harmfulSubstances: ["High Caffeine", "Taurine", "Artificial Colors", "Artificial Sweeteners"],
    healthWarnings: ["Extremely high caffeine content", "Contains multiple artificial additives", "Not recommended for children or pregnant women", "May cause heart palpitations"],
    summary: "This energy drink contains dangerously high levels of caffeine and multiple artificial additives. Regular consumption may lead to serious health risks including cardiovascular issues. Not recommended."
  },
  "999888777666": {
    productName: "Greek Yogurt Natural",
    brand: "Dairy Fresh",
    category: "Dairy",
    nutriScore: "a",
    safetyScore: 9,
    ingredients: [
      { name: "Pasteurized Milk", percentage: "95", isHarmful: false, riskLevel: "safe" },
      { name: "Live Active Cultures", percentage: "5", isHarmful: false, riskLevel: "safe" }
    ],
    nutriments: {
      sugars_100g: 4,
      salt_100g: 0.1,
      saturated_fat_100g: 2
    },
    harmfulSubstances: [],
    healthWarnings: [],
    summary: "Excellent source of protein and probiotics. Made with only natural ingredients. Great for digestive health and overall nutrition."
  }
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);

  // Check for barcode in URL on mount
  useEffect(() => {
    const barcode = searchParams.get('barcode');
    if (barcode) {
      handleBarcodeScan(barcode);
    }
  }, [searchParams]);

  const handleBarcodeScan = (barcode: string) => {
    setShowScanner(false);
    
    // Get product data or create generic one
    const product = DEMO_PRODUCTS[barcode] || {
      productName: `Product ${barcode.slice(-6)}`,
      brand: "Unknown Brand",
      category: "General",
      nutriScore: "c",
      safetyScore: 7,
      ingredients: [
        { name: "Various Ingredients", percentage: "100", isHarmful: false, riskLevel: "safe" }
      ],
      nutriments: {
        sugars_100g: 5,
        salt_100g: 1,
        saturated_fat_100g: 2
      },
      harmfulSubstances: [],
      healthWarnings: [],
      summary: "Product information not available in demo database. This is a placeholder result."
    };

    const scannedProduct = {
      ...product,
      barcode,
      scannedAt: new Date().toISOString()
    };

    setSelectedProduct(scannedProduct);
    setScannedProducts(prev => [scannedProduct, ...prev].slice(0, 10));
  };

  const getSafetyColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    if (score >= 4) return "text-orange-500";
    return "text-red-500";
  };

  const getNutriScoreColor = (score: string) => {
    const colors: any = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <main className="min-h-screen bg-black px-4 md:px-8 py-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-3xl md:text-4xl font-semibold">Product Scanner Demo</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Scan barcodes or try with demo product code: 737628064502
          </p>
        </section>

        {/* Scanner Button */}
        <section>
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
          >
            {showScanner ? "Close Scanner" : "📱 Scan Barcode"}
          </button>
        </section>

        {/* Barcode Scanner */}
        {showScanner && (
          <Card className="p-6">
            <BarcodeScanner onScan={handleBarcodeScan} />
          </Card>
        )}

        {/* Selected Product Details */}
        {selectedProduct && (
          <Card className="p-6">
            <div className="space-y-6">
              {/* Product Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedProduct.productName}</h2>
                  <p className="text-neutral-400">{selectedProduct.brand}</p>
                  <p className="text-sm text-neutral-500">{selectedProduct.category}</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getSafetyColor(selectedProduct.safetyScore)}`}>
                    {selectedProduct.safetyScore}/10
                  </div>
                  <p className="text-xs text-neutral-400">Safety Score</p>
                </div>
              </div>

              {/* Nutri-Score */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400">Nutri-Score:</span>
                <span className={`${getNutriScoreColor(selectedProduct.nutriScore)} text-white font-bold px-3 py-1 rounded-lg text-sm uppercase`}>
                  {selectedProduct.nutriScore}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-neutral-900 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Analysis Summary</h3>
                <p className="text-sm text-neutral-300">{selectedProduct.summary}</p>
              </div>

              {/* Health Warnings */}
              {selectedProduct.healthWarnings && selectedProduct.healthWarnings.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">⚠️ Health Warnings</h3>
                  <div className="space-y-2">
                    {selectedProduct.healthWarnings.map((warning: string, idx: number) => (
                      <div key={idx} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm text-red-200">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Harmful Substances */}
              {selectedProduct.harmfulSubstances && selectedProduct.harmfulSubstances.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">🚫 Harmful Substances</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.harmfulSubstances.map((substance: string, idx: number) => (
                      <span key={idx} className="bg-orange-500/20 border border-orange-500/40 px-3 py-1 rounded-full text-xs text-orange-200">
                        {substance}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold mb-2">📋 Ingredients</h3>
                <div className="space-y-2">
                  {selectedProduct.ingredients.map((ing: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-lg ${ing.isHarmful ? 'bg-red-500/10 border border-red-500/30' : 'bg-neutral-900'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${ing.isHarmful ? 'text-red-200' : ''}`}>
                          {ing.name}
                        </span>
                        <span className="text-sm text-neutral-400">{ing.percentage}%</span>
                      </div>
                      {ing.isHarmful && (
                        <p className="text-xs text-red-300 mt-1">Risk Level: {ing.riskLevel}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutritional Info */}
              <div>
                <h3 className="font-semibold mb-2">🥗 Nutritional Information (per 100g/ml)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-900 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{selectedProduct.nutriments.sugars_100g}g</div>
                    <div className="text-xs text-neutral-400">Sugars</div>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{selectedProduct.nutriments.salt_100g}g</div>
                    <div className="text-xs text-neutral-400">Salt</div>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{selectedProduct.nutriments.saturated_fat_100g}g</div>
                    <div className="text-xs text-neutral-400">Sat. Fat</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Scans */}
        {scannedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scannedProducts.map((product, idx) => (
                <Card 
                  key={idx} 
                  className="p-4 cursor-pointer hover:bg-neutral-900 transition"
                  onClick={() => setSelectedProduct(product)}
                >
                  <h3 className="font-semibold">{product.productName}</h3>
                  <p className="text-sm text-neutral-400">{product.brand}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-lg font-bold ${getSafetyColor(product.safetyScore)}`}>
                      {product.safetyScore}/10
                    </span>
                    <span className={`${getNutriScoreColor(product.nutriScore)} text-white font-bold px-2 py-1 rounded text-xs uppercase`}>
                      {product.nutriScore}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Demo Instructions */}
        {!selectedProduct && !showScanner && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 How to Use This Demo</h3>
            <ol className="space-y-3 text-sm text-neutral-300">
              <li>1. Click "📱 Scan Barcode" button to open the camera scanner</li>
              <li>2. Point your camera at any barcode on a product</li>
              <li>3. Or manually enter one of these demo barcodes:</li>
            </ol>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">737628064502</code>
                <p className="text-xs text-neutral-400 mt-1">Coca-Cola Classic (Poor Score)</p>
              </div>
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">012345678905</code>
                <p className="text-xs text-neutral-400 mt-1">Organic Apple Juice (Good Score)</p>
              </div>
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">894756231504</code>
                <p className="text-xs text-neutral-400 mt-1">Chocolate Cookies (Average Score)</p>
              </div>
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">765432189012</code>
                <p className="text-xs text-neutral-400 mt-1">Whole Grain Bread (Excellent Score)</p>
              </div>
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">555666777888</code>
                <p className="text-xs text-neutral-400 mt-1">Energy Drink (Very Poor Score)</p>
              </div>
              <div className="bg-neutral-900 p-3 rounded-lg">
                <code className="text-green-400 font-mono">999888777666</code>
                <p className="text-xs text-neutral-400 mt-1">Greek Yogurt (Excellent Score)</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  💡 <strong>Demo Mode:</strong> This is a fully functional demo without API requirements. 
                  Product data is pre-loaded for demonstration purposes. Scan any barcode to see real-time analysis!
                </p>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-200">
                  ✅ <strong>Features:</strong> Safety scores • Ingredient breakdown • Health warnings • 
                  Nutri-Score rating • Harmful substance detection • Nutritional information
                </p>
              </div>
            </div>
          </Card>
        )} 
                Product data is mocked for demonstration purposes.
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function DemoDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
