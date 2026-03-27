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
  const data = await serpFetch<Record<string, unknown>>("google_maps", {
    q: params.query,
    type: "search",
    hl: "en",
  });

  const results = (data.local_results as Record<string, unknown>[]) || [];
  return results.slice(0, 20).map((p, i) => {
    const gps = p.gps_coordinates as Record<string, unknown> | undefined;
    return {
      id: String(p.place_id ?? `place_${i}`),
      name: String(p.title ?? "Unknown Place"),
      address: String(p.address ?? ""),
      rating: Number(p.rating ?? 0),
      reviewCount: Number(p.reviews ?? 0),
      type: String(p.type ?? ""),
      imageUrl: String(p.thumbnail ?? ""),
      gps: gps
        ? { lat: Number(gps.latitude ?? 0), lng: Number(gps.longitude ?? 0) }
        : null,
      phone: String(p.phone ?? ""),
      website: String(p.website ?? ""),
    };
  });
}
