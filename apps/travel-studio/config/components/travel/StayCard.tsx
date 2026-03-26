import type { ComponentConfig } from "@/core";

export type StayCardProps = {
  name: string;
  location: string;
  dates: string;
  roomType: string;
  rating: number;
  imageUrl: string;
  notes: string;
};

export const StayCard: ComponentConfig<StayCardProps> = {
  fields: {
    name: { type: "text" },
    location: { type: "text" },
    dates: { type: "text" },
    roomType: { type: "text", label: "Room Type" },
    rating: { type: "number", min: 1, max: 5 },
    imageUrl: { type: "text", label: "Image URL" },
    notes: { type: "textarea" },
  },
  defaultProps: {
    name: "",
    location: "",
    dates: "",
    roomType: "Standard",
    rating: 4,
    imageUrl: "",
    notes: "",
  },
  render: ({ name, location, dates, roomType, rating, imageUrl, notes }) => {
    const hasImage = imageUrl.trim().length > 0;
    const stars =
      "★".repeat(Math.min(rating, 5)) + "☆".repeat(5 - Math.min(rating, 5));

    return (
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6",
        }}
      >
        {hasImage && (
          <div
            style={{
              width: 200,
              minHeight: 180,
              flexShrink: 0,
              background: `url(${imageUrl}) center/cover no-repeat`,
            }}
          />
        )}

        <div
          style={{
            flex: 1,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {name || "Untitled Stay"}
              </h4>
              {location && (
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 14,
                    color: "#6b7280",
                  }}
                >
                  {location}
                </p>
              )}
            </div>
            <span
              style={{
                fontSize: 16,
                color: "#f59e0b",
                letterSpacing: 2,
                flexShrink: 0,
              }}
            >
              {stars}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dates && (
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
                {dates}
              </span>
            )}
            {roomType && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#1e40af",
                  background: "#eff6ff",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                {roomType}
              </span>
            )}
          </div>

          {notes && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#6b7280",
              }}
            >
              {notes}
            </p>
          )}
        </div>
      </div>
    );
  },
};

export default StayCard;
