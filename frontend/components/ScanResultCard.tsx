import { Card } from "@/components/ui/card";

interface Ingredient {
  name: string;
  percentage?: number;
  isHarmful: boolean;
  riskLevel: "low" | "moderate" | "high";
  description?: string;
}

interface RegionFlags {
  [region: string]: { ingredient: string; reason: string }[];
}

interface ScanResultCardProps {
  result: {
    barcode: string;
    productName: string;
    brand?: string;
    category?: string;
    imageUrl?: string;
    nutriScore?: string;
    nutriments?: Record<string, any>;
    safetyScore?: number;
    summary?: string;
    healthWarnings?: string[];
    harmfulSubstances?: string[];
    ingredients: Ingredient[];
    harmfulSummary?: {
      totalHarmful: number;
      highRiskCount: number;
      harmfulIngredients: Ingredient[];
    };
    regionFlags?: RegionFlags;
    source?: string;
    cachedAt?: string;
  };
}

export function ScanResultCard({ result }: ScanResultCardProps) {
  const riskColor =
    (result.safetyScore ?? 0) <= 3
      ? "text-red-400"
      : (result.safetyScore ?? 0) <= 6
      ? "text-yellow-300"
      : "text-emerald-400";

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10 p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {result.imageUrl && (
          <div className="w-full md:w-40">
            <img
              src={result.imageUrl}
              alt={result.productName}
              className="w-full rounded-xl border border-white/10"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {result.productName}
          </h2>
          <p className="mt-1 text-neutral-400 text-sm">
            {result.brand && <span className="mr-2">{result.brand} •</span>}
            {result.category && <span>{result.category}</span>}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Barcode: {result.barcode} • Source: {result.source || "live/cache"}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            {typeof result.safetyScore === "number" && (
              <div>
                <p className="text-neutral-300">Safety Score</p>
                <p className={`text-xl font-semibold ${riskColor}`}>
                  {result.safetyScore}/10
                </p>
              </div>
            )}
            {result.nutriScore && (
              <div>
                <p className="text-neutral-300">Nutri-Score</p>
                <p className="text-xl font-semibold text-neutral-100 uppercase">
                  {result.nutriScore}
                </p>
              </div>
            )}
          </div>

          {result.summary && (
            <p className="mt-4 text-neutral-200 leading-relaxed">
              {result.summary}
            </p>
          )}
        </div>
      </div>

      {result.healthWarnings && result.healthWarnings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-red-400">
            Health Warnings
          </h3>
          <ul className="mt-3 list-disc list-inside text-sm text-neutral-200 space-y-1">
            {result.healthWarnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white">
          Ingredient Breakdown
        </h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2">
          {result.ingredients.map((ing, idx) => (
            <div
              key={idx}
              className="border border-white/5 rounded-xl p-3 bg-white/5"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-100">
                  {ing.name}
                </span>
                <span
                  className={
                    ing.riskLevel === "high"
                      ? "text-red-400"
                      : ing.riskLevel === "moderate"
                      ? "text-yellow-300"
                      : "text-emerald-400"
                  }
                >
                  {ing.riskLevel.toUpperCase()}
                </span>
              </div>
              {typeof ing.percentage === "number" && (
                <p className="text-xs text-neutral-400 mt-1">
                  Approx. {ing.percentage}% of product.
                </p>
              )}
              {ing.description && (
                <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                  {ing.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {result.regionFlags && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white">
            Regional Compliance
          </h3>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-xs text-neutral-200">
            {Object.entries(result.regionFlags).map(([region, violations]) => (
              <div
                key={region}
                className="border border-white/5 rounded-xl p-3 bg-white/5"
              >
                <p className="font-semibold mb-1">{region}</p>
                {(violations as any[]).length === 0 ? (
                  <p className="text-neutral-400">No flagged ingredients.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {(violations as any[]).map((v, idx) => (
                      <li key={idx}>
                        {v.ingredient}: {v.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-500">
        Disclaimer: This information is based on Open Food Facts data and AI
        analysis. It may be incomplete or inaccurate and is not medical advice.
        Always consult qualified professionals for health decisions.
      </p>
    </Card>
  );
}
