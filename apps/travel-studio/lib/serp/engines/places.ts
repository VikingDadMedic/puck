import { serpFetch } from "../client";

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  type: string;
  imageUrl: string;
  gps: { lat: number; lng: number } | null;
  phone: string;
  website: string;
};

type PlacesParams = {
  query: string;
};

export async function searchPlaces(
  params: PlacesParams
): Promise<PlaceResult[]> {
  const data = await serpFetch<any>("google_maps", {
    q: params.query,
    type: "search",
    hl: "en",
  });

  const results = data.local_results || [];
  return results.slice(0, 20).map((p: any, i: number) => ({
    id: p.place_id || `place_${i}`,
    name: p.title || "Unknown Place",
    address: p.address || "",
    rating: p.rating ?? 0,
    reviewCount: p.reviews ?? 0,
    type: p.type || "",
    imageUrl: p.thumbnail || "",
    gps: p.gps_coordinates
      ? { lat: p.gps_coordinates.latitude, lng: p.gps_coordinates.longitude }
      : null,
    phone: p.phone || "",
    website: p.website || "",
  }));
}
