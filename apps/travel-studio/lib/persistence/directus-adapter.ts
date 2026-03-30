import { readItems, createItem, updateItem, deleteItem } from "@directus/sdk";
import {
  getDirectusClient,
  isDirectusConfigured,
  type DirectusTrip,
} from "../directus/client";
import {
  readTravelDataFileStrict,
  readTravelDataFile,
  writeTravelDataFileAtomic,
  type TravelDataReadResult,
} from "./travel-data-store";
import {
  isTravelStudioEnvelope,
  type TravelStudioStoredDocument,
} from "./travel-document-types";

// ---------------------------------------------------------------------------
// Document metadata returned by list operations
// ---------------------------------------------------------------------------

export type DocumentListItem = {
  path: string;
  name: string;
  version: number;
  source: "saved" | "seed" | "directus";
  updatedAt?: string;
};

// ---------------------------------------------------------------------------
// Directus row <-> stored envelope conversion
// ---------------------------------------------------------------------------

function tripToEnvelope(trip: DirectusTrip): TravelStudioStoredDocument {
  return {
    version: trip.version,
    puck: (trip.puck_data ?? {}) as TravelStudioStoredDocument["puck"],
    itinerary: (trip.itinerary_data ??
      {}) as TravelStudioStoredDocument["itinerary"],
  };
}

function extractNameFromEnvelope(raw: unknown): string {
  if (isTravelStudioEnvelope(raw)) {
    const rootProps = (raw.puck?.root as { props?: Record<string, unknown> })
      ?.props;
    return (rootProps?.title as string) || "Untitled";
  }
  return "Untitled";
}

// ---------------------------------------------------------------------------
// Read all documents — returns the same Record shape the file store uses
// ---------------------------------------------------------------------------

export async function readDocumentsFromDirectus(): Promise<TravelDataReadResult> {
  if (!isDirectusConfigured()) {
    return readTravelDataFileStrict();
  }

  try {
    const trips = await getDirectusClient().request(
      readItems("trips", { limit: -1 })
    );

    const data: Record<string, unknown> = {};
    for (const trip of trips) {
      data[trip.path] = tripToEnvelope(trip);
    }
    return { ok: true, data };
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Directus read failed";
    return { ok: false, error: detail };
  }
}

// ---------------------------------------------------------------------------
// Read a single document by path
// ---------------------------------------------------------------------------

export async function readDocumentFromDirectus(
  path: string
): Promise<TravelStudioStoredDocument | null> {
  if (!isDirectusConfigured()) {
    const all = readTravelDataFile();
    const raw = all[path];
    if (raw === undefined) return null;
    if (isTravelStudioEnvelope(raw)) return raw;
    return {
      version: 0,
      puck: raw as TravelStudioStoredDocument["puck"],
      itinerary: {} as TravelStudioStoredDocument["itinerary"],
    };
  }

  try {
    const trips = await getDirectusClient().request(
      readItems("trips", {
        filter: { path: { _eq: path } },
        limit: 1,
      })
    );

    if (!trips.length) return null;
    return tripToEnvelope(trips[0]);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write (upsert) a document
// ---------------------------------------------------------------------------

export async function writeDocumentToDirectus(
  path: string,
  envelope: TravelStudioStoredDocument
): Promise<{ ok: true; version: number } | { ok: false; error: string }> {
  if (!isDirectusConfigured()) {
    try {
      const all = readTravelDataFile();
      all[path] = envelope;
      writeTravelDataFileAtomic(all);
      return { ok: true, version: envelope.version };
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "File write failed";
      return { ok: false, error: detail };
    }
  }

  try {
    const existing = await getDirectusClient().request(
      readItems("trips", {
        filter: { path: { _eq: path } },
        fields: ["id"],
        limit: 1,
      })
    );

    const name = extractNameFromEnvelope(envelope);
    const payload = {
      path,
      name,
      version: envelope.version,
      puck_data: envelope.puck as Record<string, unknown>,
      itinerary_data: envelope.itinerary as Record<string, unknown>,
      status: "draft" as const,
      visibility: "visible" as const,
    };

    if (existing.length > 0) {
      await getDirectusClient().request(
        updateItem("trips", existing[0].id, payload)
      );
    } else {
      await getDirectusClient().request(createItem("trips", payload));
    }

    return { ok: true, version: envelope.version };
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Directus write failed";
    return { ok: false, error: detail };
  }
}

// ---------------------------------------------------------------------------
// Delete a document by path
// ---------------------------------------------------------------------------

export async function deleteDocumentFromDirectus(
  path: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isDirectusConfigured()) {
    try {
      const all = readTravelDataFile();
      if (all[path] === undefined)
        return { ok: false, error: "Document not found" };
      delete all[path];
      writeTravelDataFileAtomic(all);
      return { ok: true };
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "File delete failed";
      return { ok: false, error: detail };
    }
  }

  try {
    const existing = await getDirectusClient().request(
      readItems("trips", {
        filter: { path: { _eq: path } },
        fields: ["id"],
        limit: 1,
      })
    );

    if (!existing.length) {
      return { ok: false, error: "Document not found in Directus" };
    }

    await getDirectusClient().request(deleteItem("trips", existing[0].id));
    return { ok: true };
  } catch (err: unknown) {
    const detail =
      err instanceof Error ? err.message : "Directus delete failed";
    return { ok: false, error: detail };
  }
}

// ---------------------------------------------------------------------------
// List documents with metadata (for the dashboard)
// ---------------------------------------------------------------------------

export async function listDocumentsFromDirectus(): Promise<DocumentListItem[]> {
  if (!isDirectusConfigured()) {
    const all = readTravelDataFile();
    return Object.entries(all).map(([path, raw]) => ({
      path,
      name: extractNameFromEnvelope(raw),
      version: isTravelStudioEnvelope(raw) ? raw.version : 0,
      source: "saved" as const,
    }));
  }

  try {
    const trips = await getDirectusClient().request(
      readItems("trips", {
        fields: ["path", "name", "version", "date_updated", "status"],
        sort: ["-date_updated"],
        limit: -1,
      })
    );

    return trips.map((trip) => ({
      path: trip.path,
      name: trip.name,
      version: trip.version,
      source: "directus" as const,
      updatedAt: trip.date_updated,
    }));
  } catch {
    return [];
  }
}
