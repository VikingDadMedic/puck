# Component-to-Schema Mapping

This document maps the current Puck composition components to the canonical
itinerary event schema. It serves as the roadmap for Phase 2 component refactoring.

## Current State

The travel-studio has 15 Puck components with simple flat props.
The domain model defines a polymorphic event system with 9 event variants,
shared base shell, and structured sub-objects (SupplierRef, EventTiming, Money, etc.).

## Mapping Table

| Current Component  | Schema Type(s)                                                         | Status         | Gap                                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TripHeader`       | `ItineraryDocument` (root-level)                                       | Compatible     | travelerCount maps to doc-level metadata                                                                                                                                                                                       |
| `TripOverview`     | `ItineraryDocument.description` + custom                               | Compatible     | highlights → future structured field                                                                                                                                                                                           |
| `StayCard`         | `LodgingEvent`                                                         | Needs refactor | Missing `details.bookedThrough`, `details.confirmationNumber`; flat `name`/`location`/`dates`/`roomType` need restructuring into `details` object; `rating` has no schema equivalent (extend schema or keep as component-only) |
| `ActivityCard`     | `ActivityEvent`                                                        | Needs refactor | Missing `details.provider`, `details.bookedThrough`, `details.confirmationNumber`; `time`/`duration` should become `EventTiming`                                                                                               |
| `TransportCard`    | `FlightEvent` / `RailEvent` / `CarRentalEvent` / `OtherTransportEvent` | Needs split    | Currently one component with type select; schema splits into 4 distinct variants with different detail fields. Options: (a) split into 4 components, (b) keep one component with `resolveFields` dynamic fields                |
| `PricingSummary`   | `ItineraryPrice` + `Money`                                             | Compatible     | `lineItems` pattern works; `currency`/`total` should use `Money` type; `basis` field (perPerson/total) missing                                                                                                                 |
| `AdvisorInsight`   | Not an event type                                                      | N/A            | Pure composition component, not a domain event. Keep as-is.                                                                                                                                                                    |
| `IncludedFeatures` | Not an event type                                                      | N/A            | Pure composition component. Keep as-is.                                                                                                                                                                                        |
| `PrimaryCTA`       | Not an event type                                                      | N/A            | Pure composition component. Keep as-is.                                                                                                                                                                                        |
| `DocumentSection`  | Structural only                                                        | N/A            | Layout container, not a domain event. Keep as-is.                                                                                                                                                                              |
| `DaySection`       | Structural only                                                        | N/A            | Layout container. Maps to grouping events by date in the domain model.                                                                                                                                                         |
| `SidebarLayout`    | Structural only                                                        | N/A            | Layout container. Keep as-is.                                                                                                                                                                                                  |
| `CardGroup`        | Structural only                                                        | N/A            | Layout container. Keep as-is.                                                                                                                                                                                                  |
| `Spacer`           | Structural only                                                        | N/A            | Layout utility. Keep as-is.                                                                                                                                                                                                    |
| `Divider`          | Structural only                                                        | N/A            | Layout utility. Keep as-is.                                                                                                                                                                                                    |

## Key Decisions for Phase 2

### A. Transport component strategy

**Option A (recommended):** Keep one `TransportCard` component but use Puck's
`resolveFields` to dynamically show/hide fields based on the selected transport
sub-category. Store data in the `FlightEvent` / `RailEvent` / etc. shape.

**Option B:** Split into separate `FlightCard`, `RailCard`, `CarRentalCard`,
`OtherTransportCard` components. Simpler per-component but more drawer clutter.

### B. StayCard restructuring

Move flat props into nested `details` object to match `LodgingEvent.details`.
Add `bookedThrough` and `confirmationNumber` as new fields. The `rating` field
has no schema equivalent -- keep it as a component-only presentation prop.

### C. Timing normalization

Replace flat `time`/`duration` strings with `EventTiming` object fields.
Use Puck `object` field type with nested text fields, or a custom field
for a date/time picker.

### D. Supplier references

Replace plain text `carrier`/`provider` fields with `SupplierRef` object fields.
Initially render as text inputs; later upgrade to Puck `external` field with
`fetchList` for supplier lookup.

## Schema files

- JSON Schemas: `apps/travel-studio/schemas/`
- TypeScript types: `apps/travel-studio/domain/`
- Type guards: `apps/travel-studio/domain/guards.ts`
- Barrel export: `apps/travel-studio/domain/index.ts`
