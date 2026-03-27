import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type ActivitySearchRow = {
  name?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
};

export const activityPickerField: ExternalField<Record<
  string,
  unknown
> | null> = {
  type: "external",
  label: "Search Activities",
  placeholder: "Search by destination...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/activities?destination=${encodeURIComponent(query)}`,
      { headers: travelStudioApiHeaders() }
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as ActivitySearchRow | null;
    return {
      title: row?.name ?? "",
      description: `${row?.rating ? row.rating + "★" : ""}${
        row?.reviewCount ? " · " + row.reviewCount + " reviews" : ""
      } · ${row?.category ?? ""}`,
    };
  },
  mapProp: (item) => {
    const row = item as ActivitySearchRow | null;
    return {
      name: row?.name,
      description: row?.description,
      imageUrl: row?.imageUrl,
    };
  },
  getItemSummary: (item) => {
    const row = item as ActivitySearchRow | null;
    return row?.name?.trim() || "Activity";
  },
};
