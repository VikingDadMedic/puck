import type { ComponentConfig } from "@/core";

export type ActivityCardProps = {
  name: string;
  time: string;
  duration: string;
  description: string;
  imageUrl: string;
};

export const ActivityCard: ComponentConfig<ActivityCardProps> = {
  fields: {
    name: { type: "text" },
    time: { type: "text" },
    duration: { type: "text" },
    description: { type: "textarea" },
    imageUrl: { type: "text", label: "Image URL" },
  },
  defaultProps: {
    name: "",
    time: "",
    duration: "",
    description: "",
    imageUrl: "",
  },
  render: ({ name, time, duration, description, imageUrl }) => {
    const hasImage = imageUrl.trim().length > 0;

    return (
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderLeft: "4px solid #10b981",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {name || "Untitled Activity"}
          </h4>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {time && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#065f46",
                  background: "#ecfdf5",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                {time}
              </span>
            )}
            {duration && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#374151",
                  background: "#f3f4f6",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                {duration}
              </span>
            )}
          </div>

          {description && (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: "#4b5563",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {hasImage && (
          <div
            style={{
              width: 140,
              flexShrink: 0,
              background: `url(${imageUrl}) center/cover no-repeat`,
            }}
          />
        )}
      </div>
    );
  },
};

export default ActivityCard;
