import type { ComponentConfig } from "@/core";

export type TransportCardProps = {
  type: "flight" | "train" | "transfer" | "ferry";
  carrier: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  notes: string;
};

const typeIcons: Record<TransportCardProps["type"], string> = {
  flight: "✈",
  train: "🚂",
  transfer: "🚐",
  ferry: "⛴",
};

export const TransportCard: ComponentConfig<TransportCardProps> = {
  fields: {
    type: {
      type: "select",
      options: [
        { value: "flight", label: "Flight" },
        { value: "train", label: "Train" },
        { value: "transfer", label: "Transfer" },
        { value: "ferry", label: "Ferry" },
      ],
    },
    carrier: { type: "text" },
    departure: { type: "text", label: "From" },
    arrival: { type: "text", label: "To" },
    departureTime: { type: "text", label: "Depart Time" },
    arrivalTime: { type: "text", label: "Arrive Time" },
    notes: { type: "textarea" },
  },
  defaultProps: {
    type: "flight",
    carrier: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    notes: "",
  },
  render: ({
    type,
    carrier,
    departure,
    arrival,
    departureTime,
    arrivalTime,
    notes,
  }) => {
    const icon = typeIcons[type] || "✈";

    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: "#ffffff",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            fontSize: 24,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            flex: 1,
            padding: "14px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {type}
            </span>
            {carrier && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                {carrier}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 15,
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            <span>{departure || "—"}</span>
            <span style={{ color: "#94a3b8", fontSize: 14 }}>→</span>
            <span>{arrival || "—"}</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            {departureTime && <span>Departs: {departureTime}</span>}
            {arrivalTime && <span>Arrives: {arrivalTime}</span>}
          </div>

          {notes && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#64748b",
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

export default TransportCard;
