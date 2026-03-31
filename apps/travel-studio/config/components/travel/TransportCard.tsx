import type { ComponentConfig, Fields } from "@/core";
import { flightPickerField } from "../../fields/flight-picker";
import { color, fontSize, radius, shadow } from "../../tokens";

export type SupplierRefField = {
  name?: string;
  externalId?: string;
  source?: string;
};

export type TransportCardProps = {
  flightSearch: Record<string, unknown> | null;
  type: "flight" | "train" | "transfer" | "ferry" | "carRental";
  leg: "departure" | "arrival";
  carrier: SupplierRefField;
  bookedThrough: SupplierRefField;
  timing: { date: string; time: string; duration: string; timezone: string };
  departure: string;
  arrival: string;
  price: { amount: number; currency: string };
  flightDetails: {
    flightNumber: string;
    terminal: string;
    gate: string;
    seatTicketDetails: string;
  };
  trainDetails: { trainNumber: string };
  otherDetails: { number: string };
  carRentalDetails: { leg: "pickUp" | "dropOff" };
  confirmationNumber: string;
  notes: string;
  departureCoordinates: { lat: number; lng: number } | null;
  arrivalCoordinates: { lat: number; lng: number } | null;
};

const typeIcons: Record<TransportCardProps["type"], string> = {
  flight: "✈",
  train: "🚂",
  transfer: "🚐",
  ferry: "⛴",
  carRental: "🚗",
};

const supplierObjectFields = {
  name: { type: "text" as const, label: "Name" },
  externalId: { type: "text" as const, label: "External ID" },
  source: { type: "text" as const, label: "Source" },
};

const transportFlightDetailsField = {
  type: "object" as const,
  label: "Flight Details",
  objectFields: {
    flightNumber: { type: "text" as const, label: "Flight Number" },
    terminal: { type: "text" as const, label: "Terminal" },
    gate: { type: "text" as const, label: "Gate" },
    seatTicketDetails: {
      type: "text" as const,
      label: "Seat / Ticket Details",
    },
  },
};

const transportTrainDetailsField = {
  type: "object" as const,
  label: "Train Details",
  objectFields: {
    trainNumber: { type: "text" as const, label: "Train Number" },
  },
};

const transportCarRentalDetailsField = {
  type: "object" as const,
  label: "Car rental",
  objectFields: {
    leg: {
      type: "select" as const,
      label: "Leg",
      options: [
        { value: "pickUp", label: "Pick up" },
        { value: "dropOff", label: "Drop off" },
      ],
    },
  },
};

