import { getCache, getStaleFallbackCacheWithMeta, setCache } from "./cache";

const SERP_API_BASE = "https://serpapi.com/search";

export type SerpEngine =
  | "google_hotels"
  | "google_flights"
  | "google_travel_explore"
  | "google_events"
  | "google_maps"
  | "google_maps_photos"
  | "google_maps_reviews"
  | "google_light"
  | "yelp"
  | "open_table_reviews"
  | "google_finance"
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

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      throw new Error(`SerpAPI ${engine} error ${response.status}: ${text}`);
    }

    const data = (await response.json()) as T;
    if (
      data &&
      typeof data === "object" &&
      "error" in (data as Record<string, unknown>) &&
      typeof (data as Record<string, unknown>).error === "string"
    ) {
      throw new Error(
        `SerpAPI ${engine} error: ${(data as Record<string, unknown>).error}`
      );
    }
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    const stale = getStaleFallbackCacheWithMeta<T>(cacheKey);
    if (stale) {
      console.warn(
        `[serp] stale cache fallback for ${engine} (ageMs=${stale.ageMs}):`,
        err instanceof Error ? err.message : err
      );
      return stale.data;
    }
    throw err;
  }
}
