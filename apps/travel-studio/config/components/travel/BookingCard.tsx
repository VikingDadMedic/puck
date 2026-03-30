import type { ComponentConfig } from "@/core";
import { color, radius } from "../../tokens";

export type BookingCardProps = {
  name: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: { name?: string; externalId?: string; source?: string };
    confirmationNumber: string;
    provider: { name?: string; externalId?: string; source?: string };
    bookingReference: string;
  };
  price: { amount: number; currency: string };
  notes: string;
};

const supplierObjectFields = {
  name: { type: "text" as const, label: "Name" },
  externalId: { type: "text" as const, label: "External ID" },
  source: { type: "text" as const, label: "Source" },
};

export const BookingCard: ComponentConfig<BookingCardProps> = {
  fields: {
    name: { type: "text", label: "Booking Name" },
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
        bookingReference: { type: "text", label: "Booking Reference" },
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
  },
  defaultProps: {
    name: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: {
      bookedThrough: { name: "", externalId: "", source: "" },
      confirmationNumber: "",
      provider: { name: "", externalId: "", source: "" },
      bookingReference: "",
    },
    price: { amount: 0, currency: "USD" },
    notes: "",
  },
  render: ({ name, timing, details, price, notes, puck }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const hasPrice = price?.amount > 0;

    return (
      <div
        style={{
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          border: `1px solid ${color.border.default}`,
          borderLeft: `4px solid ${color.accent.amber}`,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎫</span>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: color.text.primary,
            }}
          >
            {name || "Untitled Booking"}
          </h4>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {timing.date && (
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
              {timing.date}
            </span>
          )}
          {timing.time && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: color.accent.amber,
                background: color.bg.muted,
                padding: "3px 10px",
                borderRadius: radius.sm,
              }}
            >
              {timing.time}
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

        {!isClientView && details?.bookingReference && (
          <span
            style={{
              fontSize: 12,
              color: color.text.muted,
            }}
          >
            Ref: {details.bookingReference}
          </span>
        )}

        {hasPrice && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: color.text.primary,
            }}
          >
            {price.currency} {price.amount.toLocaleString()}
          </span>
        )}

        {!isClientView && details?.provider?.name && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: color.text.faint,
            }}
          >
            Provider: {details.provider.name}
          </p>
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
    );
  },
};

export default BookingCard;
