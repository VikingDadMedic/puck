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
    greenLight: "#f0fdf4",
    greenPale: "#ecfdf5",
    amberLight: "#fef3c7",
    amberPale: "#fefce8",
    amberWarm: "#fffbeb",
    redLight: "#fef2f2",
    slate: "#1e293b",
  },
  border: {
    default: "#e5e7eb",
    subtle: "#e2e8f0",
    muted: "#d1d5db",
    strong: "#cbd5e1",
  },
  badge: {
    blue: { text: "#1d4ed8", bg: "#eff6ff" },
    green: { text: "#065f46", bg: "#f0fdf4" },
    greenBright: { text: "#059669", bg: "#f0fdf4" },
    amber: { text: "#92400e", bg: "#fef3c7" },
    red: { text: "#dc2626", bg: "#fef2f2" },
  },
  star: "#f59e0b",
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
} as const;

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 2px 8px rgba(0,0,0,0.06)",
  lg: "0 8px 32px rgba(0,0,0,0.12)",
} as const;

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const tokens = {
  color,
  radius,
  spacing,
  fontSize,
  shadow,
  fontFamily,
} as const;

export type Tokens = typeof tokens;

export default tokens;
