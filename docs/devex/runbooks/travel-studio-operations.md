# Travel Studio Operations Runbook

## Service Startup Matrix

- Demo app: `cd apps/demo && yarn dev` (default `http://localhost:3000`)
- Travel-studio app: `cd apps/travel-studio && yarn dev` (`http://localhost:3001`)
- Smoke suite requires both servers: `yarn smoke`

## Endpoint Catalog

- Documents list: `GET /api/documents` (optional `?path=` filter)
- Documents write: `POST /api/documents`
- Documents delete: `DELETE /api/documents?path=...`
- Health check: `GET /api/health`
- Search APIs: `GET /api/search/*` (activities, events, explore, finance, flights, google-light, hotels, images, maps-reviews, opentable-reviews, places, restaurants, yelp)

## Auth and Rate Limits

- If `TRAVEL_STUDIO_API_KEY` is set, all `/api/documents` and `/api/search/*` requests require:
  - header `x-api-key: <value>`
- Query-string auth is intentionally unsupported.
- Rate limits are enforced per route prefix + client key.
- `429` responses include `Retry-After`.

## Request ID Tracing

- Error envelopes return `{ error: { code, message, requestId } }`.
- API responses include header `x-request-id`.
- Route logs are emitted through `logApi(...)` in `apps/travel-studio/lib/logger.ts`.
- To troubleshoot:
  1. capture `requestId` from client response,
  2. search logs for the same `requestId`,
  3. inspect preceding `warn/error` events.

## Health and Basic Diagnostics

- `GET /api/health` returns:
  - `ok`
  - `requestId`
  - provider/auth configuration booleans
  - timestamp
- If `ok` is false, inspect env configuration and startup logs from `ensureEnvValidated()`.
