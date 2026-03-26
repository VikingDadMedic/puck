import type { ComponentConfig, Slot } from "@/core";

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
  render: ({ title, content: Content }) => {
    return (
      <div
        style={{
          padding: "24px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {title && (
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 22,
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            {title}
          </h2>
        )}
        <Content />
      </div>
    );
  },
};

export default DocumentSection;
