import type { ComponentConfig } from "@/core";
import { restaurantPickerField } from "../../fields/restaurant-picker";
import { imagePickerField } from "../../fields/image-picker";
import { color, fontSize, radius, shadow } from "../../tokens";
import { formatPrice } from "../../format";

export type RestaurantCardProps = {
  restaurant: Record<string, unknown> | null;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  notes: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: { name?: string; externalId?: string; source?: string };
    confirmationNumber: string;
    provider: { name?: string; externalId?: string; source?: string };
  };
  price: { amount: number; currency: string };
  coordinates: { lat: number; lng: number } | null;
};

export const RestaurantCard: ComponentConfig<RestaurantCardProps> = {
  fields: {
    restaurant: restaurantPickerField,
    name: { type: "text" },
    cuisine: { type: "text", label: "Cuisine Type" },
    rating: { type: "number" },
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
    imageUrl: imagePickerField,
    notes: { type: "richtext" },
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
    restaurant: null,
    name: "",
    cuisine: "",
    rating: 0,
    imageUrl: "",
    notes: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: {
      bookedThrough: { name: "", externalId: "", source: "" },
      confirmationNumber: "",
      provider: { name: "", externalId: "", source: "" },
    },
    price: { amount: 0, currency: "USD" },
    coordinates: null,
  },
  resolveData: async ({ props }, { changed }) => {
    if (!changed.restaurant || !props.restaurant) return { props };
    const r = props.restaurant;
    const strOr = (v: unknown, fallback: string) =>
      typeof v === "string" && v.trim() ? v : fallback;
    const numOr = (v: unknown, fallback: number) =>
      typeof v === "number" && Number.isFinite(v) ? v : fallback;
    return {
      props: {
        name: strOr(r.name, props.name),
        cuisine: strOr(r.cuisine, props.cuisine),
        rating: numOr(r.rating, props.rating),
        imageUrl: strOr(r.imageUrl, props.imageUrl),
      },
      readOnly: { name: true },
    };
  },
  render: ({
    name,
    cuisine,
    rating,
    imageUrl,
    timing,
    details,
    price,
    notes,
    puck,
  }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const isProposal = puck.metadata?.target === "proposal";
    const showPrice = puck.metadata?.showPricing !== false && price?.amount > 0;
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const stars =
      rating > 0
        ? "★".repeat(Math.min(Math.round(rating), 5)) +
          "☆".repeat(5 - Math.min(Math.round(rating), 5))
        : "";

    return (
      <div
        style={{
          display: "flex",
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          border: `1px solid ${color.border.default}`,
          borderLeft: `4px solid ${color.accent.amber}`,
          ...(isProposal ? { boxShadow: shadow.md } : {}),
        }}
      >
        <div
          style={{
            flex: 1,
            padding: isProposal ? "20px 24px" : "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: isProposal ? 10 : 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🍽</span>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: fontSize.xl,
                  color: color.text.primary,
                }}
              >
                {name || "Restaurant"}
              </div>
              {cuisine && (
                <div style={{ fontSize: 12, color: color.text.muted }}>
                  {cuisine}
                </div>
              )}
            </div>
          </div>
          {stars && (
            <div style={{ fontSize: 13, color: color.star, letterSpacing: 1 }}>
              {stars}
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
          {(timing?.date || timing?.time) && (
            <div style={{ fontSize: 13, color: color.text.muted }}>
              {timing.date}
              {timing.date && timing.time && " · "}
              {timing.time}
              {timing.duration && ` (${timing.duration})`}
            </div>
          )}
          {!isClientView && details?.confirmationNumber && (
            <div
              style={{
                fontSize: 12,
                color: color.accent.green,
                background: color.bg.greenLight,
                padding: "2px 8px",
                borderRadius: radius.xs,
                display: "inline-block",
                width: "fit-content",
              }}
            >
              Conf: {details.confirmationNumber}
            </div>
          )}
          {notes && (
            <div
              style={{
                fontSize: 13,
                color: color.text.muted,
                lineHeight: 1.5,
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
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    );
  },
};

export default RestaurantCard;
