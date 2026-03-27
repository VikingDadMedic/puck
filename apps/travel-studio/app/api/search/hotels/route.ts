import { searchHotels } from "../../../../lib/serp/engines/hotels";
import { runSearchRoute, patterns } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:hotels",
    routeLabel: "hotels",
    rules: {
      destination: { required: true, maxLength: 200 },
      checkIn: { pattern: patterns.date, maxLength: 10 },
      checkOut: { pattern: patterns.date, maxLength: 10 },
    },
    providerErrorMessage: "Hotel search failed",
    run: (params) =>
      searchHotels({
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
      }),
  });
}
