import { searchYelp } from "../../../../lib/serp/engines/yelp";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:yelp",
    routeLabel: "yelp",
    rules: {
      find_loc: { required: true, maxLength: 200 },
      find_desc: { maxLength: 200 },
    },
    providerErrorMessage: "Yelp search failed",
    run: (params) =>
      searchYelp({
        findLoc: params.find_loc,
        findDesc: params.find_desc || undefined,
      }),
  });
}
