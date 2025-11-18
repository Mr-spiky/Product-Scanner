"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-20 gap-8 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://video.wixstatic.com/video/d5c245_ea2270e596434428a1629246cab78f23/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="max-w-2xl text-center space-y-4 relative z-10">
        <p className="text-xs tracking-[0.35em] uppercase text-neutral-400">
          AI-POWERED PRODUCT SAFETY
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
          Scan any product. Get instant safety insights.
        </h1>
        <p className="text-sm md:text-base text-neutral-400">
          Use your camera to scan barcodes and see ingredients, harmful
          substances, and region-specific warnings—summarized by AI for
          fast, human-readable decisions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
          >
            Try Demo
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            View dashboard
          </Link>
        </div>
      </div>
      
      {/* Demo Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl relative z-10">
        <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-xl border border-neutral-800">
          <div className="text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-white mb-2">Barcode Scanner</h3>
          <p className="text-sm text-neutral-400">Scan any product barcode with your camera</p>
        </div>
        <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-xl border border-neutral-800">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-white mb-2">Ingredient Analysis</h3>
          <p className="text-sm text-neutral-400">Get detailed breakdown of ingredients</p>
        </div>
        <div className="bg-neutral-900/80 backdrop-blur-sm p-6 rounded-xl border border-neutral-800">
          <div className="text-2xl mb-2">⚠️</div>
          <h3 className="font-semibold text-white mb-2">Safety Warnings</h3>
          <p className="text-sm text-neutral-400">Identify harmful substances instantly</p>
        </div>
      </div>
    </section>
  );
}
