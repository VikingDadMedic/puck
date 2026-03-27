import type { Data } from "@/core";
import { seedData } from "../config/seed-data";
import { isTravelStudioEnvelope } from "./persistence/travel-document-types";
import { readTravelDataFileStrict } from "./persistence/travel-data-store";

export type DocumentRecord = {
  puck: Partial<Data>;
  version: number;
};

export function getDocumentRecord(docPath: string): DocumentRecord {
  const readResult = readTravelDataFileStrict();
  if (!readResult.ok) {
    throw new Error(
      `Failed to read persisted travel documents: ${readResult.error}`
    );
  }
  const all = readResult.data;
  const raw = all[docPath];

  if (raw !== undefined) {
    if (isTravelStudioEnvelope(raw)) {
      return { puck: raw.puck, version: raw.version };
    }
    return { puck: raw as Partial<Data>, version: 0 };
  }

  const seed = seedData[docPath];
  return { puck: seed || {}, version: 0 };
}

export function getDocument(docPath: string): Partial<Data> {
  return getDocumentRecord(docPath).puck;
}
