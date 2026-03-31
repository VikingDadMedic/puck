import type { ComponentConfig } from "@/core";
import { activityPickerField } from "../../fields/activity-picker";
import { eventPickerField } from "../../fields/event-picker";
import { imagePickerField } from "../../fields/image-picker";
import { color, radius } from "../../tokens";
import { formatPrice } from "../../format";

export type ActivityCardProps = {
  activity: Record<string, unknown> | null;
  event: Record<string, unknown> | null;
  name: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: { name?: string; externalId?: string; source?: string };
    confirmationNumber: string;
    provider: { name?: string; externalId?: string; source?: string };
  };
  price: { amount: number; currency: string };
  description: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number } | null;
};

export const ActivityCard: ComponentConfig<ActivityCardProps> = {
  fields: {
    activity: activityPickerField,
    event: eventPickerField,
    name: { type: "text" },
    timing: {
      type: "object",
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
          objectFields: {
            name: { type: "text", label: "Supplier name" },
            externalId: { type: "text", label: "External ID" },
            source: { type: "text", label: "Source" },
          },
        },
        confirmationNumber: { type: "text", label: "Confirmation #" },
        provider: {
          type: "object",
          label: "Provider",
          objectFields: {
            name: { type: "text", label: "Name" },
            externalId: { type: "text", label: "External ID" },
            source: { type: "text", label: "Source" },
          },
        },
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
    description: { type: "richtext" },
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
    activity: null,
    event: null,
    name: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: {
      bookedThrough: { name: "", externalId: "", source: "" },
      confirmationNumber: "",
      provider: { name: "", externalId: "", source: "" },
    },
    price: { amount: 0, currency: "USD" },
    description: "",
    imageUrl: "",
    coordinates: null,
  },
  resolveData: async ({ props }, { changed }) => {
    const strOr = (v: unknown, fallback: string) =>
      typeof v === "string" && v.trim() ? v : fallback;

    if (changed.activity && props.activity) {
      const a = props.activity;
      return {
        props: {
          name: strOr(a.name, props.name),
          description: strOr(a.description, props.description),
          imageUrl: strOr(a.imageUrl, props.imageUrl),
        },
        readOnly: { name: true },
      };
    }

    if (changed.event && props.event) {
      const e = props.event;
      return {
        props: {
          name: strOr(e.name, props.name),
          description: strOr(e.description, props.description),
          imageUrl: strOr(e.imageUrl, props.imageUrl),
        },
        readOnly: { name: true },
      };
    }

    return { props };
  },
  render: ({ name, timing, details, price, description, imageUrl, puck }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const showPrice = puck.metadata?.showPricing !== false && price?.amount > 0;
    const hasBookingDetails =
      !isClientView &&
      (details.bookedThrough?.name ||
        details.confirmationNumber ||
        details.provider?.name);

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
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: color.text.primary,
            }}
          >
            {name || "Untitled Activity"}
          </h4>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {timing.time && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: color.accent.greenDark,
                  background: color.bg.greenPale,
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
          </div>

          {description && (
            <div
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: color.text.muted,
              }}
            >
              {description}
            </div>
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

          {hasBookingDetails && (
            <div
              style={{
                marginTop: 4,
                paddingTop: 8,
                borderTop: `1px solid ${color.border.default}`,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontSize: 12,
                color: color.text.muted,
              }}
            >
              {details.bookedThrough?.name && (
                <span>
                  <strong style={{ color: color.text.secondary }}>
                    Booked via
                  </strong>{" "}
                  {details.bookedThrough.name}
                </span>
              )}
              {details.confirmationNumber && (
                <span>
                  <strong style={{ color: color.text.secondary }}>
                    Conf #
                  </strong>{" "}
                  {details.confirmationNumber}
                </span>
              )}
              {details.provider?.name && (
                <span>
                  <strong style={{ color: color.text.secondary }}>
                    Provider
                  </strong>{" "}
                  {details.provider.name}
                </span>
              )}
            </div>
          )}
        </div>

        {hasImage && (
          <div className="ts-card-image" style={{ width: 140, flexShrink: 0 }}>
            <img
              src={imageUrl}
              alt={name || "Activity"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    );
  },
};

export default ActivityCard;
