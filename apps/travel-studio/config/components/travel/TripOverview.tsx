import type { ComponentConfig } from "@/core";
import { color, radius, shadow } from "../../tokens";

export type TripOverviewProps = {
  summary: string;
  duration: string;
  highlights: { text: string }[];
};

export const TripOverview: ComponentConfig<TripOverviewProps> = {
  fields: {
    summary: { type: "richtext", label: "Summary" },
    duration: { type: "text", label: "Duration" },
    highlights: {
      type: "array",
      arrayFields: { text: { type: "text" } },
      getItemSummary: (item: { text: string }) => item.text || "Item",
      defaultItemProps: { text: "" },
    },
  },
  defaultProps: {
    summary: "",
    duration: "14 nights",
    highlights: [],
  },
  render: ({ summary, duration, highlights, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";

    return (
      <div
        style={{
          background: color.bg.card,
          borderRadius: radius.xl,
          border: `1px solid ${color.border.default}`,
          padding: isProposal ? 32 : 24,
          display: "flex",
          flexDirection: "column",
          gap: isProposal ? 20 : 16,
          ...(isProposal && { boxShadow: shadow.md }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: isProposal ? 22 : 18,
              fontWeight: 700,
              color: color.text.primary,
            }}
          >
            Trip Overview
          </h3>
          {duration && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: color.accent.blueDeep,
                background: color.bg.blueLight,
                padding: "4px 12px",
                borderRadius: radius.pill,
              }}
            >
              {duration}
            </span>
          )}
        </div>

        {summary && (
          <div
            style={{
              margin: 0,
              fontSize: isProposal ? 17 : 15,
              lineHeight: isProposal ? 1.7 : 1.6,
              color: color.text.secondary,
            }}
          >
            {summary}
          </div>
        )}

        {highlights.length > 0 && (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {highlights.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 14,
                  color: color.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: color.accent.greenBright,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};

export default TripOverview;
