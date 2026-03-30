# Component-to-Schema Mapping (Phase 6.5)

Canonical itinerary data is derived from Puck composition data on **save**:

1. map `Data` -> `ItineraryDocument` using
   [`lib/itinerary/puck-to-itinerary.ts`](../lib/itinerary/puck-to-itinerary.ts)
2. validate with JSON Schema using
   [`lib/itinerary/validate-itinerary-schema.ts`](../lib/itinerary/validate-itinerary-schema.ts)
3. persist envelope in `travel-data.json` (or Directus when configured)

## Storage envelope and version semantics

Persisted shape (per document path key in `travel-data.json` or Directus `trips` collection):

- `version: number` - optimistic concurrency version
- `puck: Data` - authoring document used by editor
- `itinerary: ItineraryDocument` - schema-validated canonical domain document

Legacy rows are still supported:

- legacy raw Puck rows (without envelope) are treated as **version `0`**
- first save after migration writes canonical envelope at **version `1`**

Write contract from [`app/api/documents/route.ts`](../app/api/documents/route.ts):

- new document: `expectedVersion` may be omitted or `0`
- existing envelope (`version >= 1`): `expectedVersion` is required
- mismatch returns `409 DOCUMENT_CONFLICT`

## Mapping table

| Component                                | Schema / role                                                          | Coordinates                                    | Status                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `TripHeader`                             | Trip metadata -- `destination` enriches document name                  | --                                             | OK -- destination and travelerCount preserved in mapper          |
| `TripOverview`                           | `ItineraryDocument.description` (richtext)                             | --                                             | OK                                                               |
| `StayCard`                               | `LodgingEvent`                                                         | `coordinates: {lat, lng} \| null`              | Aligned -- supplier objects, coordinates feed ItineraryMap       |
| `ActivityCard`                           | `ActivityEvent` (`subCategory: "activity"`)                            | `coordinates: {lat, lng} \| null`              | Aligned -- timing, supplier, coordinates feed ItineraryMap       |
| `TransportCard`                          | `FlightEvent` / `RailEvent` / `CarRentalEvent` / `OtherTransportEvent` | `departureCoordinates` + `arrivalCoordinates`  | Aligned -- dual coordinate pairs for origin/destination          |
| `RestaurantCard`                         | `ActivityEvent` (`subCategory: "foodDrink"`)                           | `coordinates: {lat, lng} \| null`              | Aligned -- maps to activity with foodDrink subCategory           |
| `CruiseCard`                             | `CruiseEvent`                                                          | --                                             | Aligned -- maps to cruise with carrier, cabin, price             |
| `InfoCard`                               | `InfoEvent`                                                            | --                                             | Aligned -- info and cityGuide subtypes                           |
| `TourCard`                               | `TourEvent`                                                            | `coordinates: {lat, lng} \| null`              | Aligned -- provider, meetingPoint, groupSize, included           |
| `BookingCard`                            | `BookingEvent`                                                         | --                                             | Aligned -- provider, bookingReference, timing, price             |
| `ItineraryMap`                           | Non-event display component                                            | Reads all coordinates from sibling card events | N/A -- walks Puck data tree to render markers and route lines    |
| `PricingSummary`                         | `ItineraryDocument.price` (`ItineraryPrice`)                           | --                                             | OK -- total, currency, basis extracted into document-level price |
| Other structural / conversion components | Non-events                                                             | --                                             | N/A                                                              |

## Known remaining modeling limitations

- **Chronology ordering**: event collection is tree-walk order, not strict time sort.
- **Start date derivation**: `startDate` comes from first `DaySection` date/header text, not dedicated root field.
- **Union completeness**: All event categories except `smartImport` now have dedicated domain types and Puck card components.
- **Coordinates are Puck-only**: coordinate fields live on component props and feed the ItineraryMap, but are not persisted into the `ItineraryDocument` domain schema (the JSON schemas do not include lat/lng fields on events).

## Backfill and migration guidance

- Existing raw rows can be migrated lazily by opening + saving in editor.
- For bulk migration, run a script that:
  - reads each raw row,
  - maps via `mapPuckDataToItineraryDocument`,
  - validates schema,
  - writes `{ version: 1, puck, itinerary }`.
- On parse corruption, APIs now fail safe (no blind overwrite); recover by fixing JSON before writes resume.
- When Directus is configured (`DIRECTUS_URL`), the adapter in `lib/persistence/directus-adapter.ts` stores documents in the `trips` collection with automatic fallback to file-based storage.

## Template/Itinerary Lifecycle

- Templates have `documentType: "template"` in `root.props`; itineraries have `"itinerary"`.
- All seed data documents are `documentType: "template"`.
- `cloneAndReId` (`lib/get-document.ts`) creates an itinerary from a template — deep clones the Puck `Data` tree and regenerates all component IDs to avoid collisions.
- Fill mode locks structural operations via Puck global permissions (`drag: false`, `delete: false`, `duplicate: false`, `insert: false`, `edit: true`), allowing agents/advisors to fill in content without altering document structure.
- The Drawer (component picker) is hidden in fill mode via a Puck `drawer` override returning `null`.
- Dashboard surfaces templates and itineraries in separate sections; "Use Template" triggers the clone-and-instantiate flow.

## Related paths

- Schemas: `schemas/`
- Domain types: `domain/`
- Save/list/delete route: `app/api/documents/route.ts`
- Persistence helpers: `lib/persistence/` (file store + Directus adapter)
- Design tokens: `config/tokens.ts`
- ItineraryMap: `config/components/travel/ItineraryMap.tsx`
- Geocode API: `app/api/geocode/route.ts`
- Seed documents: `config/seed-data.ts` (7 templates)
- Dashboard: `app/page.tsx` + `app/dashboard.tsx`
- Docker stack: `docker-compose.travel-studio.yml` (monorepo root)
