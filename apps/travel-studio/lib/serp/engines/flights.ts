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
  const data = await serpFetch<Record<string, unknown>>("google_flights", {
    departure_id: params.departureId,
    arrival_id: params.arrivalId,
    outbound_date: params.outboundDate,
    return_date: params.returnDate || "",
    type: params.returnDate ? "1" : "2",
    currency: params.currency ?? "USD",
    gl: "us",
    hl: "en",
  });

  const flights = [
    ...((data.best_flights as Record<string, unknown>[]) || []),
    ...((data.other_flights as Record<string, unknown>[]) || []),
  ];

  return flights.slice(0, 20).map((f, i) => {
    const legs = f.flights as Record<string, unknown>[] | undefined;
    const leg = legs?.[0] ?? ({} as Record<string, unknown>);
    const depAirport = leg.departure_airport as
      | Record<string, unknown>
      | undefined;
    const arrAirport = leg.arrival_airport as
      | Record<string, unknown>
      | undefined;
    return {
      id: `flight_${i}_${String(leg.flight_number ?? "")}`,
      airline: String(leg.airline ?? "Unknown"),
      airlineLogo: String(leg.airline_logo ?? ""),
      flightNumber: String(leg.flight_number ?? ""),
      departure: String(depAirport?.id ?? params.departureId),
      arrival: String(arrAirport?.id ?? params.arrivalId),
      departureTime: String(depAirport?.time ?? ""),
      arrivalTime: String(arrAirport?.time ?? ""),
      duration: `${Number(f.total_duration ?? 0)} min`,
      stops: (legs?.length ?? 1) - 1,
      price: Number(f.price ?? 0),
      currency: params.currency ?? "USD",
    };
  });
}
