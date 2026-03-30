import type { ComponentConfig } from "@/core";
import { color, radius } from "../../tokens";

export type InfoCardProps = {
  subCategory: "info" | "cityGuide";
  name: string;
  notes: string;
};

export const InfoCard: ComponentConfig<InfoCardProps> = {
  fields: {
    subCategory: {
      type: "radio",
      label: "Type",
      options: [
        { value: "info", label: "Info" },
        { value: "cityGuide", label: "City Guide" },
      ],
    },
    name: { type: "text", label: "Title" },
    notes: { type: "richtext", label: "Notes" },
  },
  defaultProps: {
    subCategory: "info",
    name: "",
    notes: "",
  },
  render: ({ subCategory, name, notes }) => {
    const icon = subCategory === "cityGuide" ? "🏙" : "ℹ️";
    const accentColor =
      subCategory === "cityGuide"
        ? color.accent.blueDark
        : color.accent.blueDeep;

    return (
      <div
        style={{
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          border: `1px solid ${color.border.default}`,
          borderLeft: `4px solid ${accentColor}`,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: color.text.primary,
            }}
          >
            {name || (subCategory === "cityGuide" ? "City Guide" : "Info")}
          </h4>
        </div>
        {notes && (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: color.text.secondary,
            }}
          >
            {notes}
          </div>
        )}
      </div>
    );
  },
};

export default InfoCard;
