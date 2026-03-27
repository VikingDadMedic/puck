# Travel Studio Cache Invalidation Runbook

## Cache Layers

### Provider response cache

- Location: `.cache/serp/`
- Helpers: `apps/travel-studio/lib/serp/cache.ts`
- Behavior:
  - fresh TTL window
  - stale-if-error fallback window
  - automatic stale eviction beyond grace

### Page revalidation

- On successful document writes, `revalidatePath(path)` is called in:
  - `apps/travel-studio/app/api/documents/route.ts`

## Manual Cache Clear

Run from repo root:

```sh
node scripts/clear-serp-cache.mjs
```

Equivalent via npm script context:

```sh
yarn node scripts/clear-serp-cache.mjs
```

The script prints how many files were removed.

## When to Clear vs Wait

- Clear cache immediately when:
  - provider schema/output shape changes,
  - stale provider outages have recovered and fresh data is required now,
  - debugging data normalization with repeated deterministic queries.
- Prefer waiting for TTL when:
  - no active outage,
  - data freshness requirements are non-critical,
  - you want normal cache pressure and behavior.

## Failure Notes

- Cache writes are intentionally non-fatal.
- Provider failures should not be cached as successful empty responses.
- `x-request-id` should be used to correlate stale fallback logs with API errors.
