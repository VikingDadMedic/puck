import { searchActivities } from "../../../../lib/serp/engines/activities";
import { runSearchRoute } from "../../../../lib/api";

export async function GET(request: Request) {
  return runSearchRoute(request, {
    routePrefix: "search:activities",
    routeLabel: "activities",
    rules: {
      destination: { required: true, maxLength: 200 },
    },
    providerErrorMessage: "Activity search failed",
    run: (params) =>
      searchActivities({
        destination: params.destination,
      }),
  });
}
