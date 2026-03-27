# Component-to-Schema Mapping (Phase 4.5)

Canonical itinerary data is derived from Puck composition data on **save**:

1. map `Data` -> `ItineraryDocument` using
   [`lib/itinerary/puck-to-itinerary.ts`](../lib/itinerary/puck-to-itinerary.ts)
2. validate with JSON Schema using
   [`lib/itinerary/validate-itinerary-schema.ts`](../lib/itinerary/validate-itinerary-schema.ts)
3. persist envelope in `travel-data.json`

## Storage envelope and version semantics

Persisted shape (per document path key in `travel-data.json`):

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

| Component                                | Schema / role                                                          | Status                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `TripHeader`                             | Trip metadata -- `destination` enriches document name                  | OK -- destination and travelerCount preserved in mapper          |
| `TripOverview`                           | `ItineraryDocument.description` (richtext)                             | OK                                                               |
| `StayCard`                               | `LodgingEvent`                                                         | Aligned -- `details.bookedThrough` as `SupplierRef` object       |
| `ActivityCard`                           | `ActivityEvent` (`subCategory: "activity"`)                            | Aligned -- timing object and supplier objects                    |
| `TransportCard`                          | `FlightEvent` / `RailEvent` / `CarRentalEvent` / `OtherTransportEvent` | Aligned -- car rental branch + discriminator-safe mapping        |
| `RestaurantCard`                         | `ActivityEvent` (`subCategory: "foodDrink"`)                           | Aligned -- maps to activity with foodDrink subCategory           |
| `CruiseCard`                             | `CruiseEvent`                                                          | Aligned -- maps to cruise with carrier, cabin, price             |
| `PricingSummary`                         | `ItineraryDocument.price` (`ItineraryPrice`)                           | OK -- total, currency, basis extracted into document-level price |
| Other structural / conversion components | Non-events                                                             | N/A                                                              |

## Known remaining modeling limitations

- **Chronology ordering**: event collection is tree-walk order, not strict time sort.
- **Start date derivation**: `startDate` comes from first `DaySection` date/header text, not dedicated root field.
- **Union completeness**: `Info` and generic variants are not authored directly; all card types with domain equivalents are now mapped.

## Backfill and migration guidance

- Existing raw rows can be migrated lazily by opening + saving in editor.
- For bulk migration, run a script that:
  - reads each raw row,
  - maps via `mapPuckDataToItineraryDocument`,
  - validates schema,
  - writes `{ version: 1, puck, itinerary }`.
- On parse corruption, APIs now fail safe (no blind overwrite); recover by fixing JSON before writes resume.

## Related paths

- Schemas: `schemas/`
- Domain types: `domain/`
- Save/list/delete route: `app/api/documents/route.ts`
- Persistence helpers: `lib/persistence/`
- Seed document: `config/seed-data.ts`
- Dashboard: `app/page.tsx` + `app/dashboard.tsx`
