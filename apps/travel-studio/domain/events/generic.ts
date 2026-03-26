import type { EventBase } from "./base";

export type GenericUnmodeledEvent = EventBase & {
  category: "smartImport" | "tour" | "booking";
  details?: Record<string, unknown>;
};
