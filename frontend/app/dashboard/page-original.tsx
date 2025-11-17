"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db, doc, setDoc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from "@/lib/firebaseClient";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [prefs, setPrefs] = useState<any>({
    allergens: [],
    dietaryGoals: [],
    restrictedIngredients: [],
  });
  const [scans, setScans] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, "user_profiles", user.uid);
    getDoc(profileRef).then((snap) => {
      if (snap.exists()) {
        setPrefs({ ...prefs, ...(snap.data() as any) });
      }
    });

    const scansRef = collection(db, "user_scans");
    const q = query(
      scansRef,
      where("userId", "==", user.uid),
      orderBy("scannedAt", "desc"),
      limit(20)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((s) => list.push({ id: s.id, ...(s.data() as any) }));
      setScans(list);
    });
    return () => unsub();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await setDoc(doc(db, "user_profiles", user.uid), prefs, { merge: true });
    setSaving(false);
  };

  if (loading) return <main className="p-8 text-sm text-neutral-400">Loading...</main>;
  if (!user)
    return (
      <main className="p-8 text-sm text-neutral-400">
        Please login to view your dashboard.
      </main>
    );

  return (
    <main className="min-h-screen bg-black px-4 md:px-8 py-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <section>
          <h1 className="text-3xl md:text-4xl font-semibold">Your Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your preferences and see your latest scans.
          </p>
        </section>

        <section>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Allergens</p>
                <input
                  type="text"
                  value={prefs.allergens.join(", ")}
                  onChange={(e) =>
                    setPrefs((p: any) => ({
                      ...p,
                      allergens: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="peanuts, dairy, gluten"
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Dietary Goals</p>
                <input
                  type="text"
                  value={prefs.dietaryGoals.join(", ")}
                  onChange={(e) =>
                    setPrefs((p: any) => ({
                      ...p,
                      dietaryGoals: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="low-sodium, low-sugar"
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Restricted Ingredients</p>
                <input
                  type="text"
                  value={prefs.restrictedIngredients.join(", ")}
                  onChange={(e) =>
                    setPrefs((p: any) => ({
                      ...p,
                      restrictedIngredients: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="MSG, artificial colors"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 px-5 py-2 rounded-xl bg-white text-black text-xs font-medium hover:bg-neutral-200 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </Card>
        </section>

        <section>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
            {scans.length === 0 ? (
              <p className="text-xs text-neutral-500">
                You haven&apos;t scanned any products yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 text-xs text-neutral-200">
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
                        {scan.barcode}
                        {scan.scannedAt &&
                          ` • ${new Date(scan.scannedAt).toLocaleString()}`}
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
                      {scan.isFavorite && (
                        <p className="text-[10px] text-yellow-300">★ Favorite</p>
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
