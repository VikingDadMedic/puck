import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type LodgingEvent = EventBase & {
  category: "lodging";
  type: "checkIn" | "checkOut";
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    roomBedType?: string;
  };
  timing?: EventTiming;
  price?: Money;
};
