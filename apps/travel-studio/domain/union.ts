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
import type { GenericUnmodeledEvent } from "./events/generic";

export type ItineraryEvent =
  | InfoEvent
  | ActivityEvent
  | LodgingEvent
  | FlightEvent
  | CruiseEvent
  | RailEvent
  | CarRentalEvent
  | OtherTransportEvent
  | GenericUnmodeledEvent;
