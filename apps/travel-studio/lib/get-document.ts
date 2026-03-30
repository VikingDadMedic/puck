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

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function reIdNode(node: Record<string, unknown>): void {
  if (typeof node.id === "string") {
    node.id = generateId();
  }
  if (node.props && typeof node.props === "object") {
    const props = node.props as Record<string, unknown>;
    if (typeof props.id === "string") {
      props.id = generateId();
    }
    for (const v of Object.values(props)) {
      if (Array.isArray(v)) {
        for (const item of v) {
          if (
            item &&
            typeof item === "object" &&
            typeof (item as Record<string, unknown>).type === "string"
          ) {
            reIdNode(item as Record<string, unknown>);
          }
        }
      }
    }
  }
}

export function cloneAndReId(
  data: Partial<Data>,
  overrides?: { title?: string; documentType?: string }
): Partial<Data> {
  const cloned = JSON.parse(JSON.stringify(data)) as Partial<Data>;

  if (cloned.content && Array.isArray(cloned.content)) {
    for (const node of cloned.content) {
      reIdNode(node as unknown as Record<string, unknown>);
    }
  }

  if (overrides) {
    const root = (cloned.root ?? {}) as Record<string, unknown>;
    const props = (root.props as Record<string, unknown>) ?? {};
    if (overrides.title) props.title = overrides.title;
    if (overrides.documentType) props.documentType = overrides.documentType;
    root.props = props;
    cloned.root = root as typeof cloned.root;
  }

  return cloned;
}
