# Travel Studio Migration and Recovery Runbook

## Current Persistence Shape

Each `travel-data.json` row is keyed by document path and stores:

- `version`
- `puck`
- `itinerary`

Legacy rows without envelope are interpreted as version `0`.

## Backfill Strategy (Legacy -> Envelope)

For each legacy row:

1. Read raw Puck data.
2. Convert with `mapPuckDataToItineraryDocument(...)`.
3. Validate with `validateItineraryDocument(...)`.
4. Persist envelope:
   - `version: 1`
   - `puck: <raw data>`
   - `itinerary: <validated canonical document>`

## Optimistic Concurrency Rules

- New docs: `expectedVersion` omitted or `0`.
- Existing docs (`version >= 1`): must provide matching `expectedVersion`.
- Mismatch returns `409 DOCUMENT_CONFLICT`.

## Parse Corruption Recovery

If `travel-data.json` is corrupted:

- write APIs fail safe with `500` instead of silently overwriting.
- fix file corruption before retrying writes.

Recovery options:

- restore from backup/version control copy,
- repair JSON manually and validate structure,
- move corrupted file aside and regenerate from known seed sources if acceptable.

## Recommended Validation Checklist After Migration

- `yarn workspace travel-studio test`
- `yarn workspace travel-studio build`
- smoke save/load flow (`yarn smoke` with both local apps running)
