import { searchGoogleLight } from "../../../../lib/serp/engines/light-search";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:google-light",
    routeLabel: "google-light",
    rules: {
      q: { required: true, maxLength: 300 },
    },
    providerErrorMessage: "Google Light search failed",
    run: (params) =>
      searchGoogleLight({
        q: params.q,
      }),
  });
}
