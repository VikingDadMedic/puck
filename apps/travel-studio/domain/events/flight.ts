import type { EventBase } from "./base";
import type { SupplierRef, EventTiming, Money } from "../common";

export type FlightEvent = EventBase & {
  category: "flight";
  type: "departure" | "arrival";
  timing?: EventTiming;
  details: {
    bookedThrough?: SupplierRef;
    confirmationNumber?: string;
    airline?: SupplierRef;
    flightNumber?: string;
    terminal?: string;
    gate?: string;
    seatTicketDetails?: string;
  };
  price?: Money;
};
