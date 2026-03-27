import { searchFlights } from "../../../../lib/serp/engines/flights";
import { runSearchRoute, patterns } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:flights",
    routeLabel: "flights",
    rules: {
      from: { required: true, maxLength: 64, pattern: patterns.flightLocation },
      to: { required: true, maxLength: 64, pattern: patterns.flightLocation },
      date: { pattern: patterns.date, maxLength: 10 },
    },
    providerErrorMessage: "Flight search failed",
    run: (params) =>
      searchFlights({
        departureId: params.from,
        arrivalId: params.to,
        outboundDate: params.date,
      }),
  });
}
