"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export function Navbar() {
  const { user, loading, signIn, signOutUser } = useAuth();

  return (
    <header className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-black font-bold text-lg">
          PI
        </div>
        <span className="font-semibold tracking-tight text-neutral-100">
          Product Insight
        </span>
      </div>
      <nav className="flex items-center gap-4 text-xs md:text-sm text-neutral-300">
        <Link href="/" className="hover:text-white transition hidden md:inline-block">
          Home
        </Link>
        <Link href="/scan" className="hover:text-white transition">
          Scan
        </Link>
        <Link href="/dashboard" className="hover:text-white transition hidden md:inline-block">
          Dashboard
        </Link>
        <Link href="/admin" className="hover:text-white transition hidden md:inline-block">
          Admin
        </Link>
        {!loading && (
          <>
            {user ? (
              <button
                onClick={signOutUser}
                className="px-3 py-1.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={signIn}
                className="px-3 py-1.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition"
              >
                Login
              </button>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
