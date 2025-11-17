"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

// Mock scan data for demo with static timestamps
const DEMO_SCANS = [
  {
    id: "1",
    barcode: "737628064502",
    productName: "Coca-Cola Classic",
    safetyScore: 4,
    loggedAt: "2025-11-17T08:30:00.000Z",
    userEmail: "demo@user.com"
  },
  {
    id: "2",
    barcode: "012345678905",
    productName: "Organic Apple Juice",
    safetyScore: 8,
    loggedAt: "2025-11-17T07:15:00.000Z",
    userEmail: "demo@user.com"
  }
];

export default function AdminPage() {
  const [scans] = useState<any[]>(DEMO_SCANS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black px-4 md:px-8 py-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <section>
          <h1 className="text-3xl md:text-4xl font-semibold">Admin Dashboard (Demo)</h1>
          <p className="mt-2 text-sm text-neutral-400">
            View recent product scans and analytics
          </p>
        </section>

        <section>
          <Card className="p-6 bg-neutral-900 border-neutral-800">
            <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
            {scans.length === 0 ? (
              <p className="text-xs text-neutral-500">No scans yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 text-xs text-neutral-200">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between border-b border-white/5 pb-1 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {scan.productName || "Unknown product"}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {scan.barcode} • {scan.userEmail}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      {typeof scan.safetyScore === "number" && (
                        <p
                          className={
                            scan.safetyScore <= 3
                              ? "text-red-400"
                              : scan.safetyScore <= 6
                              ? "text-yellow-300"
                              : "text-emerald-400"
                          }
                        >
                          {scan.safetyScore}/10
                        </p>
                      )}
                      {mounted && scan.loggedAt && (
                        <p className="text-[10px] text-neutral-500">
                          {new Date(scan.loggedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
