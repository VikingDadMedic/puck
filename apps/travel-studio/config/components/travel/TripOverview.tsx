import type { ComponentConfig } from "@/core";

export type TripOverviewProps = {
  summary: string;
  duration: string;
  highlights: { text: string }[];
};

export const TripOverview: ComponentConfig<TripOverviewProps> = {
  fields: {
    summary: { type: "textarea" },
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
  render: ({ summary, duration, highlights }) => {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
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
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Trip Overview
          </h3>
          {duration && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1e40af",
                background: "#eff6ff",
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {duration}
            </span>
          )}
        </div>

        {summary && (
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.6,
              color: "#374151",
            }}
          >
            {summary}
          </p>
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
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: "#10b981",
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
