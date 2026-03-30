import type { ItineraryEvent } from "./union";
import type { InfoEvent } from "./events/info";
import type { ActivityEvent } from "./events/activity";
import type { LodgingEvent } from "./events/lodging";
import type { FlightEvent } from "./events/flight";
import type { CruiseEvent } from "./events/cruise";
import type {
  RailEvent,
  CarRentalEvent,
  OtherTransportEvent,
} from "./events/transportation";
import type { TourEvent } from "./events/tour";
import type { BookingEvent } from "./events/booking";
import type { GenericUnmodeledEvent } from "./events/generic";

export function isInfoEvent(e: ItineraryEvent): e is InfoEvent {
  return e.category === "info";
}

export function isActivityEvent(e: ItineraryEvent): e is ActivityEvent {
  return e.category === "activity";
}

export function isLodgingEvent(e: ItineraryEvent): e is LodgingEvent {
  return e.category === "lodging";
}

export function isFlightEvent(e: ItineraryEvent): e is FlightEvent {
  return e.category === "flight";
}

export function isCruiseEvent(e: ItineraryEvent): e is CruiseEvent {
  return e.category === "cruise";
}

export function isRailEvent(e: ItineraryEvent): e is RailEvent {
  return e.category === "transportation" && e.subCategory === "rail";
}

export function isCarRentalEvent(e: ItineraryEvent): e is CarRentalEvent {
  return e.category === "transportation" && e.subCategory === "carRental";
}

export function isOtherTransportEvent(
  e: ItineraryEvent
): e is OtherTransportEvent {
  return e.category === "transportation" && e.subCategory === "other";
}

export function isTourEvent(e: ItineraryEvent): e is TourEvent {
  return e.category === "tour";
}

export function isBookingEvent(e: ItineraryEvent): e is BookingEvent {
  return e.category === "booking";
}

export function isGenericEvent(e: ItineraryEvent): e is GenericUnmodeledEvent {
  return e.category === "smartImport";
}
