"use client";

import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: 32,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
        Something went wrong
      </h1>
      <p
        style={{
          color: "#6b7280",
          fontSize: 14,
          margin: "0 0 8px",
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        An unexpected error occurred. Please try again or return to the
        dashboard.
      </p>
      {error.digest && (
        <p
          style={{
            color: "#9ca3af",
            fontSize: 12,
            margin: "0 0 24px",
            fontFamily: "monospace",
          }}
        >
          Reference: {error.digest}
        </p>
      )}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            background: "#f1f5f9",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
