import type { ComponentConfig } from "@/core";
import { color } from "../../tokens";

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
  render: ({ label, puck }) => {
    const mode = puck.metadata?.target as string | undefined;
    const isProposal = mode === "proposal";

    return (
      <div style={{ padding: isProposal ? "12px 0" : "8px 0" }}>
        {label && (
          <div
            style={{ textAlign: "center", marginBottom: isProposal ? 10 : 8 }}
          >
            <span
              style={{
                fontSize: 12,
                color: color.text.faint,
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
            borderTop: `1px solid ${color.border.default}`,
            margin: 0,
          }}
        />
      </div>
    );
  },
};

export default Divider;
