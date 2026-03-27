import { apiGuard } from "./guard";

const ORIGINAL_ENV = process.env;

function makeRequest(
  url = "http://localhost/api/search/flights",
  headers: Record<string, string> = {}
): Request {
  return new Request(url, {
    headers: {
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
  });
}

describe("apiGuard", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("rate limits unauthenticated traffic before auth checks", () => {
    process.env.TRAVEL_STUDIO_API_KEY = "secret";
    const routePrefix = `guard:test:${Date.now()}`;

    const first = apiGuard(makeRequest(), {
      routePrefix,
      maxRequests: 1,
      windowMs: 60_000,
    });
    const second = apiGuard(makeRequest(), {
      routePrefix,
      maxRequests: 1,
      windowMs: 60_000,
    });

    expect(first.ok).toBe(false);
    if (!first.ok) {
      expect(first.response.status).toBe(401);
    }

    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.response.status).toBe(429);
      expect(second.response.headers.get("Retry-After")).toBeTruthy();
    }
  });

  it("does not accept api_key query parameter for auth", async () => {
    process.env.TRAVEL_STUDIO_API_KEY = "secret";

    const result = apiGuard(
      makeRequest("http://localhost/api/search/flights?api_key=secret"),
      {
        routePrefix: `guard:query:${Date.now()}`,
      }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(401);
      const body = (await result.response.json()) as {
        error?: { code?: string };
      };
      expect(body.error?.code).toBe("AUTH_REQUIRED");
    }
  });

  it("allows request when header api key matches", () => {
    process.env.TRAVEL_STUDIO_API_KEY = "secret";

    const result = apiGuard(makeRequest(undefined, { "x-api-key": "secret" }), {
      routePrefix: `guard:auth:${Date.now()}`,
    });

    expect(result.ok).toBe(true);
  });
});
