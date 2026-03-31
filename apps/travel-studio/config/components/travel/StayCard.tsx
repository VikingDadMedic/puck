import type { ComponentConfig } from "@/core";
import { hotelPickerField } from "../../fields/hotel-picker";
import { placePickerField } from "../../fields/place-picker";
import { imagePickerField } from "../../fields/image-picker";
import { color, fontSize, radius, shadow } from "../../tokens";

export type StayCardProps = {
  hotel: Record<string, unknown> | null;
  place: Record<string, unknown> | null;
  type: "checkIn" | "checkOut";
  name: string;
  location: string;
  /** @deprecated Use timing instead */
  dates: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: { name?: string; externalId?: string; source?: string };
    confirmationNumber: string;
    roomBedType: string;
  };
  price: { amount: number; currency: string };
  rating: number;
  imageUrl: string;
  notes: string;
  coordinates: { lat: number; lng: number } | null;
};

export const StayCard: ComponentConfig<StayCardProps> = {
  fields: {
    hotel: hotelPickerField,
    place: placePickerField,
    type: {
      type: "radio",
      label: "Type",
      options: [
        { value: "checkIn", label: "Check-in" },
        { value: "checkOut", label: "Check-out" },
      ],
    },
    name: { type: "text" },
    location: { type: "text" },
    dates: { type: "text", label: "Dates (legacy)", visible: false },
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
          objectFields: {
            name: { type: "text", label: "Supplier name" },
            externalId: { type: "text", label: "External ID" },
            source: { type: "text", label: "Source" },
          },
        },
        confirmationNumber: { type: "text", label: "Confirmation #" },
        roomBedType: { type: "text", label: "Room/Bed Type" },
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
    rating: { type: "number", min: 1, max: 5 },
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
  resolveData: async ({ props }, { changed }) => {
    const strOr = (v: unknown, fallback: string) =>
      typeof v === "string" && v.trim() ? v : fallback;
    const numOr = (v: unknown, fallback: number) =>
      typeof v === "number" && Number.isFinite(v) ? v : fallback;

    if (changed.hotel && props.hotel) {
      const h = props.hotel;
      return {
        props: {
          name: strOr(h.name, props.name),
          location: strOr(h.location, props.location),
          rating: numOr(h.rating, props.rating),
          imageUrl: strOr(h.imageUrl, props.imageUrl),
        },
        readOnly: { name: true, location: true, rating: true },
      };
    }

    if (changed.place && props.place) {
      const p = props.place;
      const coords =
        p.coordinates &&
        typeof (p.coordinates as Record<string, unknown>).lat === "number"
          ? (p.coordinates as { lat: number; lng: number })
          : props.coordinates;
      return {
        props: {
          name: strOr(p.name, props.name),
          location: strOr(p.location, props.location),
          imageUrl: strOr(p.imageUrl, props.imageUrl),
          coordinates: coords,
        },
        readOnly: { name: true, location: true },
      };
    }

    return { props };
  },
  defaultProps: {
    hotel: null,
    place: null,
    type: "checkIn",
    name: "",
    location: "",
    dates: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: {
      bookedThrough: { name: "", externalId: "", source: "" },
      confirmationNumber: "",
      roomBedType: "Standard",
    },
    price: { amount: 0, currency: "USD" },
    rating: 4,
    imageUrl: "",
    notes: "",
    coordinates: null,
  },
  render: ({
    name,
    location,
    dates,
    details,
    rating,
    imageUrl,
    notes,
    puck,
  }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const stars =
      "★".repeat(Math.min(rating, 5)) + "☆".repeat(5 - Math.min(rating, 5));

    return (
      <div
        style={{
          display: "flex",
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          boxShadow: shadow.sm,
          border: `1px solid ${color.border.default}`,
        }}
      >
        {hasImage && (
          <div
            className="ts-card-image"
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
            padding: "16px 20px",
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
                  fontSize: fontSize.xl,
                  fontWeight: 700,
                  color: color.text.primary,
                }}
              >
                {name || "Untitled Stay"}
              </h4>
              {location && (
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 14,
                    color: color.text.muted,
                  }}
                >
                  {location}
                </p>
              )}
            </div>
            <span
              style={{
                fontSize: 16,
                color: color.star,
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
                  color: color.text.secondary,
                  background: color.bg.muted,
                  padding: "3px 10px",
                  borderRadius: radius.sm,
                }}
              >
                {dates}
              </span>
            )}
            {!isClientView && details?.roomBedType && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: color.accent.blueDeep,
                  background: color.bg.blueLight,
                  padding: "3px 10px",
                  borderRadius: radius.sm,
                }}
              >
                {details.roomBedType}
              </span>
            )}
            {!isClientView && details?.confirmationNumber && (
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
                Conf # {details.confirmationNumber}
              </span>
            )}
          </div>

          {!isClientView && details?.bookedThrough?.name && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: color.text.faint,
              }}
            >
              Booked through {details.bookedThrough.name}
            </p>
          )}

          {notes && (
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                lineHeight: 1.5,
                color: color.text.muted,
              }}
            >
              {notes}
            </div>
          )}
        </div>
      </div>
    );
  },
};

export default StayCard;
