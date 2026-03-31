"use client";

import Link from "next/link";
import { color, fontFamily, radius } from "../config/tokens";

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
        fontFamily: fontFamily.system,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
        Something went wrong
      </h1>
      <p
        style={{
          color: color.text.muted,
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
            color: color.text.faint,
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
            background: color.accent.blue,
            color: color.text.inverse,
            border: "none",
            borderRadius: radius.md,
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
            background: color.bg.subtle,
            color: color.text.secondary,
            border: `1px solid ${color.border.muted}`,
            borderRadius: radius.md,
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
