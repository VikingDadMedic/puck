import type { ComponentConfig } from "@/core";
import { richTextToSafeHtml } from "../../../lib/render/richtext";

export type CruiseCardProps = {
  name: string;
  carrier: { name?: string; externalId?: string; source?: string };
  timing: { date: string; time: string; duration: string; timezone: string };
  cabinType: string;
  cabinNumber: string;
  confirmationNumber: string;
  price: { amount: number; currency: string };
  notes: string;
};

const supplierObjectFields = {
  name: { type: "text" as const, label: "Name" },
  externalId: { type: "text" as const, label: "External ID" },
  source: { type: "text" as const, label: "Source" },
};

export const CruiseCard: ComponentConfig<CruiseCardProps> = {
  fields: {
    name: { type: "text", label: "Cruise / Ship Name" },
    carrier: {
      type: "object",
      label: "Cruise Line",
      objectFields: supplierObjectFields,
    },
    timing: {
      type: "object",
      objectFields: {
        date: { type: "text", label: "Date" },
        time: { type: "text", label: "Time" },
        duration: { type: "text", label: "Duration" },
        timezone: { type: "text", label: "Timezone" },
      },
    },
    cabinType: { type: "text", label: "Cabin Type" },
    cabinNumber: { type: "text", label: "Cabin Number" },
    confirmationNumber: { type: "text", label: "Confirmation #" },
    price: {
      type: "object",
      objectFields: {
        amount: { type: "number" },
        currency: { type: "text" },
      },
    },
    notes: { type: "richtext" },
  },
  defaultProps: {
    name: "",
    carrier: { name: "", externalId: "", source: "" },
    timing: { date: "", time: "", duration: "", timezone: "" },
    cabinType: "",
    cabinNumber: "",
    confirmationNumber: "",
    price: { amount: 0, currency: "USD" },
    notes: "",
  },
  render: ({
    name,
    carrier,
    timing,
    cabinType,
    cabinNumber,
    confirmationNumber,
    price,
    notes,
    puck,
  }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const isProposal = puck.metadata?.target === "proposal";
    const carrierLabel = carrier?.name?.trim() || "";
    const hasPrice = price?.amount > 0;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: "#ffffff",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          ...(isProposal ? { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" } : {}),
        }}
      >
        <div
          style={{
            width: 52,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            fontSize: 24,
          }}
        >
          ⛴
        </div>
        <div
          style={{
            flex: 1,
            padding: "14px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#1f2937" }}>
                {name || "Cruise"}
              </span>
              {carrierLabel && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    background: "#f3f4f6",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {carrierLabel}
                </span>
              )}
            </div>
            {hasPrice && !isClientView && (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1d4ed8",
                }}
              >
                {price.currency} {price.amount.toLocaleString()}
              </span>
            )}
          </div>

          {(timing?.date || timing?.time || timing?.duration) && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {timing.date}
              {timing.date && timing.time && " · "}
              {timing.time}
              {timing.duration && ` (${timing.duration})`}
            </div>
          )}

          {(cabinType || cabinNumber) && (
            <div style={{ fontSize: 13, color: "#374151" }}>
              {cabinType}
              {cabinType && cabinNumber && " · "}
              {cabinNumber && `Cabin ${cabinNumber}`}
            </div>
          )}

          {!isClientView && confirmationNumber && (
            <div
              style={{
                fontSize: 12,
                color: "#059669",
                background: "#f0fdf4",
                padding: "2px 8px",
                borderRadius: 4,
                display: "inline-block",
                width: "fit-content",
              }}
            >
              Conf: {confirmationNumber}
            </div>
          )}

          {notes && (
            <div
              style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{
                __html: richTextToSafeHtml(notes),
              }}
            />
          )}
        </div>
      </div>
    );
  },
};

export default CruiseCard;
