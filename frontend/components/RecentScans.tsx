"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

interface RecentScan {
  id: string;
  barcode: string;
  name: string;
  safetyScore?: number;
  region?: string;
  userId?: string | null;
  loggedAt?: string;
}

const BACKEND_RECENT =
  process.env.NEXT_PUBLIC_BACKEND_URL_RECENT ||
  "http://localhost:5000/api/products/recent-scans";

export function RecentScans() {
  const [scans, setScans] = useState<RecentScan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await axios.get(BACKEND_RECENT);
        setScans(res.data.scans || []);
        setError(null);
      } catch (err) {
        setError("Unable to load recent scans.");
      }
    };

    fetchScans();
    const id = setInterval(fetchScans, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="mt-4 p-4 md:p-6 max-w-xl">
      <h3 className="text-sm font-semibold text-white mb-3">
        Recent community scans
      </h3>
      {error && (
        <p className="text-xs text-red-400 mb-2">
          {error} (Check backend & Firebase config)
        </p>
      )}
      {!error && scans.length === 0 && (
        <p className="text-xs text-neutral-500">
          No scans yet. Once users start scanning, they will appear here
          in real time.
        </p>
      )}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 text-xs text-neutral-200">
        {scans.map((scan) => {
          const d =
            scan.loggedAt && !Number.isNaN(Date.parse(scan.loggedAt))
              ? new Date(scan.loggedAt)
              : null;

          const color =
            (scan.safetyScore ?? 0) <= 3
              ? "text-red-400"
              : (scan.safetyScore ?? 0) <= 6
              ? "text-yellow-300"
              : "text-emerald-400";

          return (
            <div
              key={scan.id}
              className="flex items-center justify-between border-b border-white/5 pb-1 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium truncate">{scan.name}</p>
                <p className="text-[10px] text-neutral-500">
                  {scan.barcode} {scan.region && `• ${scan.region}`}
                </p>
              </div>
              <div className="text-right ml-2">
                <p className={color}>
                  {typeof scan.safetyScore === "number"
                    ? `${scan.safetyScore}/10`
                    : "N/A"}
                </p>
                {d && (
                  <p className="text-[10px] text-neutral-500">
                    {d.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
