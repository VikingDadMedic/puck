import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { Data } from "@/core";
import {
  apiGuard,
  apiError,
  validateDocPayload,
  sanitizeDocumentData,
} from "../../../lib/api";
import { mapPuckDataToItineraryDocument } from "../../../lib/itinerary/puck-to-itinerary";
import { validateItineraryDocument } from "../../../lib/itinerary/validate-itinerary-schema";
import {
  isTravelStudioEnvelope,
  type TravelStudioStoredDocument,
} from "../../../lib/persistence/travel-document-types";
import {
  readTravelDataFileStrict,
  writeTravelDataFileAtomic,
} from "../../../lib/persistence/travel-data-store";
import { logApi, newRequestId } from "../../../lib/logger";
import { seedData } from "../../../config/seed-data";

function storedVersion(raw: unknown): number {
  if (raw === undefined) return -1;
  if (isTravelStudioEnvelope(raw)) return raw.version;
  return 0;
}

function extractDocumentName(raw: unknown): string {
  if (isTravelStudioEnvelope(raw)) {
    const rootProps = (raw.puck?.root as { props?: Record<string, unknown> })
      ?.props;
    return (rootProps?.title as string) || "Untitled";
  }
  if (raw && typeof raw === "object") {
    const d = raw as Record<string, unknown>;
    const rootProps = (d.root as { props?: Record<string, unknown> })?.props;
    return (rootProps?.title as string) || "Untitled";
  }
  return "Untitled";
}

export async function GET(request: Request) {
  const requestId = newRequestId();
  const guard = apiGuard(request, {
    routePrefix: "documents:read",
    maxRequests: 120,
    windowMs: 60_000,
    requestId,
  });
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const pathFilter = url.searchParams.get("path");

  const readResult = readTravelDataFileStrict();
  if (!readResult.ok) {
    logApi("error", requestId, "travel-data.json read failed", {
      detail: readResult.error,
    });
    return apiError(
      "INTERNAL_ERROR",
      "Failed to load persisted travel data",
      readResult.error,
      requestId
    );
  }

  const all = readResult.data;

  const allPaths = new Set([...Object.keys(all), ...Object.keys(seedData)]);
  const documents: {
    path: string;
    name: string;
    version: number;
    source: "saved" | "seed";
  }[] = [];

  for (const p of allPaths) {
    if (pathFilter && p !== pathFilter) continue;

    const saved = all[p];
    if (saved !== undefined) {
      documents.push({
        path: p,
        name: extractDocumentName(saved),
        version: storedVersion(saved),
        source: "saved",
      });
    } else if (seedData[p]) {
      const rootProps = (
        seedData[p]?.root as { props?: Record<string, unknown> }
      )?.props;
      documents.push({
        path: p,
        name: (rootProps?.title as string) || "Untitled",
        version: 0,
        source: "seed",
      });
    }
  }

  const response = NextResponse.json({ documents, requestId });
  response.headers.set("x-request-id", requestId);
  return response;
}

export async function DELETE(request: Request) {
  const requestId = newRequestId();
  const guard = apiGuard(request, {
    routePrefix: "documents:delete",
    maxRequests: 20,
    windowMs: 60_000,
    requestId,
  });
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const docPath = url.searchParams.get("path");
  if (!docPath) {
    return apiError(
      "VALIDATION_ERROR",
      "Missing required query parameter: path",
      undefined,
      requestId
    );
  }

  const readResult = readTravelDataFileStrict();
  if (!readResult.ok) {
    return apiError(
      "INTERNAL_ERROR",
      "Failed to load persisted travel data",
      readResult.error,
      requestId
    );
  }

  const all = readResult.data;
  if (all[docPath] === undefined) {
    return apiError("NOT_FOUND", "Document not found", undefined, requestId);
  }

  const updated = { ...all };
  delete updated[docPath];

  try {
    writeTravelDataFileAtomic(updated);
    revalidatePath(docPath);
    logApi("info", requestId, "document deleted", { path: docPath });
    const response = NextResponse.json({
      status: "ok",
      requestId,
    });
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Unknown write failure";
    return apiError(
      "INTERNAL_ERROR",
      "Failed to delete document",
      detail,
      requestId
    );
  }
}

export async function POST(request: Request) {
  const requestId = newRequestId();
  const guard = apiGuard(request, {
    routePrefix: "documents:write",
    maxRequests: 30,
    windowMs: 60_000,
    requestId,
  });
  if (!guard.ok) return guard.response;

  const validation = await validateDocPayload(request);
  if (!validation.valid) {
    logApi("warn", requestId, "document payload validation failed", {
      message: validation.message,
    });
    return apiError(
      "VALIDATION_ERROR",
      validation.message,
      undefined,
      requestId
    );
  }

  const puckData = sanitizeDocumentData(validation.data) as Partial<Data>;

  let itinerary;
  try {
    itinerary = mapPuckDataToItineraryDocument(validation.path, puckData);
  } catch (e: unknown) {
    const d = e instanceof Error ? e.message : String(e);
    logApi("error", requestId, "mapPuckToItinerary failed", { detail: d });
    return apiError(
      "INTERNAL_ERROR",
      "Failed to map document to itinerary",
      d,
      requestId
    );
  }

  const schemaResult = validateItineraryDocument(itinerary);
  if (!schemaResult.ok) {
    logApi("warn", requestId, "itinerary schema validation failed", {
      errors: schemaResult.errors,
    });
    return apiError(
      "VALIDATION_ERROR",
      `Itinerary does not match schema: ${schemaResult.errors}`,
      undefined,
      requestId
    );
  }

  const readResult = readTravelDataFileStrict();
  if (!readResult.ok) {
    logApi("error", requestId, "travel-data.json read failed", {
      detail: readResult.error,
    });
    return apiError(
      "INTERNAL_ERROR",
      "Failed to load persisted travel data",
      readResult.error,
      requestId
    );
  }
  const all = readResult.data;
  const existingRaw = all[validation.path];
  const cur = storedVersion(existingRaw);

  const exp = validation.expectedVersion;
  if (cur < 0) {
    if (exp !== undefined && exp !== 0) {
      return apiError(
        "VALIDATION_ERROR",
        "expectedVersion must be 0 or omitted for a new document",
        undefined,
        requestId
      );
    }
  } else {
    if (cur >= 1 && exp === undefined) {
      return apiError(
        "VALIDATION_ERROR",
        "expectedVersion is required when updating an existing saved document",
        undefined,
        requestId
      );
    }
    const effectiveExpected = exp ?? 0;
    if (effectiveExpected !== cur) {
      logApi("warn", requestId, "document conflict", {
        path: validation.path,
        expectedVersion: effectiveExpected,
        currentVersion: cur,
      });
      return apiError(
        "DOCUMENT_CONFLICT",
        "Document version mismatch — reload and try again",
        `expected ${effectiveExpected}, current ${cur}`,
        requestId
      );
    }
  }

  const nextVersion = cur < 0 ? 1 : cur + 1;
  const envelope: TravelStudioStoredDocument = {
    version: nextVersion,
    puck: puckData,
    itinerary,
  };

  const updated = { ...all, [validation.path]: envelope };

  try {
    writeTravelDataFileAtomic(updated);
    revalidatePath(validation.path);
    logApi("info", requestId, "document saved", {
      path: validation.path,
      version: nextVersion,
    });
    const response = NextResponse.json({
      status: "ok",
      version: nextVersion,
      requestId,
    });
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Unknown write failure";
    logApi("error", requestId, "document write failed", { detail });
    return apiError(
      "INTERNAL_ERROR",
      "Failed to save document",
      detail,
      requestId
    );
  }
}
