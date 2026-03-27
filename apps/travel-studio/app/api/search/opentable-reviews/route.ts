import { searchOpenTableReviews } from "../../../../lib/serp/engines/opentable-reviews";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:opentable-reviews",
    routeLabel: "opentable-reviews",
    rules: {
      rid: { required: true, maxLength: 64 },
    },
    providerErrorMessage: "OpenTable reviews search failed",
    run: (params) =>
      searchOpenTableReviews({
        rid: params.rid,
      }),
  });
}
