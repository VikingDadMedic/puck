import type { ComponentConfig } from "@/core";
import { sanitizeUrl } from "../../../lib/api/sanitize";
import { color, fontSize, radius } from "../../tokens";

export type PrimaryCTAProps = {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "outline";
};

const variantStyles: Record<PrimaryCTAProps["variant"], React.CSSProperties> = {
  primary: {
    background: color.accent.blue,
    color: color.text.inverse,
    border: `2px solid ${color.accent.blue}`,
  },
  secondary: {
    background: color.accent.greenMedium,
    color: color.text.inverse,
    border: `2px solid ${color.accent.greenMedium}`,
  },
  outline: {
    background: "transparent",
    color: color.accent.blue,
    border: `2px solid ${color.accent.blue}`,
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

    if (target === "itinerary") return <></>;

    const safeUrl = sanitizeUrl(url);

    return (
      <div
        style={{
          textAlign: "center",
          padding: isProposal ? "32px 0" : "20px 0",
        }}
      >
        <a
          href={safeUrl}
          style={{
            display: "inline-block",
            padding: isProposal ? "16px 48px" : "12px 32px",
            fontSize: isProposal ? fontSize["2xl"] : fontSize.xl,
            fontWeight: 700,
            borderRadius: radius.md,
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
