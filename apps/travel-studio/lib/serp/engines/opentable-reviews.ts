import { serpFetch } from "../client";

export type OpenTableReviewResult = {
  id: string;
  title: string;
  rating?: number;
  snippet: string;
  date?: string;
};

export async function searchOpenTableReviews(params: {
  rid: string;
}): Promise<OpenTableReviewResult[]> {
  const data = await serpFetch<Record<string, unknown>>("open_table_reviews", {
    rid: params.rid,
  });

  const reviews = (data.reviews as Record<string, unknown>[]) || [];
  return reviews.slice(0, 20).map((r, i) => ({
    id: `ot_${i}`,
    title: String(r.user_name ?? r.reviewer ?? `Diner ${i + 1}`),
    rating: typeof r.rating === "number" ? r.rating : undefined,
    snippet: String(r.review_text ?? r.comment ?? ""),
    date: typeof r.date === "string" ? r.date : undefined,
  }));
}
