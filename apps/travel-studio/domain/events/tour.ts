import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type TourEvent = EventBase & {
  category: "tour";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    provider?: SupplierRef;
    meetingPoint?: string;
    groupSize?: number;
    included?: string;
  };
  price?: Money;
};
