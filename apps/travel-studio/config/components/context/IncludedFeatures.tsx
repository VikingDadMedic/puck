import type { ComponentConfig } from "@/core";
import { color } from "../../tokens";

export type IncludedFeaturesProps = {
  title: string;
  features: { text: string; included: boolean }[];
};

export const IncludedFeatures: ComponentConfig<IncludedFeaturesProps> = {
  fields: {
    title: { type: "text", label: "Title" },
    features: {
      type: "array",
      label: "Features",
      arrayFields: {
        text: { type: "text", label: "Feature" },
        included: {
          type: "radio",
          label: "Status",
          options: [
            { value: true, label: "Included" },
            { value: false, label: "Not Included" },
          ],
        },
      },
      getItemSummary: (item: { text: string }) => item.text || "Feature",
      defaultItemProps: { text: "", included: true },
    },
  },
  defaultProps: {
    title: "What's Included",
    features: [],
  },
  render: ({ title, features, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";

    return (
      <div
        style={{
          background: color.bg.card,
          borderRadius: isProposal ? 12 : 8,
          border: `1px solid ${color.border.default}`,
          overflow: "hidden",
          ...(isProposal && { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }),
        }}
      >
        <div
          style={{
            padding: isProposal ? "16px 20px" : "12px 16px",
            background: color.bg.greenLight,
            borderBottom: "2px solid #22c55e",
          }}
        >
          <span
            style={{
              fontSize: isProposal ? 18 : 16,
              fontWeight: 700,
              color: color.accent.greenLeaf,
            }}
          >
            {title}
          </span>
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
          {features.map((feature, i) => (
            <li
              key={i}
              style={{
                padding: isProposal ? "10px 20px" : "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: isProposal ? 15 : 14,
                color: color.text.secondary,
                borderBottom:
                  i < features.length - 1
                    ? `1px solid ${color.bg.muted}`
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: feature.included ? "#16a34a" : color.accent.red,
                  flexShrink: 0,
                }}
              >
                {feature.included ? "✓" : "✗"}
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
    );
  },
};

export default IncludedFeatures;
