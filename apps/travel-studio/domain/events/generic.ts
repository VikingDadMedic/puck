import type { EventBase } from "./base";

export type GenericUnmodeledEvent = EventBase & {
  category: "smartImport";
  details?: Record<string, unknown>;
};
