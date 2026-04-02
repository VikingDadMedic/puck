import { resolveTheme } from "./theme";
import { color, fontFamily, paddingScale } from "./tokens";

describe("resolveTheme", () => {
  it("returns default preset when called with empty metadata", () => {
    const theme = resolveTheme({});
    expect(theme.accent).toBe(color.accent.blue);
    expect(theme.bg).toBe(color.bg.page);
    expect(theme.fontFamily).toBe(fontFamily.system);
    expect(theme.padding).toBe(paddingScale.comfortable);
    expect(theme.maxWidth).toBe(960);
  });

  it("resolves the luxury preset", () => {
    const theme = resolveTheme({ brandTheme: "luxury" });
    expect(theme.accent).toBe(color.accent.amberBrown);
    expect(theme.bg).toBe(color.bg.amberPale);
  });

  it("resolves the adventure preset", () => {
    const theme = resolveTheme({ brandTheme: "adventure" });
    expect(theme.accent).toBe(color.accent.greenLeaf);
    expect(theme.bg).toBe(color.bg.greenLight);
  });

  it("falls back to default for an unknown brand theme", () => {
    const theme = resolveTheme({ brandTheme: "nonexistent" });
    expect(theme.accent).toBe(color.accent.blue);
    expect(theme.bg).toBe(color.bg.page);
  });

  it("uses agency accentColor when provided", () => {
    const theme = resolveTheme({
      brandTheme: "luxury",
      agency: { accentColor: "#ff0000" },
    });
    expect(theme.accent).toBe("#ff0000");
    expect(theme.bg).toBe(color.bg.amberPale);
  });

  it("ignores whitespace-only agency accentColor", () => {
    const theme = resolveTheme({
      brandTheme: "luxury",
      agency: { accentColor: "   " },
    });
    expect(theme.accent).toBe(color.accent.amberBrown);
  });

  it("returns correct font stacks for each preference", () => {
    expect(resolveTheme({ fontPreference: "system" }).fontFamily).toBe(
      fontFamily.system
    );
    expect(resolveTheme({ fontPreference: "serif" }).fontFamily).toBe(
      fontFamily.serif
    );
    expect(resolveTheme({ fontPreference: "modern" }).fontFamily).toBe(
      fontFamily.modern
    );
  });

  it("returns correct padding for each density", () => {
    expect(resolveTheme({ contentPadding: "compact" }).padding).toBe(16);
    expect(resolveTheme({ contentPadding: "comfortable" }).padding).toBe(24);
    expect(resolveTheme({ contentPadding: "spacious" }).padding).toBe(40);
  });

  it("respects a custom contentMaxWidth", () => {
    const theme = resolveTheme({ contentMaxWidth: 1200 });
    expect(theme.maxWidth).toBe(1200);
  });
});
