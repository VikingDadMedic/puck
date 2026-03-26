import { getCache, setCache } from "./cache";

const SERP_API_BASE = "https://serpapi.com/search";

export type SerpEngine =
  | "google_hotels"
  | "google_flights"
  | "google_travel_explore"
  | "google_events"
  | "google_maps"
  | "google_maps_photos"
  | "tripadvisor";

export async function serpFetch<T = Record<string, unknown>>(
  engine: SerpEngine,
  params: Record<string, string | number | boolean>
): Promise<T> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    throw new Error("SERP_API_KEY is not set in environment variables");
  }

  const cacheKey = JSON.stringify({ engine, ...params });
  const cached = getCache<T>(cacheKey);
  if (cached) return cached;

  const searchParams = new URLSearchParams({
    engine,
    api_key: apiKey,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${SERP_API_BASE}?${searchParams.toString()}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`SerpAPI ${engine} error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as T;
  setCache(cacheKey, data);
  return data;
}
