import { serpFetch } from "../client";

export type HotelResult = {
  id: string;
  name: string;
  location: string;
  rating: number;
  stars: number;
  pricePerNight: string;
  currency: string;
  imageUrl: string;
  bookingUrl: string;
  amenities: string[];
};

type HotelsParams = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  currency?: string;
};

export async function searchHotels(
  params: HotelsParams
): Promise<HotelResult[]> {
  const data = await serpFetch<any>("google_hotels", {
    q: params.destination,
    check_in_date: params.checkIn,
    check_out_date: params.checkOut,
    adults: params.adults ?? 2,
    currency: params.currency ?? "USD",
    gl: "us",
    hl: "en",
  });

  const properties = data.properties || [];
  return properties.slice(0, 20).map((p: any, i: number) => ({
    id: `hotel_${i}_${(p.name || "").replace(/\s+/g, "_").slice(0, 20)}`,
    name: p.name || "Unknown Hotel",
    location: p.description || p.neighborhood || "",
    rating: p.overall_rating ?? 0,
    stars: p.hotel_class ?? 0,
    pricePerNight: String(
      p.rate_per_night?.lowest ?? p.total_rate?.lowest ?? "N/A"
    ),
    currency: params.currency ?? "USD",
    imageUrl: p.images?.[0]?.thumbnail || p.images?.[0]?.original_image || "",
    bookingUrl: p.link || "",
    amenities: p.amenities || [],
  }));
}
