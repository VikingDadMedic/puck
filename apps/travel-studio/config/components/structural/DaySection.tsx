import type { ComponentConfig, Slot } from "@/core";

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
  }) => {
    const timeSlots = [
      { name: "Morning", Component: Morning, color: "#3b82f6" },
      { name: "Afternoon", Component: Afternoon, color: "#f59e0b" },
      { name: "Evening", Component: Evening, color: "#8b5cf6" },
    ] as const;

    return (
      <div
        style={{
          background: "#f9fafb",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {label}
          </span>
          {date && (
            <span style={{ fontSize: 14, color: "#6b7280" }}>{date}</span>
          )}
        </div>

        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {timeSlots.map(({ name, Component, color }) => (
            <div
              key={name}
              style={{
                borderLeft: `3px solid ${color}`,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                {name}
              </div>
              <Component />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export default DaySection;
