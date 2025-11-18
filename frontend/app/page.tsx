"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen -mt-16 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background Video - Full Screen */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="https://video.wixstatic.com/video/d5c245_ea2270e596434428a1629246cab78f23/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="max-w-3xl text-center space-y-6 relative z-10 pt-20">
        <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
          <p className="text-xs tracking-[0.35em] uppercase text-white/90">
            AI-POWERED PRODUCT SAFETY
          </p>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
          Scan any product.<br />Get instant safety insights.
        </h1>
        
        <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Use your camera to scan barcodes and see ingredients, harmful
          substances, and region-specific warnings—summarized by AI for
          fast, human-readable decisions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-white text-black text-base font-semibold hover:bg-neutral-200 transition-all hover:scale-105 shadow-xl"
          >
            Try Demo
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white text-base font-medium hover:bg-white/20 transition-all hover:scale-105"
          >
            View Dashboard
          </Link>
        </div>
      </div>
      
      {/* Demo Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 mb-12 max-w-5xl relative z-10">
        <div className="group bg-white/5 backdrop-blur-md hover:bg-white/10 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="font-bold text-xl text-white mb-3">Barcode Scanner</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">Scan any product barcode with your camera instantly</p>
        </div>
        <div className="group bg-white/5 backdrop-blur-md hover:bg-white/10 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-bold text-xl text-white mb-3">Ingredient Analysis</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">Get detailed breakdown of all ingredients</p>
        </div>
        <div className="group bg-white/5 backdrop-blur-md hover:bg-white/10 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-bold text-xl text-white mb-3">Safety Warnings</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">Identify harmful substances instantly</p>
        </div>
      </div>
    </section>
  );
}
