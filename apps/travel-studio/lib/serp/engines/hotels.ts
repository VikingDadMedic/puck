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
  const data = await serpFetch<Record<string, unknown>>("google_hotels", {
    q: params.destination,
    check_in_date: params.checkIn,
    check_out_date: params.checkOut,
    adults: params.adults ?? 2,
    currency: params.currency ?? "USD",
    gl: "us",
    hl: "en",
  });

  const properties = (data.properties as Record<string, unknown>[]) || [];
  return properties.slice(0, 20).map((p, i) => {
    const ratePerNight = p.rate_per_night as
      | Record<string, unknown>
      | undefined;
    const totalRate = p.total_rate as Record<string, unknown> | undefined;
    const images = p.images as Record<string, unknown>[] | undefined;
    return {
      id: `hotel_${i}_${String(p.name ?? "")
        .replace(/\s+/g, "_")
        .slice(0, 20)}`,
      name: String(p.name ?? "Unknown Hotel"),
      location: String(p.description ?? p.neighborhood ?? ""),
      rating: Number(p.overall_rating ?? 0),
      stars: Number(p.hotel_class ?? 0),
      pricePerNight: String(ratePerNight?.lowest ?? totalRate?.lowest ?? "N/A"),
      currency: params.currency ?? "USD",
      imageUrl: String(
        images?.[0]?.thumbnail ?? images?.[0]?.original_image ?? ""
      ),
      bookingUrl: String(p.link ?? ""),
      amenities: (p.amenities as string[]) || [],
    };
  });
}
