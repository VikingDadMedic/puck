import type { ComponentConfig } from "@/core";

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
    )
      return null;

    const isAdvisorOnly = visibility === "advisor_only";
    const bg = isAdvisorOnly ? "#fef3c7" : "#eff6ff";
    const border = isAdvisorOnly ? "#fcd34d" : "#bfdbfe";
    const labelColor = isAdvisorOnly ? "#92400e" : "#1e40af";

    return (
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 8,
          padding: 16,
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
          style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    );
  },
};

export default AdvisorInsight;