const transportOtherDetailsField = {
  type: "object" as const,
  label: "Details",
  objectFields: {
    number: { type: "text" as const, label: "Reference Number" },
  },
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
        { value: "carRental", label: "Car Rental" },
      ],
    },
    leg: {
      type: "radio",
      label: "Leg",
      options: [
        { value: "departure", label: "Departure" },
        { value: "arrival", label: "Arrival" },
      ],
    },
    flightSearch: flightPickerField,
    flightDetails: transportFlightDetailsField,
    trainDetails: transportTrainDetailsField,
    carRentalDetails: transportCarRentalDetailsField,
    otherDetails: transportOtherDetailsField,
    carrier: {
      type: "object",
      label: "Carrier / Airline",
      objectFields: supplierObjectFields,
    },
    departure: { type: "text", label: "From" },
    arrival: { type: "text", label: "To" },
    timing: {
      type: "object",
      objectFields: {
        date: { type: "text", label: "Date" },
        time: { type: "text", label: "Time" },
        duration: { type: "text", label: "Duration" },
        timezone: { type: "text", label: "Timezone" },
      },
    },
    price: {
      type: "object",
      objectFields: {
        amount: { type: "number" },
        currency: { type: "text" },
      },
    },
    bookedThrough: {
      type: "object",
      label: "Booked Through",
      objectFields: supplierObjectFields,
    },
    confirmationNumber: { type: "text", label: "Confirmation #" },
    notes: { type: "richtext" },
    departureCoordinates: {
      type: "object",
      label: "Departure Coordinates",
      objectFields: {
        lat: { type: "number", label: "Latitude" },
        lng: { type: "number", label: "Longitude" },
      },
    },
    arrivalCoordinates: {
      type: "object",
      label: "Arrival Coordinates",
      objectFields: {
        lat: { type: "number", label: "Latitude" },
        lng: { type: "number", label: "Longitude" },
      },
    },
  },
  resolveFields: async (data, { fields }) => {
    const {
      leg: _omitLeg,
      flightSearch: _omitFlightSearch,
      flightDetails: _omitFlightDetails,
      trainDetails: _omitTrainDetails,
      otherDetails: _omitOtherDetails,
      carRentalDetails: _omitCarRentalDetails,
      ...baseFields
    } = fields;
    void _omitLeg;
    void _omitFlightSearch;
    void _omitFlightDetails;
    void _omitTrainDetails;
    void _omitOtherDetails;
    void _omitCarRentalDetails;

    const legField = {
      type: "radio" as const,
      label: "Leg",
      options: [
        { value: "departure", label: "Departure" },
        { value: "arrival", label: "Arrival" },
      ],
    };

    switch (data.props.type) {
      case "flight":
        return {
          ...baseFields,
          leg: legField,
          flightSearch: flightPickerField,
          flightDetails: transportFlightDetailsField,
        } as Fields<TransportCardProps>;
      case "train":
        return {
          ...baseFields,
          leg: legField,
          trainDetails: transportTrainDetailsField,
        } as Fields<TransportCardProps>;
      case "carRental":
        return {
          ...baseFields,
          carRentalDetails: transportCarRentalDetailsField,
        } as Fields<TransportCardProps>;
      case "ferry":
      case "transfer":
      default:
        return {
          ...baseFields,
          leg: legField,
          otherDetails: transportOtherDetailsField,
        } as Fields<TransportCardProps>;
    }
  },
  resolveData: async ({ props }, { changed }) => {
    if (!changed.flightSearch || !props.flightSearch) return { props };
    const fs = props.flightSearch as Record<string, unknown>;
    const carrierName =
      typeof fs.carrier === "string" ? fs.carrier : props.carrier?.name || "";
    return {
      props: {
        carrier: { ...props.carrier, name: carrierName },
        departure:
          typeof fs.departure === "string"
            ? fs.departure
            : props.departure || "",
        arrival:
          typeof fs.arrival === "string" ? fs.arrival : props.arrival || "",
        timing: {
          ...props.timing,
          time:
            typeof fs.departureTime === "string"
              ? fs.departureTime
              : props.timing?.time,
        },
        flightDetails: {
          ...props.flightDetails,
          flightNumber:
            typeof fs.flightNumber === "string"
              ? fs.flightNumber
              : props.flightDetails?.flightNumber,
        },
        price: {
          amount:
            typeof fs.price === "number" ? fs.price : props.price?.amount || 0,
          currency: props.price?.currency || "USD",
        },
      },
      readOnly: { departure: true, arrival: true },
    };
  },
  defaultProps: {
    flightSearch: null,
    type: "flight",
    leg: "departure",
    carrier: { name: "", externalId: "", source: "" },
    bookedThrough: { name: "", externalId: "", source: "" },
    timing: { date: "", time: "", duration: "", timezone: "" },
    departure: "",
    arrival: "",
    price: { amount: 0, currency: "USD" },
    flightDetails: {
      flightNumber: "",
      terminal: "",
      gate: "",
      seatTicketDetails: "",
    },
    trainDetails: { trainNumber: "" },
    otherDetails: { number: "" },
    carRentalDetails: { leg: "pickUp" },
    confirmationNumber: "",
    notes: "",
    departureCoordinates: null,
    arrivalCoordinates: null,
  },
  render: ({
    type,
    carrier,
    departure,
    arrival,
    timing,
    price,
    flightDetails,
    trainDetails,
    otherDetails,
    carRentalDetails,
    confirmationNumber,
    notes,
    puck,
  }) => {
    const icon = typeIcons[type] || "✈";
    const isProposal = puck.metadata?.target === "proposal";
    const isItinerary = puck.metadata?.target === "itinerary";
    const hasPrice = price?.amount > 0;
    const hasTiming = timing?.date || timing?.time || timing?.duration;
    const carrierLabel = carrier?.name?.trim() || "";

    const typeDetail =
      type === "flight" && flightDetails?.flightNumber
        ? flightDetails.flightNumber
        : type === "train" && trainDetails?.trainNumber
        ? trainDetails.trainNumber
        : type === "carRental"
        ? carRentalDetails?.leg || "pickUp"
        : otherDetails?.number || null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: color.bg.card,
          borderRadius: radius.lg,
          overflow: "hidden",
          border: `1px solid ${color.border.default}`,
          ...(isProposal ? { boxShadow: shadow.md } : {}),
        }}
      >
        <div
          style={{
            width: isItinerary ? 44 : 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: color.bg.subtle,
            fontSize: isItinerary ? 20 : 24,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: isItinerary ? 4 : 8,
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
              <span
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: 600,
                  color: color.text.tertiary,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {type}
              </span>
              {typeDetail && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: color.accent.blueDeep,
                    background: color.bg.blueLight,
                    padding: "2px 8px",
                    borderRadius: radius.xs,
                  }}
                >
                  {typeDetail}
                </span>
              )}
            </div>
            {carrierLabel && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: color.text.primary,
                }}
              >
                {carrierLabel}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: isItinerary ? fontSize.md : fontSize.lg,
              fontWeight: 600,
              color: color.text.primary,
            }}
          >
            <span>{departure || "—"}</span>
            <span style={{ color: color.text.faint, fontSize: fontSize.md }}>
              →
            </span>
            <span>{arrival || "—"}</span>
          </div>

          {hasTiming && (
            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 13,
                color: color.text.muted,
              }}
            >
              {timing.date && <span>{timing.date}</span>}
              {timing.time && <span>{timing.time}</span>}
              {timing.duration && (
                <span style={{ color: color.text.faint }}>
                  ({timing.duration})
                </span>
              )}
            </div>
          )}

          {hasPrice && (
            <div
              style={{
                fontSize: isProposal ? 16 : 14,
                fontWeight: isProposal ? 700 : 600,
                color: isProposal ? color.accent.green : color.text.primary,
                ...(isProposal
                  ? {
                      marginTop: 4,
                      padding: "6px 12px",
                      background: color.bg.greenPale,
                      borderRadius: radius.sm,
                      alignSelf: "flex-start",
                    }
                  : {}),
              }}
            >
              {price.currency === "USD" ? "$" : price.currency + " "}
              {price.amount.toLocaleString()}
            </div>
          )}

          {confirmationNumber && (
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 12,
                fontWeight: 600,
                color: color.accent.greenDark,
                background: color.bg.greenPale,
                padding: "3px 10px",
                borderRadius: radius.sm,
              }}
            >
              Conf # {confirmationNumber}
            </span>
          )}

          {notes && (
            <div
              style={{
                marginTop: 2,
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

export default TransportCard;
