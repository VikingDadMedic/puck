import { color, fontFamily } from "../config/tokens";

export default function RootLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        fontFamily: fontFamily.system,
      }}
    >
      <p style={{ color: color.text.muted, fontSize: 14 }}>
        Loading Travel Studio...
      </p>
    </div>
  );
}
