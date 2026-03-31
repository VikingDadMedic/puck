import type { ComponentConfig } from "@/core";
import { imagePickerField } from "../../fields/image-picker";
import { color, radius } from "../../tokens";
import { formatPrice } from "../../format";

export type TourCardProps = {
  name: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: { name?: string; externalId?: string; source?: string };
    confirmationNumber: string;
    provider: { name?: string; externalId?: string; source?: string };
    meetingPoint: string;
    groupSize: number;
    included: string;
  };
  price: { amount: number; currency: string };
  notes: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number } | null;
};

const supplierObjectFields = {
  name: { type: "text" as const, label: "Name" },
  externalId: { type: "text" as const, label: "External ID" },
  source: { type: "text" as const, label: "Source" },
};

export const TourCard: ComponentConfig<TourCardProps> = {
  fields: {
    name: { type: "text", label: "Tour Name" },
    timing: {
      type: "object",
      label: "Timing",
      objectFields: {
        date: { type: "text", label: "Date" },
        time: { type: "text", label: "Time" },
        duration: { type: "text", label: "Duration" },
        timezone: { type: "text", label: "Timezone" },
      },
    },
    details: {
      type: "object",
      objectFields: {
        bookedThrough: {
          type: "object",
          label: "Booked Through",
          objectFields: supplierObjectFields,
        },
        confirmationNumber: { type: "text", label: "Confirmation #" },
        provider: {
          type: "object",
          label: "Provider",
          objectFields: supplierObjectFields,
        },
        meetingPoint: { type: "text", label: "Meeting Point" },
        groupSize: { type: "number", label: "Group Size" },
        included: { type: "textarea", label: "What's Included" },
      },
    },
    price: {
      type: "object",
      label: "Price",
      objectFields: {
        amount: { type: "number", label: "Amount" },
        currency: { type: "text", label: "Currency" },
      },
    },
    notes: { type: "richtext" },
    imageUrl: imagePickerField,
    coordinates: {
      type: "object",
      label: "Coordinates",
      objectFields: {
        lat: { type: "number", label: "Latitude" },
        lng: { type: "number", label: "Longitude" },
      },
    },
  },
  defaultProps: {
    name: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: {
      bookedThrough: { name: "", externalId: "", source: "" },
      confirmationNumber: "",
      provider: { name: "", externalId: "", source: "" },
      meetingPoint: "",
      groupSize: 0,
      included: "",
    },
    price: { amount: 0, currency: "USD" },
    notes: "",
    imageUrl: "",
    coordinates: null,
  },
  render: ({ name, timing, details, price, notes, imageUrl, puck }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const showPrice = puck.metadata?.showPricing !== false && price?.amount > 0;

    return (
      <div
        style={{
          display: "flex",
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          border: `1px solid ${color.border.default}`,
          borderLeft: `4px solid ${color.accent.greenBright}`,
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🗺</span>
            <h4
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: color.text.primary,
              }}
            >
              {name || "Untitled Tour"}
            </h4>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {timing.time && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: color.accent.greenBright,
                  background: color.bg.muted,
                  padding: "3px 10px",
                  borderRadius: radius.sm,
                }}
              >
                {timing.time}
              </span>
            )}
            {timing.duration && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: color.text.secondary,
                  background: color.bg.muted,
                  padding: "3px 10px",
                  borderRadius: radius.sm,
                }}
              >
                {timing.duration}
              </span>
            )}
            {details.meetingPoint && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: color.text.secondary,
                  background: color.bg.muted,
                  padding: "3px 10px",
                  borderRadius: radius.sm,
                }}
              >
                📍 {details.meetingPoint}
              </span>
            )}
          </div>

          {!isClientView && details?.confirmationNumber && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: color.accent.greenDark,
                background: color.bg.greenPale,
                padding: "3px 10px",
                borderRadius: radius.sm,
                width: "fit-content",
              }}
            >
              Conf # {details.confirmationNumber}
            </span>
          )}

          {showPrice && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: color.accent.blueDark,
              }}
            >
              {formatPrice(price.amount, price.currency)}
            </span>
          )}

          {notes && (
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: color.text.muted,
              }}
            >
              {notes}
            </div>
          )}
        </div>

        {hasImage && (
          <div className="ts-card-image" style={{ width: 140, flexShrink: 0 }}>
            <img
              src={imageUrl}
              alt={name || "Tour"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    );
  },
};

export default TourCard;
