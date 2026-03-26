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

async function searchPexels(
  query: string,
  perPage: number
): Promise<ImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}`,
      { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos || []).map((p: any) => ({
      id: `pexels_${p.id}`,
      url: p.src?.large || p.src?.original || "",
      thumbnailUrl: p.src?.small || p.src?.tiny || "",
      alt: p.alt || query,
      photographer: p.photographer || "",
      source: "pexels" as const,
      width: p.width || 0,
      height: p.height || 0,
    }));
  } catch {
    return [];
  }
}

async function searchUnsplash(
  query: string,
  perPage: number
): Promise<ImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((p: any) => ({
      id: `unsplash_${p.id}`,
      url: p.urls?.regular || p.urls?.full || "",
      thumbnailUrl: p.urls?.thumb || p.urls?.small || "",
      alt: p.alt_description || p.description || query,
      photographer: p.user?.name || "",
      source: "unsplash" as const,
      width: p.width || 0,
      height: p.height || 0,
    }));
  } catch {
    return [];
  }
}

export async function searchImages(
  params: ImagesParams
): Promise<ImageResult[]> {
  const perPage = params.perPage ?? 10;
  const [pexels, unsplash] = await Promise.all([
    searchPexels(params.query, perPage),
    searchUnsplash(params.query, perPage),
  ]);

  const combined: ImageResult[] = [];
  const maxLen = Math.max(pexels.length, unsplash.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < pexels.length) combined.push(pexels[i]);
    if (i < unsplash.length) combined.push(unsplash[i]);
  }
  return combined;
}
