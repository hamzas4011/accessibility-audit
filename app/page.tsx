"use client";

import { useState } from "react";

type Violation = {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; failureSummary: string }[];
};

type ScanResult = {
  violations: Violation[];
  passesCount: number;
  incompleteCount: number;
};

function impactBadge(impact: string) {
  const map: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-300",
    serious: "bg-orange-100 text-orange-800 border-orange-300",
    moderate: "bg-yellow-100 text-yellow-900 border-yellow-300",
    minor: "bg-sky-100 text-sky-800 border-sky-300",
  };
  return map[impact] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.error || "Something went wrong");
      else setResult(data);
    } catch {
      setError("Failed to connect to server");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          Accessibility Audit
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Scan any website for accessibility violations.
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Website URL
          </label>

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4"
          />

          {/* ✅ FIXED BUTTON */}
          <button
            onClick={handleScan}
            disabled={loading || !url}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Scanning..." : "Scan Website"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>

        {result && (
          <div className="bg-white p-4 rounded-xl border">
            <p className="font-semibold mb-2">Result:</p>
            <pre className="text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}