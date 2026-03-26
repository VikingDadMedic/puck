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
  const data = await serpFetch<any>("tripadvisor", {
    q: `Restaurants in ${params.destination}`,
    ssrc: "r",
    limit: 20,
  });

  const results = data.data || [];
  return results.slice(0, 20).map((r: any, i: number) => ({
    id: `restaurant_${i}_${(r.title || "").replace(/\s+/g, "_").slice(0, 20)}`,
    name: r.title || "Unknown Restaurant",
    cuisine: r.category || "",
    rating: r.rating ?? 0,
    reviewCount: r.reviews ?? 0,
    priceLevel: r.price_level || "",
    imageUrl: r.thumbnail || "",
    link: r.link || "",
  }));
}
