import { validateSearchParams, patterns } from "./validate";

describe("validateSearchParams", () => {
  it("accepts valid flight locations", () => {
    const r = validateSearchParams(
      "http://x/api?from=JFK&to=LAX&date=2026-06-01",
      {
        from: { required: true, pattern: patterns.flightLocation },
        to: { required: true, pattern: patterns.flightLocation },
        date: { pattern: patterns.date },
      }
    );
    expect(r.valid).toBe(true);
    if (r.valid) {
      expect(r.params.from).toBe("JFK");
      expect(r.params.to).toBe("LAX");
    }
  });

  it("rejects bad dates", () => {
    const r = validateSearchParams("http://x/api?from=JFK&to=LAX&date=06-01", {
      from: { required: true, pattern: patterns.flightLocation },
      to: { required: true, pattern: patterns.flightLocation },
      date: { pattern: patterns.date },
    });
    expect(r.valid).toBe(false);
  });
});
