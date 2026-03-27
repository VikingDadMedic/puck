import { serpFetch } from "../client";

export type DestinationResult = {
  id: string;
  destination: string;
  country: string;
  flightPrice: string;
  currency: string;
  imageUrl: string;
  description: string;
};

type ExploreParams = {
  departureId: string;
  outboundDate?: string;
  returnDate?: string;
  currency?: string;
};

export async function exploreDestinations(
  params: ExploreParams
): Promise<DestinationResult[]> {
  const data = await serpFetch<Record<string, unknown>>(
    "google_travel_explore",
    {
      departure_id: params.departureId,
      outbound_date: params.outboundDate || "",
      return_date: params.returnDate || "",
      currency: params.currency ?? "USD",
      hl: "en",
    }
  );

  const destinations = (data.destinations as Record<string, unknown>[]) || [];
  return destinations.slice(0, 20).map((d, i) => ({
    id: `dest_${i}_${String(d.title ?? "")
      .replace(/\s+/g, "_")
      .slice(0, 20)}`,
    destination: String(d.title ?? "Unknown"),
    country: String(d.country ?? ""),
    flightPrice: String(d.price ?? ""),
    currency: params.currency ?? "USD",
    imageUrl: String(d.image ?? d.thumbnail ?? ""),
    description: String(d.description ?? ""),
  }));
}
