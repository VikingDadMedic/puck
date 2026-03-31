import Link from "next/link";
import { color, fontFamily, radius } from "../config/tokens";

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
        fontFamily: fontFamily.system,
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          margin: "0 0 8px",
          color: color.border.muted,
        }}
      >
        404
      </h1>
      <p style={{ color: color.text.muted, fontSize: 14, margin: "0 0 24px" }}>
        This page does not exist.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          background: color.accent.blue,
          color: color.text.inverse,
          borderRadius: radius.md,
          textDecoration: "none",
          fontSize: 14,
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
