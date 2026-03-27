import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type PlaceSearchRow = {
  name?: string;
  address?: string;
  rating?: number;
  type?: string;
  imageUrl?: string;
};

export const placePickerField: ExternalField<Record<string, unknown> | null> = {
  type: "external",
  label: "Search Places",
  placeholder: "Search places...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/places?query=${encodeURIComponent(query)}`,
      { headers: travelStudioApiHeaders() }
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as PlaceSearchRow | null;
    return {
      title: row?.name ?? "",
      description: `${row?.rating ? row.rating + "★" : ""}${
        row?.type ? " · " + row.type : ""
      }${row?.address ? " · " + row.address : ""}`,
    };
  },
  mapProp: (item) => {
    const row = item as PlaceSearchRow | null;
    return {
      name: row?.name,
      location: row?.address,
      imageUrl: row?.imageUrl,
    };
  },
  getItemSummary: (item) => {
    const row = item as PlaceSearchRow | null;
    return row?.name?.trim() || "Place";
  },
};
