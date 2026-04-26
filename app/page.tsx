"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to server");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">
          Accessibility Audit Tool
        </h1>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleScan}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Scanning..." : "Scan Website"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {/* RESULT */}
        {result && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p className="font-semibold">Result:</p>
            <pre className="text-sm mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}