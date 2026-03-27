import type { ComponentConfig, Fields } from "@/core";
import { flightPickerField } from "../../fields/flight-picker";
import { richTextToSafeHtml } from "../../../lib/render/richtext";

export type SupplierRefField = {
  name?: string;
  externalId?: string;
  source?: string;
};

export type TransportCardProps = {
  flightSearch: Record<string, unknown> | null;
  type: "flight" | "train" | "transfer" | "ferry" | "carRental";
  carrier: SupplierRefField;
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
    confirmationNumber: { type: "text", label: "Confirmation #" },
    notes: { type: "richtext" },
  },
  resolveFields: async (data, { fields }) => {
    const {
      flightSearch: _omitFlightSearch,
      flightDetails: _omitFlightDetails,
      trainDetails: _omitTrainDetails,
      otherDetails: _omitOtherDetails,
      carRentalDetails: _omitCarRentalDetails,
      ...baseFields
    } = fields;
    void _omitFlightSearch;
    void _omitFlightDetails;
    void _omitTrainDetails;
    void _omitOtherDetails;
    void _omitCarRentalDetails;

    switch (data.props.type) {
      case "flight":
        return {
          ...baseFields,
          flightSearch: flightPickerField,
          flightDetails: transportFlightDetailsField,
        } as Fields<TransportCardProps>;
      case "train":
        return {
          ...baseFields,
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
    carrier: { name: "", externalId: "", source: "" },
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

    const notesHtml = richTextToSafeHtml(notes);

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
            width: isItinerary ? 44 : 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            fontSize: isItinerary ? 20 : 24,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            flex: 1,
            padding: isItinerary ? "10px 16px" : "14px 20px",
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
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#475569",
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
                    color: "#1e40af",
                    background: "#eff6ff",
                    padding: "2px 8px",
                    borderRadius: 4,
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
                  color: "#1e293b",
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
              fontSize: isItinerary ? 14 : 15,
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            <span>{departure || "—"}</span>
            <span style={{ color: "#94a3b8", fontSize: 14 }}>→</span>
            <span>{arrival || "—"}</span>
          </div>

          {hasTiming && (
            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              {timing.date && <span>{timing.date}</span>}
              {timing.time && <span>{timing.time}</span>}
              {timing.duration && (
                <span style={{ color: "#94a3b8" }}>({timing.duration})</span>
              )}
            </div>
          )}

          {hasPrice && (
            <div
              style={{
                fontSize: isProposal ? 16 : 14,
                fontWeight: isProposal ? 700 : 600,
                color: isProposal ? "#059669" : "#1e293b",
                ...(isProposal
                  ? {
                      marginTop: 4,
                      padding: "6px 12px",
                      background: "#ecfdf5",
                      borderRadius: 6,
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
                color: "#065f46",
                background: "#ecfdf5",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              Conf # {confirmationNumber}
            </span>
          )}

          {notesHtml && (
            <div
              style={{
                marginTop: 2,
                fontSize: 13,
                lineHeight: 1.5,
                color: "#64748b",
              }}
              dangerouslySetInnerHTML={{ __html: notesHtml }}
            />
          )}
        </div>
      </div>
    );
  },
};

export default TransportCard;
