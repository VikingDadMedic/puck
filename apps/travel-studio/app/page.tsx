import { Dashboard } from "./dashboard";
import { seedData } from "../config/seed-data";
import { readTravelDataFileStrict } from "../lib/persistence/travel-data-store";
import { isTravelStudioEnvelope } from "../lib/persistence/travel-document-types";

export const dynamic = "force-dynamic";

export type DashboardDocument = {
  path: string;
  name: string;
  version: number;
  source: "saved" | "seed";
  mode?: string;
  documentType?: string;
};

function extractDocInfo(
  path: string,
  raw: unknown,
  source: "saved" | "seed"
): DashboardDocument {
  let name = "Untitled";
  let version = 0;
  let mode: string | undefined;
  let documentType: string | undefined;

  if (isTravelStudioEnvelope(raw)) {
    version = raw.version;
    const rootProps = (raw.puck?.root as { props?: Record<string, unknown> })
      ?.props;
    name = (rootProps?.title as string) || name;
    mode = (rootProps?.documentMode as string) || undefined;
    documentType = (rootProps?.documentType as string) || "template";
  } else if (raw && typeof raw === "object") {
    const d = raw as Record<string, unknown>;
    const rootProps = (d.root as { props?: Record<string, unknown> })?.props;
    name = (rootProps?.title as string) || name;
    mode = (rootProps?.documentMode as string) || undefined;
    documentType = (rootProps?.documentType as string) || "template";
  }

  return { path, name, version, source, mode, documentType };
}

export default function HomePage() {
  const readResult = readTravelDataFileStrict();
  const savedData = readResult.ok ? readResult.data : {};

  const allPaths = new Set([
    ...Object.keys(savedData),
    ...Object.keys(seedData),
  ]);
  const documents: DashboardDocument[] = [];

  for (const p of allPaths) {
    if (savedData[p] !== undefined) {
      documents.push(extractDocInfo(p, savedData[p], "saved"));
    } else if (seedData[p]) {
      documents.push(extractDocInfo(p, seedData[p], "seed"));
    }
  }

  documents.sort((a, b) => a.path.localeCompare(b.path));

  return <Dashboard documents={documents} />;
}
