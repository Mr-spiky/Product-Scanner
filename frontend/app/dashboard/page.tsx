"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BarcodeScanner } from "@/components/BarcodeScanner";

// Mock product data for demo
const DEMO_PRODUCTS: Record<string, any> = {
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
  }
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);

  useEffect(() => {
    const barcode = searchParams.get('barcode');
    if (barcode) {
      handleBarcodeScan(barcode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleBarcodeScan = (barcode: string) => {
    setShowScanner(false);
    
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
      summary: "Product information not available in demo database."
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
    const colors: Record<string, string> = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    return colors[score.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-black px-4 md:px-8 py-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Product Scanner Demo</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Scan barcodes or try with demo product code: 737628064502
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            {showScanner ? 'Close Scanner' : 'Open Scanner'}
          </button>
        </div>

        {showScanner && (
          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <BarcodeScanner onScan={handleBarcodeScan} />
          </Card>
        )}

        {selectedProduct && (
          <Card className="bg-neutral-900 border-neutral-800 p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedProduct.productName}</h2>
                <p className="text-neutral-400">{selectedProduct.brand}</p>
                <p className="text-sm text-neutral-500">Barcode: {selectedProduct.barcode}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm text-neutral-400">Safety Score</p>
                  <p className={`text-3xl font-bold ${getSafetyColor(selectedProduct.safetyScore)}`}>
                    {selectedProduct.safetyScore}/10
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-400">Nutri-Score</p>
                  <div className={`text-3xl font-bold ${getNutriScoreColor(selectedProduct.nutriScore)} inline-block px-4 py-2 rounded`}>
                    {selectedProduct.nutriScore.toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Analysis Summary</h3>
                <p className="text-neutral-300">{selectedProduct.summary}</p>
              </div>

              {selectedProduct.harmfulSubstances.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-red-500">Harmful Substances</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedProduct.harmfulSubstances.map((substance: string, idx: number) => (
                      <li key={idx} className="text-red-400">{substance}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.healthWarnings.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-orange-500">Health Warnings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedProduct.healthWarnings.map((warning: string, idx: number) => (
                      <li key={idx} className="text-orange-400">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                <div className="space-y-2">
                  {selectedProduct.ingredients.map((ingredient: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-neutral-800 rounded">
                      <span className={ingredient.isHarmful ? 'text-red-400' : 'text-neutral-300'}>
                        {ingredient.name}
                      </span>
                      <span className="text-neutral-500 text-sm">{ingredient.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {scannedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Scans</h2>
            <div className="grid gap-4">
              {scannedProducts.map((product, idx) => (
                <Card key={idx} className="bg-neutral-900 border-neutral-800 p-4 cursor-pointer hover:bg-neutral-800 transition-colors" onClick={() => setSelectedProduct(product)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{product.productName}</h3>
                      <p className="text-sm text-neutral-400">{product.brand}</p>
                    </div>
                    <div className={`text-xl font-bold ${getSafetyColor(product.safetyScore)}`}>
                      {product.safetyScore}/10
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
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
