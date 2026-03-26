import type { ComponentConfig } from "@/core";

export type DividerProps = {
  label: string;
};

export const Divider: ComponentConfig<DividerProps> = {
  fields: {
    label: { type: "text" },
  },
  defaultProps: {
    label: "",
  },
  render: ({ label }) => {
    return (
      <div style={{ padding: "8px 0" }}>
        {label && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <span
              style={{
                fontSize: 12,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </span>
          </div>
        )}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: 0,
          }}
        />
      </div>
    );
  },
};

export default Divider;
