import type { ExternalField } from "@/core";
import { type ReactElement } from "react";

export const imagePickerField: ExternalField = {
  type: "external",
  label: "Search Images",
  placeholder: "Search photos...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/images?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => ({
    title: item.alt || "Photo",
    description: `${item.photographer} · ${item.source} · ${item.width}×${item.height}`,
  }),
  mapProp: (item) => item.url || "",
  getItemSummary: (item) => {
    if (typeof item === "string" && item) return "Image selected";
    return "No image";
  },
};
