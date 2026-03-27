import { serpFetch } from "../client";

export type FinanceQuoteResult = {
  id: string;
  title: string;
  price?: string;
  movement?: string;
  link?: string;
};

export async function searchGoogleFinance(params: {
  q: string;
}): Promise<FinanceQuoteResult[]> {
  const data = await serpFetch<Record<string, unknown>>("google_finance", {
    q: params.q,
  });

  const summary = data.summary as Record<string, unknown> | undefined;
  if (!summary) return [];

  return [
    {
      id: "finance_summary",
      title: String(summary.title ?? params.q),
      price:
        typeof summary.price === "string"
          ? summary.price
          : summary.price != null
          ? String(summary.price)
          : undefined,
      movement:
        typeof summary.price_movement === "string"
          ? summary.price_movement
          : undefined,
      link: typeof summary.link === "string" ? summary.link : undefined,
    },
  ];
}
