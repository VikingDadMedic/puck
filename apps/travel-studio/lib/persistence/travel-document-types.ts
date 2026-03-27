import type { Data } from "@/core";
import type { ItineraryDocument } from "../../domain/itinerary";

export type TravelStudioStoredDocument = {
  version: number;
  puck: Partial<Data>;
  itinerary: ItineraryDocument;
};

export function isTravelStudioEnvelope(
  raw: unknown
): raw is TravelStudioStoredDocument {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.version === "number" &&
    o.puck !== undefined &&
    typeof o.puck === "object" &&
    o.itinerary !== undefined &&
    typeof o.itinerary === "object"
  );
}
