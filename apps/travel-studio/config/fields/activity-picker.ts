import type { ExternalField } from "@/core";

export const activityPickerField: ExternalField = {
  type: "external",
  label: "Search Activities",
  placeholder: "Search by destination...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/activities?destination=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    return res.json();
  },
  mapRow: (item) => ({
    title: item.name,
    description: `${item.rating ? item.rating + "★" : ""}${
      item.reviewCount ? " · " + item.reviewCount + " reviews" : ""
    } · ${item.category}`,
  }),
  mapProp: (item) => ({
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
  }),
  getItemSummary: (item) => item?.name || "Activity",
};
