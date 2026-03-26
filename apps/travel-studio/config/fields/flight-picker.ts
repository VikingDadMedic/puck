import type { ExternalField } from "@/core";

export const flightPickerField: ExternalField = {
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
    const res = await fetch(`/api/search/flights?${params}`);
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => ({
    title: `${item.airline} ${item.flightNumber}`,
    description: `${item.departure} → ${item.arrival} · ${item.departureTime}–${
      item.arrivalTime
    } · ${item.stops === 0 ? "Nonstop" : item.stops + " stop(s)"} · $${
      item.price
    }`,
  }),
  mapProp: (item) => ({
    carrier: item.airline,
    flightNumber: item.flightNumber,
    departure: item.departure,
    arrival: item.arrival,
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    price: item.price,
  }),
  getItemSummary: (item) =>
    item?.carrier ? `${item.carrier} ${item.flightNumber || ""}` : "Flight",
};
