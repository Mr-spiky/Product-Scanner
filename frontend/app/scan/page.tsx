"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BarcodeScanner } from "@/components/BarcodeScanner";

function ScanPageContent() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);

  const handleBarcodeScan = (barcode: string) => {
    // Redirect to dashboard with the scanned barcode
    router.push(`/dashboard?barcode=${barcode}`);
  };

  return (
    <main className="min-h-screen bg-black px-4 md:px-8 py-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">Scan Product Barcode</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Point your camera at any product barcode to get instant health analysis
          </p>
        </section>

        {/* Scanner */}
        <Card className="p-6">
          {scanning ? (
            <div className="space-y-4">
              <BarcodeScanner onScan={handleBarcodeScan} />
              <div className="text-center">
                <button
                  onClick={() => setScanning(false)}
                  className="text-sm text-neutral-400 hover:text-white transition"
                >
                  Close Scanner
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <button
                onClick={() => setScanning(true)}
                className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
              >
                📱 Open Scanner
              </button>
            </div>
          )}
        </Card>

        {/* Demo Codes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">📋 Try Demo Barcodes</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Click any code below to see instant analysis without scanning:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleBarcodeScan("737628064502")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">737628064502</code>
              <p className="text-xs text-neutral-400 mt-1">Coca-Cola Classic</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-red-500 font-bold">4/10</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">E</span>
              </div>
            </button>

            <button
              onClick={() => handleBarcodeScan("012345678905")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">012345678905</code>
              <p className="text-xs text-neutral-400 mt-1">Organic Apple Juice</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-500 font-bold">8/10</span>
                <span className="bg-lime-500 text-white text-xs px-2 py-0.5 rounded">B</span>
              </div>
            </button>

            <button
              onClick={() => handleBarcodeScan("894756231504")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">894756231504</code>
              <p className="text-xs text-neutral-400 mt-1">Chocolate Chip Cookies</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-500 font-bold">5/10</span>
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">D</span>
              </div>
            </button>

            <button
              onClick={() => handleBarcodeScan("765432189012")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">765432189012</code>
              <p className="text-xs text-neutral-400 mt-1">Whole Grain Bread</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-500 font-bold">9/10</span>
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">A</span>
              </div>
            </button>

            <button
              onClick={() => handleBarcodeScan("555666777888")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">555666777888</code>
              <p className="text-xs text-neutral-400 mt-1">Energy Drink Extreme</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-red-500 font-bold">3/10</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">E</span>
              </div>
            </button>

            <button
              onClick={() => handleBarcodeScan("999888777666")}
              className="bg-neutral-900 p-4 rounded-lg text-left hover:bg-neutral-800 transition"
            >
              <code className="text-green-400 font-mono text-sm">999888777666</code>
              <p className="text-xs text-neutral-400 mt-1">Greek Yogurt Natural</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-500 font-bold">9/10</span>
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">A</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/30">
          <h3 className="font-semibold mb-2">💡 How It Works</h3>
          <ol className="text-sm text-blue-200 space-y-2">
            <li>1. Click a demo barcode above for instant results</li>
            <li>2. Or use the scanner to scan any real product barcode</li>
            <li>3. Get detailed ingredient analysis and health warnings</li>
            <li>4. View safety scores and nutritional information</li>
          </ol>
        </Card>
      </div>
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading scanner...</p>
        </div>
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  );
}
