import type { DefaultRootProps, RootConfig } from "@/core";

export type RootProps = DefaultRootProps & {
  documentMode: "itinerary" | "proposal" | "client_view";
  brandTheme: "default" | "luxury" | "adventure";
};

const Root: RootConfig<{ props: RootProps }> = {
  defaultProps: {
    title: "Untitled Trip",
    documentMode: "itinerary",
    brandTheme: "default",
  },
  fields: {
    title: { type: "text", label: "Document Title" },
    documentMode: {
      type: "select",
      label: "Document Mode",
      options: [
        { value: "itinerary", label: "Itinerary" },
        { value: "proposal", label: "Proposal" },
        { value: "client_view", label: "Client View" },
      ],
    },
    brandTheme: {
      type: "select",
      label: "Brand Theme",
      options: [
        { value: "default", label: "Default" },
        { value: "luxury", label: "Luxury" },
        { value: "adventure", label: "Adventure" },
      ],
    },
  },
  render: ({ title, brandTheme, puck, children }) => {
    const { isEditing } = puck;
    const themeColors: Record<string, { accent: string; bg: string }> = {
      default: { accent: "#2563eb", bg: "#f8fafc" },
      luxury: { accent: "#854d0e", bg: "#fefce8" },
      adventure: { accent: "#166534", bg: "#f0fdf4" },
    };

    const theme = themeColors[brandTheme] || themeColors.default;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {!isEditing && title && (
          <header
            style={{
              padding: "32px 24px 16px",
              borderBottom: `3px solid ${theme.accent}`,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                color: theme.accent,
                fontWeight: 700,
              }}
            >
              {title}
            </h1>
          </header>
        )}
        <main style={{ padding: isEditing ? 0 : 24 }}>{children}</main>
      </div>
    );
  },
};

export default Root;
