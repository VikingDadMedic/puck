# Travel Studio Infrastructure Runbook

## Docker Compose Stack

The full platform stack is defined in `docker-compose.travel-studio.yml` at the monorepo root. It runs 9 services:

| Service       | Image                | Port     | Purpose                                             |
| ------------- | -------------------- | -------- | --------------------------------------------------- |
| db            | postgres:15-alpine   | 5432     | Shared PostgreSQL (Supabase + Directus databases)   |
| kong          | kong:2.8.1           | 8000     | API gateway for Supabase services                   |
| auth          | supabase/gotrue      | internal | User authentication (JWT tokens, email/password)    |
| realtime      | supabase/realtime    | internal | WebSocket subscriptions for live data updates       |
| storage       | supabase/storage-api | internal | S3-compatible file storage for trip media           |
| studio        | supabase/studio      | 3100     | Supabase admin dashboard                            |
| redis         | redis:7-alpine       | 6379     | Directus cache                                      |
| directus      | directus/directus    | 8055     | Headless CMS with M2A itinerary builder collections |
| travel-studio | custom (Dockerfile)  | 3001     | Next.js itinerary editor app                        |

## Starting and Stopping

```sh
# Start all services (from monorepo root)
docker compose -f docker-compose.travel-studio.yml --env-file .env.travel-studio up -d

# Or using the convenience script
yarn workspace travel-studio docker:up

# Stop all services
docker compose -f docker-compose.travel-studio.yml down

# Stop and remove volumes (full reset)
docker compose -f docker-compose.travel-studio.yml down -v
```

## First-Time Setup

1. Copy the env template: `cp .env.travel-studio.example .env.travel-studio`
2. Edit `.env.travel-studio` and set all `CHANGE_ME` placeholders to secure values
3. Run `docker compose -f docker-compose.travel-studio.yml up -d`
4. Wait for all services to become healthy (~30-60 seconds)
5. Access Directus at `http://localhost:8055` and log in with the admin credentials from `.env.travel-studio`
6. In Directus Data Studio, go to Settings > Data Model and configure the existing tables (created by the init migration) as Directus collections

## Service Access

| What                 | URL                   | Credentials                                                        |
| -------------------- | --------------------- | ------------------------------------------------------------------ |
| Travel Studio editor | http://localhost:3001 | Supabase user account (or API key in dev)                          |
| Directus Data Studio | http://localhost:8055 | `DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD` from env        |
| Supabase Studio      | http://localhost:3100 | `STUDIO_DASHBOARD_USERNAME` / `STUDIO_DASHBOARD_PASSWORD` from env |
| Supabase API         | http://localhost:8000 | `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` from env         |
| PostgreSQL           | localhost:5432        | `POSTGRES_USER` / `POSTGRES_PASSWORD` from env                     |

## Mapbox Token Setup

Two tokens are needed (both in `apps/travel-studio/.env`):

| Token                 | Prefix | Usage                                    | Security                                             |
| --------------------- | ------ | ---------------------------------------- | ---------------------------------------------------- |
| `PUBLIC_MAPBOX_TOKEN` | `pk.*` | Client-side map tiles and rendering      | Safe to expose (restrict by URL in Mapbox dashboard) |
| `MAPBOX_ACCESS_TOKEN` | `sk.*` | Server-side geocoding via `/api/geocode` | Keep secret, never expose to browser                 |

The geocode API route (`GET /api/geocode?q=paris`) uses the secret token to convert address strings to lat/lng coordinates. It is guarded by the same auth/rate-limit middleware as all other API routes.

## Database Schema

The init script at `docker/travel-studio/init/create-directus-db.sql` creates a `directus` database and user. The migration at `docker/travel-studio/migrations/001-create-collections.sql` creates 10 tables:

- `trips` - top-level trip container with Puck + itinerary JSON
- `travelers` - traveler profiles (passport, dietary, loyalty, emergency contact)
- `trips_travelers` - M2M junction with role (lead/companion/advisor)
- `suppliers` - supplier directory
- `event_stay`, `event_activity`, `event_transport`, `event_restaurant`, `event_cruise` - individual event tables
- `itinerary_events` - M2A junction linking trips to any event type with sort order

After the migration runs, configure these tables as Directus collections through the Data Studio UI to get the admin interface, permissions, and API endpoints.

## Directus Real-Time

Directus WebSockets are enabled via `WEBSOCKETS_ENABLED=true` in the compose environment. This provides:

- Live subscription to collection changes (create/update/delete)
- CRUD operations over WebSocket
- Collaborative editing coordination (with Redis for multi-instance)

The travel-studio app can subscribe to `trips` collection changes using the Directus SDK:

```typescript
import { getDirectusClient } from "../lib/directus/client";
const client = getDirectusClient();
// Subscribe to trip changes via Directus realtime
```

## Fallback Behavior

Both the Directus persistence adapter and Supabase auth are designed to degrade gracefully:

| Component     | When configured                                   | When NOT configured                               |
| ------------- | ------------------------------------------------- | ------------------------------------------------- |
| Persistence   | Directus SDK reads/writes to `trips` collection   | File-based `travel-data.json` (existing behavior) |
| Auth          | Supabase JWT validation from Authorization header | API key auth via `x-api-key` header               |
| Geocoding     | Mapbox server-side geocoding                      | `/api/geocode` returns `PROVIDER_ERROR`           |
| Map rendering | Interactive Mapbox GL map with markers/routes     | Fallback message "No locations to display"        |

This means the app works without Docker -- just run `yarn workspace travel-studio dev` for local development with file-based storage and API key auth.

## Troubleshooting

- **Services won't start**: Check `docker compose logs <service>` for errors. Most common: port conflicts (5432, 8000, 3001) or missing env vars.
- **Directus can't connect to Postgres**: Ensure the `db` service is healthy before Directus starts. The compose file uses `depends_on` with health checks.
- **Supabase auth errors**: Verify `JWT_SECRET` is identical across GoTrue, PostgREST, Realtime, and Kong services.
- **Travel-studio build fails in Docker**: Ensure `yarn.lock` is committed (the Dockerfile uses `--frozen-lockfile`).
- **Map doesn't render**: Check that `PUBLIC_MAPBOX_TOKEN` is set in the app's `.env` file. The token must be a `pk.*` public token.
