import { color, fontFamily, paddingScale } from "./tokens";
import type { FontPreference, ContentPadding } from "./tokens";

const BRAND_PRESETS: Record<string, { accent: string; bg: string }> = {
  default: { accent: color.accent.blue, bg: color.bg.page },
  luxury: { accent: color.accent.amberBrown, bg: color.bg.amberPale },
  adventure: { accent: color.accent.greenLeaf, bg: color.bg.greenLight },
};

export type ThemeMetadata = {
  brandTheme?: string;
  agency?: { name?: string; logoUrl?: string; accentColor?: string };
  fontPreference?: FontPreference;
  contentPadding?: ContentPadding;
  showPricing?: boolean;
  contentMaxWidth?: number;
};

export type ResolvedTheme = {
  accent: string;
  bg: string;
  fontFamily: string;
  padding: number;
  maxWidth: number;
};

export function resolveTheme(meta: ThemeMetadata): ResolvedTheme {
  const preset =
    BRAND_PRESETS[meta.brandTheme ?? "default"] ?? BRAND_PRESETS.default;
  const accentOverride = meta.agency?.accentColor?.trim();

  return {
    accent: accentOverride || preset.accent,
    bg: preset.bg,
    fontFamily: fontFamily[meta.fontPreference ?? "system"],
    padding: paddingScale[meta.contentPadding ?? "comfortable"],
    maxWidth: meta.contentMaxWidth ?? 960,
  };
}
