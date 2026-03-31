import { color, fontFamily } from "../../config/tokens";

export default function PuckPathLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily,
      }}
    >
      <p style={{ color: color.text.muted, fontSize: 14 }}>
        Loading document...
      </p>
    </div>
  );
}
