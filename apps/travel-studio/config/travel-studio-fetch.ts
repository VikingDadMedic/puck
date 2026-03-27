/**
 * Headers for browser calls to travel-studio API routes when
 * TRAVEL_STUDIO_API_KEY is enabled server-side.
 */
export function travelStudioApiHeaders(): Record<string, string> {
  const key =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TRAVEL_STUDIO_API_KEY;
  if (key) return { "x-api-key": key };
  return {};
}
