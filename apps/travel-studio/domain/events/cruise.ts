import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type CruiseEvent = EventBase & {
  category: "cruise";
  type: "departure" | "arrival";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    carrier?: SupplierRef;
    cabinType?: string;
    cabinNumber?: string;
  };
  price?: Money;
};
