import { serpFetch } from "../client";

export type YelpResult = {
  id: string;
  title: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  link?: string;
};

export async function searchYelp(params: {
  findDesc?: string;
  findLoc: string;
}): Promise<YelpResult[]> {
  const data = await serpFetch<Record<string, unknown>>("yelp", {
    find_loc: params.findLoc,
    ...(params.findDesc ? { find_desc: params.findDesc } : {}),
  });

  const organic = (data.organic_results as Record<string, unknown>[]) || [];
  return organic.slice(0, 20).map((r, i) => ({
    id: `yelp_${i}_${String(r.title ?? i)}`,
    title: String(r.title ?? "Place"),
    description: String(r.snippet ?? r.reviews ?? ""),
    rating: typeof r.rating === "number" ? r.rating : undefined,
    reviewCount:
      typeof r.reviews === "number"
        ? r.reviews
        : typeof r.review_count === "number"
        ? r.review_count
        : undefined,
    link: typeof r.link === "string" ? r.link : undefined,
  }));
}
