import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type FlightSearchRow = {
  airline?: string;
  airlineLogo?: string;
  carrier?: string;
  flightNumber?: string;
  departure?: string;
  arrival?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  price?: number;
  currency?: string;
};

export const flightPickerField: ExternalField<Record<string, unknown> | null> =
  {
    type: "external",
    label: "Search Flights",
    placeholder: "Search flights...",
    showSearch: false,
    filterFields: {
      from: { type: "text", label: "From (airport code)" },
      to: { type: "text", label: "To (airport code)" },
      date: { type: "text", label: "Date (YYYY-MM-DD)" },
    },
    fetchList: async ({ filters }) => {
      if (!filters?.from || !filters?.to) return [];
      const params = new URLSearchParams({
        from: String(filters.from),
        to: String(filters.to),
      });
      if (filters?.date) params.set("date", String(filters.date));
      const res = await fetch(`/api/search/flights?${params}`, {
        headers: travelStudioApiHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },
    mapRow: (item) => {
      const row = item as FlightSearchRow | null;
      return {
        title: `${row?.airline ?? ""} ${row?.flightNumber ?? ""}`,
        description: `${row?.departure ?? ""} → ${row?.arrival ?? ""} · ${
          row?.departureTime ?? ""
        }–${row?.arrivalTime ?? ""} · ${
          row?.stops === 0 ? "Nonstop" : (row?.stops ?? "") + " stop(s)"
        } · $${row?.price ?? ""}`,
      };
    },
    mapProp: (item) => {
      const row = item as FlightSearchRow | null;
      return {
        carrier: row?.airline,
        airlineLogo: row?.airlineLogo,
        flightNumber: row?.flightNumber,
        departure: row?.departure,
        arrival: row?.arrival,
        departureTime: row?.departureTime,
        arrivalTime: row?.arrivalTime,
        duration: row?.duration,
        stops: row?.stops,
        price: row?.price,
        currency: row?.currency ?? "USD",
      };
    },
    getItemSummary: (item) => {
      const row = item as FlightSearchRow | null;
      if (row?.airline)
        return `${row.airline} ${row.flightNumber ?? ""}`.trim();
      if (row?.carrier)
        return `${row.carrier} ${row.flightNumber ?? ""}`.trim();
      return "Flight";
    },
  };
