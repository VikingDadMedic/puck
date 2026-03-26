import type { EventBase } from "./base";

export type InfoEvent = EventBase & {
  category: "info";
  subCategory?: "info" | "cityGuide";
};
