import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Product Insight",
  description: "Scan barcodes and get AI-powered safety insights in seconds.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
