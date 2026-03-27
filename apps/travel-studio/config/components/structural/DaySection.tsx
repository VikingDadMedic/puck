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
    puck,
  }) => {
    const mode = puck.metadata?.target as string | undefined;
    const isProposal = mode === "proposal";
    const isClientView = mode === "client_view";

    const looksInternal = /^(ref|id|doc)[_-]/i.test(date ?? "");
    const showDate = date && !(isClientView && looksInternal);

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
            padding: isProposal ? "20px 24px" : "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: isProposal ? 22 : 18,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {label}
          </span>
          {showDate && (
            <span style={{ fontSize: 14, color: "#6b7280" }}>{date}</span>
          )}
        </div>

        <div
          style={{
            padding: isProposal ? 24 : 20,
            display: "flex",
            flexDirection: "column",
            gap: isProposal ? 20 : 16,
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
