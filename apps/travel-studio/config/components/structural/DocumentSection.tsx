import type { ComponentConfig, Slot } from "@/core";
import { color } from "../../tokens";

export type DocumentSectionProps = {
  title: string;
  content: Slot;
};

export const DocumentSection: ComponentConfig<DocumentSectionProps> = {
  fields: {
    title: { type: "text" },
    content: { type: "slot" },
  },
  defaultProps: {
    title: "",
    content: [],
  },
  render: ({ title, content: Content, puck }) => {
    const mode = puck.metadata?.target as string | undefined;
    const isProposal = mode === "proposal";

    return (
      <div
        style={{
          padding: isProposal ? "32px 0" : "24px 0",
          borderBottom: `1px solid ${color.border.default}`,
        }}
      >
        {title && (
          <h2
            style={{
              margin: isProposal ? "0 0 20px" : "0 0 16px",
              fontSize: isProposal ? 26 : 22,
              fontWeight: 600,
              color: color.text.primary,
            }}
          >
            {title}
          </h2>
        )}
        <Content
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        />
      </div>
    );
  },
};

export default DocumentSection;
