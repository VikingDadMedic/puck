import { serpFetch } from "../client";

export type ActivityResult = {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  link: string;
  category: string;
};

type ActivitiesParams = {
  destination: string;
};

export async function searchActivities(
  params: ActivitiesParams
): Promise<ActivityResult[]> {
  const data = await serpFetch<Record<string, unknown>>("tripadvisor", {
    q: `Things to do in ${params.destination}`,
    ssrc: "A",
    limit: 20,
  });

  const results = (data.data as Record<string, unknown>[]) || [];
  return results.slice(0, 20).map((r, i) => ({
    id: `activity_${i}_${String(r.title ?? "")
      .replace(/\s+/g, "_")
      .slice(0, 20)}`,
    name: String(r.title ?? "Unknown Activity"),
    description: String(r.description ?? ""),
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.reviews ?? 0),
    imageUrl: String(r.thumbnail ?? ""),
    link: String(r.link ?? ""),
    category: String(r.category ?? "Activity"),
  }));
}
