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
  render: ({ height, puck }) => {
    const mode = puck.metadata?.target as string | undefined;
    const effective = mode === "proposal" ? Math.round(height * 1.25) : height;

    return <div style={{ height: effective }} />;
  },
};

export default Spacer;
