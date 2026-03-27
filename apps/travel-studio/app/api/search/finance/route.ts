import { searchGoogleFinance } from "../../../../lib/serp/engines/finance";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:finance",
    routeLabel: "finance",
    rules: {
      q: { required: true, maxLength: 40 },
    },
    providerErrorMessage: "Finance lookup failed",
    run: (params) =>
      searchGoogleFinance({
        q: params.q,
      }),
  });
}
