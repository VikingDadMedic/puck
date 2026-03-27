import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type RestaurantSearchRow = {
  name?: string;
  cuisine?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
  imageUrl?: string;
};

export const restaurantPickerField: ExternalField<Record<
  string,
  unknown
> | null> = {
  type: "external",
  label: "Search Restaurants",
  placeholder: "Search by destination...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/restaurants?destination=${encodeURIComponent(query)}`,
      { headers: travelStudioApiHeaders() }
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as RestaurantSearchRow | null;
    return {
      title: row?.name ?? "",
      description: `${row?.rating ? row.rating + "★" : ""}${
        row?.reviewCount ? " · " + row.reviewCount + " reviews" : ""
      }${row?.cuisine ? " · " + row.cuisine : ""}${
        row?.priceLevel ? " · " + row.priceLevel : ""
      }`,
    };
  },
  mapProp: (item) => {
    const row = item as RestaurantSearchRow | null;
    return {
      name: row?.name,
      cuisine: row?.cuisine,
      rating: row?.rating,
      imageUrl: row?.imageUrl,
    };
  },
  getItemSummary: (item) => {
    const row = item as RestaurantSearchRow | null;
    return row?.name?.trim() || "Restaurant";
  },
};
