import type { DefaultRootProps, RootConfig } from "@/core";
import { color } from "./tokens";
import { resolveTheme } from "./theme";
import type { FontPreference, ContentPadding } from "./tokens";

export type DocumentType = "template" | "itinerary";

export type RootProps = DefaultRootProps & {
  documentType: DocumentType;
  documentMode: "itinerary" | "proposal" | "client_view";
  brandTheme: "default" | "luxury" | "adventure";
  showPricing?: boolean;
  agencyName?: string;
  agencyLogoUrl?: string;
  agencyAccentColor?: string;
  fontPreference?: FontPreference;
  contentMaxWidth?: number;
  contentPadding?: ContentPadding;
};

const Root: RootConfig<{ props: RootProps }> = {
  defaultProps: {
    title: "Untitled Trip",
    documentType: "template",
    documentMode: "itinerary",
    brandTheme: "default",
    showPricing: true,
    agencyName: "",
    agencyLogoUrl: "",
    agencyAccentColor: "",
    fontPreference: "system",
    contentMaxWidth: 960,
    contentPadding: "comfortable",
  },
  fields: {
    title: { type: "text", label: "Document Title" },
    documentType: {
      type: "select",
      label: "Document Type",
      options: [
        { value: "template", label: "Template" },
        { value: "itinerary", label: "Itinerary" },
      ],
    },
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
    showPricing: {
      type: "radio",
      label: "Show Pricing",
      options: [
        { value: true, label: "Show" },
        { value: false, label: "Hide" },
      ],
    },
    agencyName: { type: "text", label: "Agency Name" },
    agencyLogoUrl: { type: "text", label: "Agency Logo URL" },
    agencyAccentColor: { type: "text", label: "Accent Color Override (#hex)" },
    fontPreference: {
      type: "select",
      label: "Font Style",
      options: [
        { value: "system", label: "System Sans-Serif" },
        { value: "serif", label: "Classic Serif" },
        { value: "modern", label: "Modern (Inter)" },
      ],
    },
    contentMaxWidth: {
      type: "number",
      label: "Content Max Width (px)",
      min: 600,
      max: 1400,
    },
    contentPadding: {
      type: "select",
      label: "Content Density",
      options: [
        { value: "compact", label: "Compact" },
        { value: "comfortable", label: "Comfortable" },
        { value: "spacious", label: "Spacious" },
      ],
    },
  },
  render: ({
    title,
    brandTheme,
    agencyName,
    agencyLogoUrl,
    agencyAccentColor,
    fontPreference,
    contentMaxWidth,
    contentPadding,
    puck,
    children,
  }) => {
    const { isEditing } = puck;
    const theme = resolveTheme({
      brandTheme,
      agency: {
        name: agencyName,
        logoUrl: agencyLogoUrl,
        accentColor: agencyAccentColor,
      },
      fontPreference,
      contentPadding,
      contentMaxWidth,
    });

    const hasAgency = agencyName?.trim() || agencyLogoUrl?.trim();

    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          fontFamily: theme.fontFamily,
        }}
      >
        {!isEditing && (hasAgency || title) && (
          <header
            style={{
              padding: "32px 24px 16px",
              maxWidth: theme.maxWidth,
              margin: "0 auto",
              borderBottom: `3px solid ${theme.accent}`,
            }}
          >
            {hasAgency && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: title ? 12 : 0,
                }}
              >
                {agencyLogoUrl?.trim() && (
                  <img
                    src={agencyLogoUrl}
                    alt={agencyName || "Agency logo"}
                    style={{ height: 36, width: "auto", objectFit: "contain" }}
                  />
                )}
                {agencyName?.trim() && (
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: color.text.secondary,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                    }}
                  >
                    {agencyName}
                  </span>
                )}
              </div>
            )}
            {title && (
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
            )}
          </header>
        )}

        <main
          style={{
            maxWidth: isEditing ? undefined : theme.maxWidth,
            margin: "0 auto",
            padding: isEditing ? 0 : theme.padding,
          }}
        >
          {children}
        </main>

        {!isEditing && hasAgency && (
          <footer
            style={{
              maxWidth: theme.maxWidth,
              margin: "0 auto",
              padding: "24px",
              borderTop: `1px solid ${color.border.default}`,
              textAlign: "center",
              fontSize: 12,
              color: color.text.faint,
            }}
          >
            Prepared by {agencyName || "your travel advisor"}
          </footer>
        )}
      </div>
    );
  },
};

export default Root;
