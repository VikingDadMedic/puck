import type { ComponentConfig, Slot } from "@/core";

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
  render: ({ title, items: Items }) => {
    return (
      <div>
        {title && (
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {title}
          </h3>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <Items />
        </div>
      </div>
    );
  },
};

export default CardGroup;
