import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type HotelSearchRow = {
  name?: string;
  location?: string;
  rating?: number;
  stars?: number;
  imageUrl?: string;
  pricePerNight?: string;
  currency?: string;
};

export const hotelPickerField: ExternalField<Record<string, unknown> | null> = {
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
    const res = await fetch(`/api/search/hotels?${params}`, {
      headers: travelStudioApiHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as HotelSearchRow | null;
    return {
      title: row?.name ?? "",
      description: `${row?.rating ? row.rating + "★ · " : ""}${
        row?.location ?? ""
      }${
        row?.pricePerNight !== "N/A" && row?.pricePerNight
          ? " · " + row.pricePerNight + "/night"
          : ""
      }`,
    };
  },
  mapProp: (item) => {
    const row = item as HotelSearchRow | null;
    return {
      name: row?.name,
      location: row?.location,
      rating: row?.rating,
      stars: row?.stars,
      imageUrl: row?.imageUrl,
      pricePerNight: row?.pricePerNight,
      currency: row?.currency ?? "USD",
    };
  },
  getItemSummary: (item) => {
    const row = item as HotelSearchRow | null;
    return row?.name?.trim() || "Hotel";
  },
};
