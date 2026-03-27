import { searchPlaces } from "../../../../lib/serp/engines/places";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:places",
    routeLabel: "places",
    rules: {
      query: { required: true, maxLength: 300 },
    },
    providerErrorMessage: "Place search failed",
    run: (params) =>
      searchPlaces({
        query: params.query,
      }),
  });
}
