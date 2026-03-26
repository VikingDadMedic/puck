---
name: wire-external-field
description: Wire a new external data feed into a Puck component in the Travel Composition Studio. Use when the user wants to connect an API to a component field, add a new data picker, or integrate a new SerpAPI engine.
---

# Wire an External Data Feed

Guide for connecting API data to a Puck `external` field in `apps/travel-studio`.

## When to Use

- User asks to add a data picker to a component
- User wants to connect a new API (SerpAPI engine, Pexels, etc.)
- User mentions "external field", "data feed", "search picker", "API integration"

## Architecture

```
Puck external field (fetchList) → Next.js API route → lib/serp engine → SerpAPI (cached 24h)
```

## Step-by-Step

### 1. Create the engine wrapper (if new API)

Add to `apps/travel-studio/lib/serp/engines/`:

```typescript
import { serpFetch } from "../client";

export type MyResult = { id: string; name: string /* ... */ };

export async function searchMy(params: { query: string }): Promise<MyResult[]> {
  const data = await serpFetch<any>("engine_name", { q: params.query });
  return (data.results || []).map((r: any, i: number) => ({
    id: `my_${i}`,
    name: r.title || "",
  }));
}
```

Then export from `lib/serp/index.ts`.

### 2. Create the API route

Add to `apps/travel-studio/app/api/search/my-thing/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { searchMy } from "../../../../lib/serp/engines/my-thing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  if (!query)
    return NextResponse.json({ error: "query required" }, { status: 400 });
  const results = await searchMy({ query });
  return NextResponse.json(results);
}
```

### 3. Create the external field config

Add to `apps/travel-studio/config/fields/my-picker.ts`:

```typescript
import type { ExternalField } from "@/core";

export const myPickerField: ExternalField = {
  type: "external",
  label: "Search...",
  placeholder: "Type to search...",
  showSearch: true,
  fetchList: async ({ query }) => {
    if (!query) return [];
    const res = await fetch(
      `/api/search/my-thing?query=${encodeURIComponent(query)}`
    );
    return res.ok ? res.json() : [];
  },
  mapRow: (item) => ({ title: item.name, description: "..." }),
  mapProp: (item) => ({ name: item.name }),
  getItemSummary: (item) => item?.name || "Item",
};
```

### 4. Wire into the component

Import the field config and use it in the component's `fields`:

```typescript
import { myPickerField } from "../../fields/my-picker";

fields: {
  myThing: myPickerField,
  // ...other fields
},
```

Add `resolveData` if the selection should hydrate other fields:

```typescript
resolveData: async ({ props }, { changed }) => {
  if (!changed.myThing || !props.myThing) return { props };
  return {
    props: { name: props.myThing.name },
    readOnly: { name: true },
  };
},
```

## Existing Pickers

| Picker   | File                               | API Route                | Engine            |
| -------- | ---------------------------------- | ------------------------ | ----------------- |
| Hotel    | `config/fields/hotel-picker.ts`    | `/api/search/hotels`     | `google_hotels`   |
| Flight   | `config/fields/flight-picker.ts`   | `/api/search/flights`    | `google_flights`  |
| Activity | `config/fields/activity-picker.ts` | `/api/search/activities` | `tripadvisor`     |
| Image    | `config/fields/image-picker.ts`    | `/api/search/images`     | Pexels + Unsplash |

## Cache

All SerpAPI responses are cached for 24 hours in `.cache/serp/`.
Image APIs (Pexels/Unsplash) are NOT cached (they're fast and rate-limited differently).
