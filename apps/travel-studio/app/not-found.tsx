import Link from "next/link";

export default function NotFound() {
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
      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          margin: "0 0 8px",
          color: "#d1d5db",
        }}
      >
        404
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>
        This page does not exist.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 14,
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
