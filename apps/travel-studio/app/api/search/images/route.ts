import { searchImages } from "../../../../lib/serp/engines/images";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:images",
    routeLabel: "images",
    rules: {
      query: { required: true, maxLength: 300 },
    },
    providerErrorMessage: "Image search failed",
    run: (params) =>
      searchImages({
        query: params.query,
      }),
  });
}
