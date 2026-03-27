import { serpFetch } from "../client";

export type EventSearchResult = {
  id: string;
  title: string;
  description: string;
  date?: string;
  venue?: string;
  link?: string;
  thumbnail?: string;
};

export async function searchGoogleEvents(params: {
  q: string;
  location?: string;
}): Promise<EventSearchResult[]> {
  const data = await serpFetch<Record<string, unknown>>("google_events", {
    q: params.q,
    ...(params.location ? { location: params.location } : {}),
  });

  const results = (data.events_results as Record<string, unknown>[]) || [];
  return results.slice(0, 20).map((e, i) => ({
    id: `event_${i}_${String(e.title ?? i)}`,
    title: String(e.title ?? "Event"),
    description: String(e.description ?? e.snippet ?? ""),
    date: typeof e.date === "string" ? e.date : undefined,
    venue: typeof e.address === "string" ? e.address : undefined,
    link: typeof e.link === "string" ? e.link : undefined,
    thumbnail: typeof e.thumbnail === "string" ? e.thumbnail : undefined,
  }));
}
