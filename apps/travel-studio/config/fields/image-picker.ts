import type { ExternalField } from "@/core";
import { travelStudioApiHeaders } from "../travel-studio-fetch";

type ImageSearchRow = {
  alt?: string;
  photographer?: string;
  source?: string;
  width?: number;
  height?: number;
  url?: string;
};

export const imagePickerField: ExternalField<string> = {
  type: "external",
  label: "Search Images",
  placeholder: "Search photos...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/images?query=${encodeURIComponent(query)}`,
      { headers: travelStudioApiHeaders() }
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => {
    const row = item as ImageSearchRow;
    return {
      title: row.alt || "Photo",
      description: `${row.photographer ?? ""} · ${row.source ?? ""} · ${
        row.width ?? ""
      }×${row.height ?? ""}`,
    };
  },
  mapProp: (item) => {
    const row = item as ImageSearchRow;
    return row.url || "";
  },
  getItemSummary: (item) => (item ? "Image selected" : "No image"),
};
