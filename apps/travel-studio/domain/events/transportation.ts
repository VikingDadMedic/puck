import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type RailEvent = EventBase & {
  category: "transportation";
  subCategory: "rail";
  type: "departure" | "arrival";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    carrier?: SupplierRef;
    trainNumber?: string;
  };
  price?: Money;
};

export type CarRentalEvent = EventBase & {
  category: "transportation";
  subCategory: "carRental";
  type: "pickUp" | "dropOff";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    carrier?: SupplierRef;
  };
  price?: Money;
};

export type OtherTransportEvent = EventBase & {
  category: "transportation";
  subCategory: "other";
  type: "departure" | "arrival";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    carrier?: SupplierRef;
    number?: string;
  };
  price?: Money;
};
