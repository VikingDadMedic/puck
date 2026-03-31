import type { ComponentConfig } from "@/core";

import { color, radius, spacing } from "../../tokens";

export type AdvisorInsightProps = {
  content: string;
  visibility: "advisor_only" | "client_visible";
};

export const AdvisorInsight: ComponentConfig<AdvisorInsightProps> = {
  fields: {
    content: { type: "richtext", label: "Advisor Notes" },
    visibility: {
      type: "select",
      label: "Visibility",
      options: [
        { value: "advisor_only", label: "Advisor Only" },
        { value: "client_visible", label: "Client Visible" },
      ],
    },
  },
  defaultProps: {
    content: "",
    visibility: "advisor_only",
  },
  render: ({ content, visibility, puck }) => {
    if (
      puck.metadata?.target === "client_view" &&
      visibility === "advisor_only"
    ) {
      return <></>;
    }

    const isAdvisorOnly = visibility === "advisor_only";
    const bg = isAdvisorOnly ? color.bg.amberLight : color.bg.blueLight;
    const border = isAdvisorOnly ? color.border.amber : color.bg.blueSubtle;
    const labelColor = isAdvisorOnly
      ? color.accent.amberDeep
      : color.accent.blueDeep;

    return (
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: radius.md,
          padding: spacing.xl,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: labelColor,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {isAdvisorOnly && <span>🔒</span>}
          Advisor Insight
        </div>
        <div
          style={{ fontSize: 14, color: color.text.secondary, lineHeight: 1.6 }}
        >
          {content}
        </div>
      </div>
    );
  },
};

export default AdvisorInsight;
