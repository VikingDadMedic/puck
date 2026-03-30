import type { ComponentConfig, Slot } from "@/core";
import { color } from "../../tokens";

export type CardGroupProps = {
  title: string;
  items: Slot;
};

export const CardGroup: ComponentConfig<CardGroupProps> = {
  fields: {
    title: { type: "text" },
    items: { type: "slot" },
  },
  defaultProps: {
    title: "",
    items: [],
  },
  render: ({ title, items: Items, puck }) => {
    const mode = puck.metadata?.target as string | undefined;
    const isProposal = mode === "proposal";

    return (
      <div>
        {title && (
          <h3
            style={{
              margin: isProposal ? "0 0 20px" : "0 0 16px",
              fontSize: isProposal ? 22 : 18,
              fontWeight: 600,
              color: color.text.primary,
            }}
          >
            {title}
          </h3>
        )}
        <Items
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: isProposal ? 20 : 16,
          }}
        />
      </div>
    );
  },
};

export default CardGroup;
