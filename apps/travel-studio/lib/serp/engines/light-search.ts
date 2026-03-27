import { serpFetch } from "../client";

export type LightSearchResult = {
  id: string;
  title: string;
  description: string;
  link?: string;
};

export async function searchGoogleLight(params: {
  q: string;
}): Promise<LightSearchResult[]> {
  const data = await serpFetch<Record<string, unknown>>("google_light", {
    q: params.q,
  });

  const organic = (data.organic_results as Record<string, unknown>[]) || [];
  return organic.slice(0, 15).map((r, i) => ({
    id: `light_${i}_${String(r.title ?? i)}`,
    title: String(r.title ?? "Result"),
    description: String(r.snippet ?? ""),
    link: typeof r.link === "string" ? r.link : undefined,
  }));
}
