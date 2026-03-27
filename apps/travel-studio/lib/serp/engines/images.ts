import { getCache, getStaleFallbackCacheWithMeta, setCache } from "../cache";

export type ImageResult = {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  photographer: string;
  source: "pexels" | "unsplash";
  width: number;
  height: number;
};

type ImagesParams = {
  query: string;
  perPage?: number;
};

function reasonToMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

async function searchPexels(
  query: string,
  perPage: number
): Promise<ImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=${perPage}`,
    { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(10000) }
  );
  if (!res.ok) {
    throw new Error(`Pexels request failed: ${res.status}`);
  }
  const data = (await res.json()) as { photos?: Record<string, unknown>[] };
  return (data.photos || []).map((p) => ({
    id: `pexels_${p.id}`,
    url:
      (p.src as { large?: string; original?: string } | undefined)?.large ||
      (p.src as { large?: string; original?: string } | undefined)?.original ||
      "",
    thumbnailUrl:
      (p.src as { small?: string; tiny?: string } | undefined)?.small ||
      (p.src as { small?: string; tiny?: string } | undefined)?.tiny ||
      "",
    alt: (p.alt as string | undefined) || query,
    photographer: (p.photographer as string | undefined) || "",
    source: "pexels" as const,
    width: (p.width as number | undefined) || 0,
    height: (p.height as number | undefined) || 0,
  }));
}

async function searchUnsplash(
  query: string,
  perPage: number
): Promise<ImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${perPage}`,
    {
      headers: { Authorization: `Client-ID ${accessKey}` },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) {
    throw new Error(`Unsplash request failed: ${res.status}`);
  }
  const data = (await res.json()) as { results?: Record<string, unknown>[] };
  return (data.results || []).map((p) => ({
    id: `unsplash_${p.id}`,
    url:
      (p.urls as { regular?: string; full?: string } | undefined)?.regular ||
      (p.urls as { regular?: string; full?: string } | undefined)?.full ||
      "",
    thumbnailUrl:
      (p.urls as { thumb?: string; small?: string } | undefined)?.thumb ||
      (p.urls as { thumb?: string; small?: string } | undefined)?.small ||
      "",
    alt:
      (p.alt_description as string | undefined) ||
      (p.description as string | undefined) ||
      query,
    photographer:
      ((p.user as { name?: string } | undefined)?.name as string | undefined) ||
      "",
    source: "unsplash" as const,
    width: (p.width as number | undefined) || 0,
    height: (p.height as number | undefined) || 0,
  }));
}

export async function searchImages(
  params: ImagesParams
): Promise<ImageResult[]> {
  const perPage = params.perPage ?? 10;
  const providersConfigured = Boolean(
    process.env.PEXELS_API_KEY || process.env.UNSPLASH_ACCESS_KEY
  );
  const cacheKey = JSON.stringify({
    kind: "image_search",
    q: params.query,
    perPage,
  });

  const fresh = getCache<ImageResult[]>(cacheKey);
  if (fresh) return fresh;

  try {
    const [pexelsResult, unsplashResult] = await Promise.allSettled([
      searchPexels(params.query, perPage),
      searchUnsplash(params.query, perPage),
    ]);
    const errors: string[] = [];

    const pexels =
      pexelsResult.status === "fulfilled"
        ? pexelsResult.value
        : (errors.push(reasonToMessage(pexelsResult.reason)), []);
    const unsplash =
      unsplashResult.status === "fulfilled"
        ? unsplashResult.value
        : (errors.push(reasonToMessage(unsplashResult.reason)), []);

    const combined: ImageResult[] = [];
    const maxLen = Math.max(pexels.length, unsplash.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < pexels.length) combined.push(pexels[i]);
      if (i < unsplash.length) combined.push(unsplash[i]);
    }

    if (combined.length === 0 && errors.length > 0 && providersConfigured) {
      throw new Error(`Image providers failed: ${errors.join(" | ")}`);
    }

    setCache(cacheKey, combined);
    return combined;
  } catch (err) {
    const stale = getStaleFallbackCacheWithMeta<ImageResult[]>(cacheKey);
    if (stale) {
      console.warn(
        `[images] stale cache fallback (ageMs=${stale.ageMs}):`,
        err instanceof Error ? err.message : err
      );
      return stale.data;
    }
    if (!providersConfigured) return [];
    throw err;
  }
}
