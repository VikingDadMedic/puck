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
  const data = await serpFetch<any>("google_travel_explore", {
    departure_id: params.departureId,
    outbound_date: params.outboundDate || "",
    return_date: params.returnDate || "",
    currency: params.currency ?? "USD",
    hl: "en",
  });

  const destinations = data.destinations || [];
  return destinations.slice(0, 20).map((d: any, i: number) => ({
    id: `dest_${i}_${(d.title || "").replace(/\s+/g, "_").slice(0, 20)}`,
    destination: d.title || "Unknown",
    country: d.country || "",
    flightPrice: d.price || "",
    currency: params.currency ?? "USD",
    imageUrl: d.image || d.thumbnail || "",
    description: d.description || "",
  }));
}
