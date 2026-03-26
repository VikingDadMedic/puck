import { serpFetch } from "../client";

export type FlightResult = {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
};

type FlightsParams = {
  departureId: string;
  arrivalId: string;
  outboundDate: string;
  returnDate?: string;
  currency?: string;
};

export async function searchFlights(
  params: FlightsParams
): Promise<FlightResult[]> {
  const data = await serpFetch<any>("google_flights", {
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate || "",
    type: params.returnDate ? "1" : "2",
    currency: params.currency ?? "USD",
    gl: "us",
    hl: "en",
  });

  const flights = [...(data.best_flights || []), ...(data.other_flights || [])];

  return flights.slice(0, 20).map((f: any, i: number) => {
    const leg = f.flights?.[0] || {};
    return {
      id: `flight_${i}_${leg.flight_number || ""}`,
      airline: leg.airline || "Unknown",
      airlineLogo: leg.airline_logo || "",
      flightNumber: leg.flight_number || "",
      departure: leg.departure_airport?.id || params.departureId,
      arrival: leg.arrival_airport?.id || params.arrivalId,
      departureTime: leg.departure_airport?.time || "",
      arrivalTime: leg.arrival_airport?.time || "",
      duration: `${f.total_duration || 0} min`,
      stops: (f.flights?.length || 1) - 1,
      price: f.price ?? 0,
      currency: params.currency ?? "USD",
    };
  });
}
