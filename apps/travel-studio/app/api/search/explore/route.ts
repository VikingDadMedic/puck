import { exploreDestinations } from "../../../../lib/serp/engines/explore";
import { runSearchRoute, patterns } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:explore",
    routeLabel: "explore",
    rules: {
      from: { required: true, maxLength: 64, pattern: patterns.flightLocation },
      outboundDate: { pattern: patterns.date, maxLength: 10 },
      returnDate: { pattern: patterns.date, maxLength: 10 },
    },
    providerErrorMessage: "Explore search failed",
    run: (params) =>
      exploreDestinations({
        departureId: params.from,
        outboundDate: params.outboundDate || undefined,
        returnDate: params.returnDate || undefined,
      }),
  });
}
