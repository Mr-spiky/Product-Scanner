"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <section className="flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-20 gap-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
          Sign in to Product Insight
        </h1>
        <p className="text-sm text-neutral-400">
          Continue with your Google account to start scanning products and
          see personalized safety insights.
        </p>
        <div className="pt-4">
          <button
            onClick={signIn}
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>
      </div>
    </section>
  );
}
