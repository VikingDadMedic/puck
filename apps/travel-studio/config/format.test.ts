import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats USD with dollar sign and comma separators", () => {
    expect(formatPrice(1200, "USD")).toBe("$1,200");
  });

  it("formats EUR with the euro symbol", () => {
    const result = formatPrice(850, "EUR");
    expect(result).toContain("850");
    expect(result).toMatch(/€/);
  });

  it("formats zero as $0", () => {
    expect(formatPrice(0, "USD")).toBe("$0");
  });

  it("formats large amounts with comma grouping", () => {
    expect(formatPrice(29400, "USD")).toBe("$29,400");
  });

  it("falls back gracefully for an invalid currency code", () => {
    const result = formatPrice(1000, "INVALID_CODE");
    expect(result).toContain("1,000");
    expect(result).toContain("INVALID_CODE");
  });

  it("defaults to USD when no currency is provided", () => {
    expect(formatPrice(100)).toBe("$100");
  });
});
