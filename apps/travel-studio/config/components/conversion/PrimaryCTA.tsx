import type { ComponentConfig } from "@/core";

export type PrimaryCTAProps = {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
};

const variantStyles: Record<PrimaryCTAProps["variant"], React.CSSProperties> = {
  primary: {
    background: "#2563eb",
    color: "#ffffff",
    border: "2px solid #2563eb",
  },
  secondary: {
    background: "#16a34a",
    color: "#ffffff",
    border: "2px solid #16a34a",
  },
  outline: {
    background: "transparent",
    color: "#2563eb",
    border: "2px solid #2563eb",
  },
};

export const PrimaryCTA: ComponentConfig<PrimaryCTAProps> = {
  fields: {
    text: { type: "text", label: "Button Text" },
    url: { type: "text", label: "Link URL" },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "outline", label: "Outline" },
      ],
    },
  },
  defaultProps: {
    text: "Book Now",
    url: "#",
    variant: "primary",
  },
  render: ({ text, url, variant, puck }) => {
    const target = puck.metadata?.target;
    const isProposal = target === "proposal";

    if (target === "itinerary") return null;

    return (
      <div
        style={{
          textAlign: "center",
          padding: isProposal ? "32px 0" : "20px 0",
        }}
      >
        <a
          href={url}
          style={{
            display: "inline-block",
            padding: isProposal ? "16px 48px" : "12px 32px",
            fontSize: isProposal ? 20 : 16,
            fontWeight: 700,
            borderRadius: 8,
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
            letterSpacing: isProposal ? "0.02em" : undefined,
            ...variantStyles[variant],
          }}
        >
          {text}
        </a>
      </div>
    );
  },
};

export default PrimaryCTA;
