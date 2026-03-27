import fs from "fs";
import path from "path";

export const TRAVEL_DATA_DB_PATH = path.join(process.cwd(), "travel-data.json");

export type TravelDataReadResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

export function readTravelDataFileStrict(): TravelDataReadResult {
  if (!fs.existsSync(TRAVEL_DATA_DB_PATH)) return { ok: true, data: {} };
  try {
    const raw = fs.readFileSync(TRAVEL_DATA_DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        ok: false,
        error: "travel-data.json must contain a JSON object at the top level",
      };
    }
    return { ok: true, data: parsed as Record<string, unknown> };
  } catch (err: unknown) {
    const detail =
      err instanceof Error ? err.message : "Unknown read/parse error";
    return { ok: false, error: detail };
  }
}

export function readTravelDataFile(): Record<string, unknown> {
  const result = readTravelDataFileStrict();
  if (!result.ok) return {};
  return result.data;
}

export function writeTravelDataFileAtomic(all: Record<string, unknown>): void {
  const dir = path.dirname(TRAVEL_DATA_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmp = path.join(dir, `.travel-data.${process.pid}.${Date.now()}.tmp`);
  fs.writeFileSync(tmp, JSON.stringify(all, null, 2), "utf-8");
  fs.renameSync(tmp, TRAVEL_DATA_DB_PATH);
}
