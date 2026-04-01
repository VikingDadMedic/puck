/**
 * Travel Studio design tokens — single source of truth for all component styles.
 *
 * **Why JS constants instead of CSS custom properties?**
 * Travel Studio components render inside Puck's iframe. Using inline `style={{}}`
 * props with JS values works regardless of the CSS cascade context, making tokens
 * reliable across both the editor canvas and the public-facing render. CSS class-based
 * approaches would require stylesheet injection into the iframe.
 *
 * **Why are spacing, radius, and fontSize plain numbers (not strings)?**
 * React automatically appends "px" to numeric values on numeric CSS properties
 * (e.g. `style={{ padding: 16 }}` → `padding: 16px`). This enables arithmetic
 * without string manipulation: `gap: spacing.md` just works.
 *
 * **Usage:**
 * ```tsx
 * import { color, radius, spacing } from "../../tokens";
 * <div style={{ background: color.bg.card, borderRadius: radius.lg, padding: spacing.xl }}>
 * ```
 */

export const color = {
  text: {
    primary: "#111827",
    secondary: "#374151",
    tertiary: "#4b5563",
    muted: "#6b7280",
    faint: "#9ca3af",
    inverse: "#ffffff",
  },
  accent: {
    blue: "#2563eb",
    blueDark: "#1d4ed8",
    blueDeep: "#1e40af",
    green: "#059669",
    greenDark: "#065f46",
    greenBright: "#10b981",
    greenLeaf: "#166534",
    greenMedium: "#16a34a",
    amber: "#f59e0b",
    amberDark: "#d97706",
    amberDeep: "#92400e",
    amberBrown: "#854d0e",
    red: "#dc2626",
  },
  bg: {
    page: "#f8fafc",
    card: "#ffffff",
    muted: "#f3f4f6",
    subtle: "#f1f5f9",
    blueLight: "#eff6ff",
    blueSubtle: "#dbeafe",
    greenLight: "#f0fdf4",
    greenPale: "#ecfdf5",
    amberLight: "#fef3c7",
    amberPale: "#fefce8",
    amberWarm: "#fffbeb",
    redLight: "#fef2f2",
  },
  border: {
    default: "#e5e7eb",
    subtle: "#e2e8f0",
    muted: "#d1d5db",
    strong: "#cbd5e1",
    red: "#fca5a5",
    amber: "#fde68a",
    green: "#86efac",
  },
  star: "#f59e0b",
  /** Semantic colors for DaySection time-slot border accents. */
  morning: "#3b82f6",
  afternoon: "#f59e0b",
  evening: "#8b5cf6",
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 20,
} as const;

export const spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 15,
  xl: 16,
  "2xl": 18,
  "3xl": 22,
  "4xl": 24,
  "5xl": 28,
  /** Display size — used by TripHeader in itinerary mode. */
  "6xl": 36,
  /** Display size — used by TripHeader in proposal mode. */
  "7xl": 44,
} as const;

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 2px 8px rgba(0,0,0,0.06)",
  lg: "0 8px 32px rgba(0,0,0,0.12)",
} as const;

export const fontFamily = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", "Palatino Linotype", serif',
  modern: '"Inter", "SF Pro Display", system-ui, sans-serif',
} as const;

export type FontPreference = keyof typeof fontFamily;

export const tokens = {
  color,
  radius,
  spacing,
  fontSize,
  shadow,
  fontFamily,
} as const;

/** Padding scales mapped to density preference. */
export const paddingScale = {
  compact: 16,
  comfortable: 24,
  spacious: 40,
} as const;

export type ContentPadding = keyof typeof paddingScale;

export type Tokens = typeof tokens;

export default tokens;
