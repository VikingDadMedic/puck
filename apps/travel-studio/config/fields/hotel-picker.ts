import type { ExternalField } from "@/core";

export const hotelPickerField: ExternalField = {
  type: "external",
  label: "Search Hotels",
  placeholder: "Search by destination...",
  showSearch: true,
  filterFields: {
    checkIn: { type: "text", label: "Check-in (YYYY-MM-DD)" },
    checkOut: { type: "text", label: "Check-out (YYYY-MM-DD)" },
  },
  fetchList: async ({ query, filters }) => {
    if (!query) return [];
    const params = new URLSearchParams({ destination: query });
    if (filters?.checkIn) params.set("checkIn", String(filters.checkIn));
    if (filters?.checkOut) params.set("checkOut", String(filters.checkOut));
    const res = await fetch(`/api/search/hotels?${params}`);
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => ({
    title: item.name,
    description: `${item.rating ? item.rating + "★ · " : ""}${item.location}${
      item.pricePerNight !== "N/A" ? " · " + item.pricePerNight + "/night" : ""
    }`,
  }),
  mapProp: (item) => ({
    name: item.name,
    location: item.location,
    rating: item.rating,
    imageUrl: item.imageUrl,
    pricePerNight: item.pricePerNight,
  }),
  getItemSummary: (item) => item?.name || "Hotel",
};
