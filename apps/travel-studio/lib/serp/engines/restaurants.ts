import { serpFetch } from "../client";

export type RestaurantResult = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  imageUrl: string;
  link: string;
};

type RestaurantsParams = {
  destination: string;
};

export async function searchRestaurants(
  params: RestaurantsParams
): Promise<RestaurantResult[]> {
  const data = await serpFetch<Record<string, unknown>>("tripadvisor", {
    q: `Restaurants in ${params.destination}`,
    ssrc: "r",
    limit: 20,
  });

  const results = (data.data as Record<string, unknown>[]) || [];
  return results.slice(0, 20).map((r, i) => ({
    id: `restaurant_${i}_${String(r.title ?? "")
      .replace(/\s+/g, "_")
      .slice(0, 20)}`,
    name: String(r.title ?? "Unknown Restaurant"),
    cuisine: String(r.category ?? ""),
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.reviews ?? 0),
    priceLevel: String(r.price_level ?? ""),
    imageUrl: String(r.thumbnail ?? ""),
    link: String(r.link ?? ""),
  }));
}
