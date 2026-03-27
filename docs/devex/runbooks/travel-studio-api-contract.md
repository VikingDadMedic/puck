# Travel Studio API Contract

## Documents API

### `GET /api/documents`

Lists all documents (merged from saved data and seed templates).

Optional query parameter: `?path=/trip` to filter to a single document.

Response:

```json
{
  "documents": [
    {
      "path": "/trip",
      "name": "Mediterranean Cruise Escape",
      "version": 2,
      "source": "saved"
    }
  ],
  "requestId": "..."
}
```

### `POST /api/documents`

Request body:

```json
{
  "path": "/trip",
  "data": { "root": { "props": {} }, "content": [] },
  "expectedVersion": 1
}
```

Rules:

- `path` must be a safe slash-prefixed route-like string.
- `data` must be a JSON object.
- `expectedVersion` is optional for new docs (omitted or `0`), required for updates after first envelope save.

Success response:

```json
{
  "status": "ok",
  "version": 2,
  "requestId": "..."
}
```

### `DELETE /api/documents?path=...`

Deletes a saved document.

- `path` query parameter is required.
- Returns `404` if the document does not exist in saved data.
- Seed-only documents cannot be deleted (they are not persisted).

Success response:

```json
{
  "status": "ok",
  "requestId": "..."
}
```

## Search APIs

All `GET /api/search/*` endpoints:

- apply shared guard (`auth + rate limit`) via `runSearchRoute(...)`
- validate query params
- return provider-normalized JSON arrays (or finance summary arrays)
- include `x-request-id` header

Representative required params:

- flights: `from`, `to` (`date` optional)
- hotels: `destination`
- activities/restaurants: `destination`
- events/google-light/finance: `q`
- yelp: `find_loc`
- maps-reviews: at least one of `data_id` or `place_id`
- images: `query`
- places: `query`
- opentable-reviews: `rid`
- explore: `from`

## Error Envelope Matrix

All errors return:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable public message",
    "requestId": "..."
  }
}
```

Primary codes:

- `VALIDATION_ERROR` (`400`)
- `AUTH_REQUIRED` (`401`)
- `NOT_FOUND` (`404`)
- `DOCUMENT_CONFLICT` (`409`)
- `RATE_LIMITED` (`429`)
- `PROVIDER_ERROR` (`502`)
- `INTERNAL_ERROR` (`500`)
