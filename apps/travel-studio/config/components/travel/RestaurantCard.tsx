import type { ComponentConfig } from "@/core";
import { restaurantPickerField } from "../../fields/restaurant-picker";
import { imagePickerField } from "../../fields/image-picker";
import { richTextToSafeHtml } from "../../../lib/render/richtext";

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
  };
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
      },
    },
    imageUrl: imagePickerField,
    notes: { type: "richtext" },
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
    },
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
    notes,
    puck,
  }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const isProposal = puck.metadata?.target === "proposal";
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
          background: "#ffffff",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderLeft: "4px solid #f59e0b",
          ...(isProposal ? { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" } : {}),
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
              <div style={{ fontWeight: 600, fontSize: 15, color: "#1f2937" }}>
                {name || "Restaurant"}
              </div>
              {cuisine && (
                <div style={{ fontSize: 12, color: "#6b7280" }}>{cuisine}</div>
              )}
            </div>
          </div>
          {stars && (
            <div style={{ fontSize: 13, color: "#f59e0b", letterSpacing: 1 }}>
              {stars}
            </div>
          )}
          {(timing?.date || timing?.time) && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
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
                color: "#059669",
                background: "#f0fdf4",
                padding: "2px 8px",
                borderRadius: 4,
                display: "inline-block",
                width: "fit-content",
              }}
            >
              Conf: {details.confirmationNumber}
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
        {hasImage && (
          <div style={{ width: 140, flexShrink: 0 }}>
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
