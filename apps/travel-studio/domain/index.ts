export type {
  RichText,
  Money,
  SupplierRef,
  MediaAsset,
  AttachmentRef,
  UploadedDocument,
  EventTiming,
  Visibility,
} from "./common";

export type { ItineraryDocument, ItineraryPrice } from "./itinerary";

export type { EventCategory, EventBase } from "./events/base";
export type { InfoEvent } from "./events/info";
export type { ActivityEvent } from "./events/activity";
export type { LodgingEvent } from "./events/lodging";
export type { FlightEvent } from "./events/flight";
export type { CruiseEvent } from "./events/cruise";
export type {
  RailEvent,
  CarRentalEvent,
  OtherTransportEvent,
} from "./events/transportation";
export type { GenericUnmodeledEvent } from "./events/generic";

export type { ItineraryEvent } from "./union";

export {
  isInfoEvent,
  isActivityEvent,
  isLodgingEvent,
  isFlightEvent,
  isCruiseEvent,
  isRailEvent,
  isCarRentalEvent,
  isOtherTransportEvent,
  isGenericEvent,
} from "./guards";
