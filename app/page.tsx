"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; length: number } | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to connect to server");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-slate-200">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Accessibility Audit
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Enter a URL to scan its HTML and check accessibility.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Website URL
          </label>
          <input
            id="url-input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            aria-describedby={error ? "scan-error" : undefined}
            aria-invalid={error ? "true" : "false"}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleScan}
          disabled={loading || !url}
          aria-busy={loading ? "true" : "false"}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? (
            <>
              <span
                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              Scanning…
            </>
          ) : (
            "Scan Website"
          )}
        </button>

        {/* Error */}
        {error && (
          <p
            id="scan-error"
            role="alert"
            className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          >
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm font-semibold text-green-800 mb-2">Scan complete</p>
            <dl className="text-sm text-green-700 space-y-1">
              <div className="flex justify-between">
                <dt className="font-medium">Status</dt>
                <dd>{result.message}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">HTML size</dt>
                <dd>{result.length.toLocaleString()} characters</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </main>
  );
}
