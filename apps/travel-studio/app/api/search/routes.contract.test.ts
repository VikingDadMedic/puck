import { clearSerpCacheDirectory } from "../../../lib/serp/cache";
import { GET as getActivities } from "./activities/route";
import { GET as getEvents } from "./events/route";
import { GET as getExplore } from "./explore/route";
import { GET as getFinance } from "./finance/route";
import { GET as getFlights } from "./flights/route";
import { GET as getGoogleLight } from "./google-light/route";
import { GET as getHotels } from "./hotels/route";
import { GET as getImages } from "./images/route";
import { GET as getMapsReviews } from "./maps-reviews/route";
import { GET as getOpenTableReviews } from "./opentable-reviews/route";
import { GET as getPlaces } from "./places/route";
import { GET as getRestaurants } from "./restaurants/route";
import { GET as getYelp } from "./yelp/route";

type RouteCase = {
  name: string;
  get: (request: Request) => Promise<Response>;
  validQuery: string;
  invalidQuery?: string;
};

const ROUTES: RouteCase[] = [
  {
    name: "activities",
    get: getActivities,
    validQuery: "destination=Paris",
  },
  {
    name: "events",
    get: getEvents,
    validQuery: "q=Jazz%20festival&location=Rome",
  },
  {
    name: "explore",
    get: getExplore,
    validQuery: "from=JFK&outboundDate=2026-06-01&returnDate=2026-06-10",
  },
  {
    name: "finance",
    get: getFinance,
    validQuery: "q=AAPL",
  },
  {
    name: "flights",
    get: getFlights,
    validQuery: "from=JFK&to=LAX&date=2026-06-01",
  },
  {
    name: "google-light",
    get: getGoogleLight,
    validQuery: "q=best%20things%20to%20do%20in%20rome",
  },
  {
    name: "hotels",
    get: getHotels,
    validQuery: "destination=Paris&checkIn=2026-06-01&checkOut=2026-06-05",
  },
  {
    name: "images",
    get: getImages,
    validQuery: "query=coastline",
  },
  {
    name: "maps-reviews",
    get: getMapsReviews,
    validQuery: "data_id=abc123",
  },
  {
    name: "opentable-reviews",
    get: getOpenTableReviews,
    validQuery: "rid=456",
  },
  {
    name: "places",
    get: getPlaces,
    validQuery: "query=Paris",
  },
  {
    name: "restaurants",
    get: getRestaurants,
    validQuery: "destination=Paris",
  },
  {
    name: "yelp",
    get: getYelp,
    validQuery: "find_loc=Paris&find_desc=pizza",
  },
];

const ORIGINAL_ENV = process.env;

function routeUrl(route: RouteCase, query: string): string {
  return `http://localhost/api/search/${route.name}${query ? `?${query}` : ""}`;
}

function authHeaders(): Record<string, string> {
  const key = process.env.TRAVEL_STUDIO_API_KEY;
  return key ? { "x-api-key": key } : {};
}

describe("search route contracts", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.TRAVEL_STUDIO_API_KEY = "test-api-key";
    delete process.env.SERP_API_KEY;
    delete process.env.PEXELS_API_KEY;
    delete process.env.UNSPLASH_ACCESS_KEY;
    clearSerpCacheDirectory();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    clearSerpCacheDirectory();
  });

  it.each(ROUTES)(
    "returns AUTH_REQUIRED when header is missing ($name)",
    async (route) => {
      const response = await route.get(
        new Request(routeUrl(route, route.validQuery))
      );
      const body = (await response.json()) as {
        error?: { code?: string; requestId?: string };
      };

      expect(response.status).toBe(401);
      expect(body.error?.code).toBe("AUTH_REQUIRED");
      expect(body.error?.requestId).toBeTruthy();
      expect(response.headers.get("x-request-id")).toBeTruthy();
    }
  );

  it.each(ROUTES)(
    "returns VALIDATION_ERROR on invalid query ($name)",
    async (route) => {
      const response = await route.get(
        new Request(routeUrl(route, route.invalidQuery ?? ""), {
          headers: authHeaders(),
        })
      );
      const body = (await response.json()) as {
        error?: { code?: string; requestId?: string };
      };

      expect(response.status).toBe(400);
      expect(body.error?.code).toBe("VALIDATION_ERROR");
      expect(body.error?.requestId).toBeTruthy();
      expect(response.headers.get("x-request-id")).toBeTruthy();
    }
  );

  it.each(ROUTES)(
    "returns provider envelope on upstream failure ($name)",
    async (route) => {
      if (route.name === "images") {
        process.env.PEXELS_API_KEY = "fake";
        process.env.UNSPLASH_ACCESS_KEY = "fake";
        jest
          .spyOn(globalThis, "fetch")
          .mockRejectedValueOnce(new Error("network down"))
          .mockRejectedValueOnce(new Error("network down"));
      } else {
        delete process.env.SERP_API_KEY;
      }

      const response = await route.get(
        new Request(routeUrl(route, route.validQuery), {
          headers: authHeaders(),
        })
      );
      const body = (await response.json()) as {
        error?: { code?: string; requestId?: string };
      };

      expect(response.status).toBe(502);
      expect(body.error?.code).toBe("PROVIDER_ERROR");
      expect(body.error?.requestId).toBeTruthy();
      expect(response.headers.get("x-request-id")).toBeTruthy();
    }
  );
});
