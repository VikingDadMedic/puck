import type { ComponentConfig } from "@/core";

export type SpacerProps = {
  height: number;
};

export const Spacer: ComponentConfig<SpacerProps> = {
  fields: {
    height: { type: "number", min: 8, max: 120 },
  },
  defaultProps: {
    height: 24,
  },
  render: ({ height }) => {
    return <div style={{ height }} />;
  },
};

export default Spacer;
