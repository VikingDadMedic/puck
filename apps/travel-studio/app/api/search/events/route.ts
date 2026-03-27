import { searchGoogleEvents } from "../../../../lib/serp/engines/events";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:events",
    routeLabel: "events",
    rules: {
      q: { required: true, maxLength: 200 },
      location: { maxLength: 200 },
    },
    providerErrorMessage: "Events search failed",
    run: (params) =>
      searchGoogleEvents({
        q: params.q,
        location: params.location || undefined,
      }),
  });
}
