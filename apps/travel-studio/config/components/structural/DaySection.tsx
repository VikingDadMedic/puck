import type { ComponentConfig, Slot } from "@/core";
import { color, radius } from "../../tokens";

export type DaySectionProps = {
  date: string;
  label: string;
  morning: Slot;
  afternoon: Slot;
  evening: Slot;
};

export const DaySection: ComponentConfig<DaySectionProps> = {
  fields: {
    date: { type: "text", label: "Date" },
    label: { type: "text", label: "Day Label" },
    morning: { type: "slot" },
    afternoon: { type: "slot" },
    evening: { type: "slot" },
  },
  defaultProps: {
    date: "",
    label: "Day 1",
    morning: [],
    afternoon: [],
    evening: [],
  },
  render: ({
    date,
    label,
    morning: Morning,
    afternoon: Afternoon,
    evening: Evening,
    puck,
  }) => {
    const mode = puck.metadata?.target as string | undefined;
    const isProposal = mode === "proposal";
    const isClientView = mode === "client_view";

    const looksInternal = /^(ref|id|doc)[_-]/i.test(date ?? "");
    const showDate = date && !(isClientView && looksInternal);

    const timeSlots = [
      { name: "Morning", Component: Morning, slotColor: color.morning },
      { name: "Afternoon", Component: Afternoon, slotColor: color.afternoon },
      { name: "Evening", Component: Evening, slotColor: color.evening },
    ] as const;

    return (
      <div
        style={{
          background: color.bg.page,
          borderRadius: radius.xl,
          border: `1px solid ${color.border.default}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: isProposal ? "20px 24px" : "16px 20px",
            borderBottom: `1px solid ${color.border.default}`,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: isProposal ? 22 : 18,
              fontWeight: 700,
              color: color.text.primary,
            }}
          >
            {label}
          </span>
          {showDate && (
            <span style={{ fontSize: 14, color: color.text.muted }}>
              {date}
            </span>
          )}
        </div>

        <div
          className="ts-day-slots"
          style={{
            padding: isProposal ? 24 : 20,
            display: "flex",
            flexDirection: "column",
            gap: isProposal ? 20 : 16,
          }}
        >
          {timeSlots.map(({ name, Component, slotColor }) => (
            <div
              key={name}
              style={{
                borderLeft: `3px solid ${slotColor}`,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: color.text.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                {name}
              </div>
              <Component
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export default DaySection;
