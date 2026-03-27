import { searchGoogleMapsReviews } from "../../../../lib/serp/engines/maps-reviews";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:maps-reviews",
    routeLabel: "maps-reviews",
    rules: {
      data_id: { maxLength: 200 },
      place_id: { maxLength: 200 },
    },
    validateExtra: (params) =>
      !params.data_id && !params.place_id
        ? "Missing required parameter: data_id or place_id"
        : null,
    providerErrorMessage: "Maps reviews search failed",
    run: (params) =>
      searchGoogleMapsReviews({
        dataId: params.data_id || undefined,
        placeId: params.place_id || undefined,
      }),
  });
}
