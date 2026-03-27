import { serpFetch } from "../client";

export type MapsReviewResult = {
  id: string;
  title: string;
  rating?: number;
  snippet: string;
  date?: string;
};

export async function searchGoogleMapsReviews(params: {
  dataId?: string;
  placeId?: string;
}): Promise<MapsReviewResult[]> {
  const serpParams: Record<string, string> = {};
  if (params.dataId) serpParams.data_id = params.dataId;
  if (params.placeId) serpParams.place_id = params.placeId;

  const data = await serpFetch<Record<string, unknown>>(
    "google_maps_reviews",
    serpParams
  );

  const reviews = (data.reviews as Record<string, unknown>[]) || [];
  return reviews.slice(0, 20).map((r, i) => {
    const user = r.user;
    const userLabel =
      typeof user === "object" && user && "name" in user
        ? String((user as { name?: string }).name)
        : typeof user === "string"
        ? user
        : `Review ${i + 1}`;
    return {
      id: `greview_${i}`,
      title: userLabel,
      rating: typeof r.rating === "number" ? r.rating : undefined,
      snippet: String(r.snippet ?? ""),
      date: typeof r.iso_date === "string" ? r.iso_date : undefined,
    };
  });
}
