import { searchRestaurants } from "../../../../lib/serp/engines/restaurants";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:restaurants",
    routeLabel: "restaurants",
    rules: {
      destination: { required: true, maxLength: 200 },
    },
    providerErrorMessage: "Restaurant search failed",
    run: (params) =>
      searchRestaurants({
        destination: params.destination,
      }),
  });
}
