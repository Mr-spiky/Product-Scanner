"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        if ("vibrate" in navigator) {
          (navigator as any).vibrate?.(200);
        }
        onScan(decodedText);
      },
      () => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        id="barcode-reader"
        className="rounded-xl overflow-hidden border border-white/10"
      />
      <p className="mt-3 text-sm text-neutral-400 text-center">
        Point your camera at a product barcode. Works best in good lighting.
      </p>
    </div>
  );
}
