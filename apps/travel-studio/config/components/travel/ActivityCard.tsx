import type { ComponentConfig } from "@/core";
import { activityPickerField } from "../../fields/activity-picker";
import { imagePickerField } from "../../fields/image-picker";

export type ActivityCardProps = {
  activity: any;
  name: string;
  timing: { date: string; time: string; duration: string; timezone: string };
  details: {
    bookedThrough: string;
    confirmationNumber: string;
    provider: string;
  };
  description: string;
  imageUrl: string;
};

export const ActivityCard: ComponentConfig<ActivityCardProps> = {
  fields: {
    activity: activityPickerField,
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
        bookedThrough: { type: "text", label: "Booked Through" },
        confirmationNumber: { type: "text", label: "Confirmation #" },
        provider: { type: "text", label: "Provider" },
      },
    },
    description: { type: "richtext" },
    imageUrl: imagePickerField,
  },
  defaultProps: {
    activity: null,
    name: "",
    timing: { date: "", time: "", duration: "", timezone: "" },
    details: { bookedThrough: "", confirmationNumber: "", provider: "" },
    description: "",
    imageUrl: "",
  },
  resolveData: async ({ props }, { changed }) => {
    if (!changed.activity || !props.activity) return { props };
    return {
      props: {
        name: props.activity.name || props.name,
        description: props.activity.description || props.description,
        imageUrl: props.activity.imageUrl || props.imageUrl,
      },
      readOnly: { name: true },
    };
  },
  render: ({ name, timing, details, description, imageUrl }) => {
    const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;
    const hasBookingDetails =
      details.bookedThrough || details.confirmationNumber || details.provider;

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
              dangerouslySetInnerHTML={{ __html: description }}
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
              {details.bookedThrough && (
                <span>
                  <strong style={{ color: "#374151" }}>Booked via</strong>{" "}
                  {details.bookedThrough}
                </span>
              )}
              {details.confirmationNumber && (
                <span>
                  <strong style={{ color: "#374151" }}>Conf #</strong>{" "}
                  {details.confirmationNumber}
                </span>
              )}
              {details.provider && (
                <span>
                  <strong style={{ color: "#374151" }}>Provider</strong>{" "}
                  {details.provider}
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
