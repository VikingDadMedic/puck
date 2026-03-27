import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type EventSearchRow = {
  title?: string;
  description?: string;
  date?: string;
  venue?: string;
  thumbnail?: string;
};

export const eventPickerField: ExternalField<Record<string, unknown> | null> = {
  type: "external",
  label: "Search Events",
  placeholder: "Search events...",
  showSearch: true,
  filterFields: {
    location: { type: "text", label: "Location" },
  },
  fetchList: async ({ query, filters }) => {
    if (!query) return [];
    const params = new URLSearchParams({ q: query });
    if (filters?.location) params.set("location", String(filters.location));
    const res = await fetch(`/api/search/events?${params}`, {
      headers: travelStudioApiHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as EventSearchRow | null;
    return {
      title: row?.title ?? "",
      description: `${row?.date ?? ""}${row?.venue ? " · " + row.venue : ""}`,
    };
  },
  mapProp: (item) => {
    const row = item as EventSearchRow | null;
    return {
      name: row?.title,
      description: row?.description,
      imageUrl: row?.thumbnail,
    };
  },
  getItemSummary: (item) => {
    const row = item as EventSearchRow | null;
    return row?.title?.trim() || "Event";
  },
};
