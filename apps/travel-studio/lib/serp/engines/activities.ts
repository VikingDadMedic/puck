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
  const data = await serpFetch<any>("tripadvisor", {
    q: `Things to do in ${params.destination}`,
    ssrc: "A",
    limit: 20,
  });

  const results = data.data || [];
  return results.slice(0, 20).map((r: any, i: number) => ({
    id: `activity_${i}_${(r.title || "").replace(/\s+/g, "_").slice(0, 20)}`,
    name: r.title || "Unknown Activity",
    description: r.description || "",
    rating: r.rating ?? 0,
    reviewCount: r.reviews ?? 0,
    imageUrl: r.thumbnail || "",
    link: r.link || "",
    category: r.category || "Activity",
  }));
}
