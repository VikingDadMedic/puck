import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type ActivityEvent = EventBase & {
  category: "activity";
  subCategory?: "activity" | "foodDrink";
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    provider?: SupplierRef;
  };
  timing?: EventTiming;
  price?: Money;
};
