import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type BookingEvent = EventBase & {
  category: "booking";
  subCategory?: string;
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    provider?: SupplierRef;
    bookingReference?: string;
  };
  price?: Money;
};
