import type { ComponentConfig } from "@/core";
import { activityPickerField } from "../../fields/activity-picker";
import { eventPickerField } from "../../fields/event-picker";
import { imagePickerField } from "../../fields/image-picker";
import { richTextToSafeHtml } from "../../../lib/render/richtext";

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
  description: string;
  imageUrl: string;
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
    description: { type: "richtext" },
    imageUrl: imagePickerField,
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
    description: "",
    imageUrl: "",
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
  render: ({ name, timing, details, description, imageUrl, puck }) => {
    const isClientView = puck.metadata?.target === "client_view";
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const hasBookingDetails =
      !isClientView &&
      (details.bookedThrough?.name ||
        details.confirmationNumber ||
        details.provider?.name);

    return (
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderLeft: "4px solid #10b981",
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
              color: "#111827",
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
                  color: "#065f46",
                  background: "#ecfdf5",
                  padding: "3px 10px",
                  borderRadius: 6,
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
                  color: "#374151",
                  background: "#f3f4f6",
                  padding: "3px 10px",
                  borderRadius: 6,
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
                color: "#4b5563",
              }}
              dangerouslySetInnerHTML={{
                __html: richTextToSafeHtml(description),
              }}
            />
          )}

          {hasBookingDetails && (
            <div
              style={{
                marginTop: 4,
                paddingTop: 8,
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {details.bookedThrough?.name && (
                <span>
                  <strong style={{ color: "#374151" }}>Booked via</strong>{" "}
                  {details.bookedThrough.name}
                </span>
              )}
              {details.confirmationNumber && (
                <span>
                  <strong style={{ color: "#374151" }}>Conf #</strong>{" "}
                  {details.confirmationNumber}
                </span>
              )}
              {details.provider?.name && (
                <span>
                  <strong style={{ color: "#374151" }}>Provider</strong>{" "}
                  {details.provider.name}
                </span>
              )}
            </div>
          )}
        </div>

        {hasImage && (
          <div
            style={{
              width: 140,
              flexShrink: 0,
              background: `url(${imageUrl}) center/cover no-repeat`,
            }}
          />
        )}
      </div>
    );
  },
};

export default ActivityCard;
