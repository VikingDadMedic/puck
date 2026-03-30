import type { Data } from "@/core";
import type { ItineraryDocument, ItineraryPrice } from "../../domain/itinerary";
import type { ItineraryEvent } from "../../domain/union";
import type { RichText } from "../../domain/common";
import type { SupplierRef } from "../../domain/common";

type PuckNode = {
  type: string;
  props?: Record<string, unknown>;
};

function isComponentArray(v: unknown): v is PuckNode[] {
  return (
    Array.isArray(v) &&
    v.every(
      (x) =>
        x !== null &&
        typeof x === "object" &&
        typeof (x as PuckNode).type === "string"
    )
  );
}

function stripUndefinedDeep<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) {
    const next = value
      .map((x) => stripUndefinedDeep(x))
      .filter((x) => x !== undefined);
    return next as T;
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      if (v === undefined) continue;
      const inner = stripUndefinedDeep(v);
      if (inner === undefined) continue;
      out[k] = inner;
    }
    return out as T;
  }
  return value;
}

function supplierRef(val: unknown): SupplierRef | undefined {
  if (val == null || val === "") return undefined;
  if (typeof val === "string") {
    const t = val.trim();
    return t ? { name: t } : undefined;
  }
  if (typeof val === "object") {
    const o = val as Record<string, unknown>;
    const raw: SupplierRef = {
      id: typeof o.id === "string" && o.id.trim() ? o.id.trim() : undefined,
      name:
        typeof o.name === "string" && o.name.trim() ? o.name.trim() : undefined,
      externalId:
        typeof o.externalId === "string" && o.externalId.trim()
          ? o.externalId.trim()
          : undefined,
      source:
        typeof o.source === "string" && o.source.trim()
          ? o.source.trim()
          : undefined,
    };
    const compact = stripUndefinedDeep(raw) as SupplierRef;
    if (Object.keys(compact).length === 0) return undefined;
    return compact;
  }
  return undefined;
}

function asRichText(html: unknown): RichText | undefined {
  if (html == null) return undefined;
  if (typeof html === "string") return html;
  if (typeof html === "object") return html as Record<string, unknown>;
  return String(html);
}

function toIsoDate(label: string | undefined): string | null {
  if (!label) return null;
  const iso = label.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];
  const t = Date.parse(label);
  if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  return null;
}

function mergeTiming(
  timing: Record<string, unknown> | undefined,
  dayDate?: string
):
  | { date?: string; time?: string; duration?: string; timezone?: string }
  | undefined {
  const t = timing || {};
  const rawDate =
    (typeof t.date === "string" && t.date.trim()) || dayDate?.trim() || "";
  const dateIso = rawDate ? toIsoDate(rawDate) ?? undefined : undefined;

  const out: {
    date?: string;
    time?: string;
    duration?: string;
    timezone?: string;
  } = {};
  if (dateIso) out.date = dateIso;
  if (typeof t.time === "string" && t.time.trim()) out.time = t.time.trim();
  if (typeof t.duration === "string" && t.duration.trim())
    out.duration = t.duration.trim();
  if (typeof t.timezone === "string" && t.timezone.trim())
    out.timezone = t.timezone.trim();

  if (Object.keys(out).length === 0) return undefined;
  return out;
}

function mapMoney(
  val: unknown
): { amount: number; currency: string } | undefined {
  if (val == null || typeof val !== "object") return undefined;
  const o = val as Record<string, unknown>;
  if (typeof o.amount !== "number" || !Number.isFinite(o.amount))
    return undefined;
  if (o.amount === 0) return undefined;
  const rawCur =
    typeof o.currency === "string" ? o.currency.trim().toUpperCase() : "";
  return { amount: o.amount, currency: rawCur.length === 3 ? rawCur : "USD" };
}

function mapStayCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id = typeof props.id === "string" ? props.id : cryptoRandomId("stay");
  const details = (props.details as Record<string, unknown>) || {};
  const stayType = props.type === "checkOut" ? "checkOut" : "checkIn";
  return stripUndefinedDeep({
    id,
    category: "lodging" as const,
    type: stayType as "checkIn" | "checkOut",
    title: typeof props.name === "string" ? props.name : undefined,
    timing: mergeTiming(props.timing as Record<string, unknown>, ctx.dayDate),
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(details.bookedThrough),
      confirmationNumber:
        typeof details.confirmationNumber === "string" &&
        details.confirmationNumber.trim()
          ? details.confirmationNumber.trim()
          : undefined,
      roomBedType:
        typeof details.roomBedType === "string" && details.roomBedType.trim()
          ? details.roomBedType.trim()
          : undefined,
    }),
    price: mapMoney(props.price),
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapActivityCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id =
    typeof props.id === "string" ? props.id : cryptoRandomId("activity");
  const details = (props.details as Record<string, unknown>) || {};
  return stripUndefinedDeep({
    id,
    category: "activity" as const,
    subCategory: "activity" as const,
    title: typeof props.name === "string" ? props.name : undefined,
    timing: mergeTiming(props.timing as Record<string, unknown>, ctx.dayDate),
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(details.bookedThrough),
      confirmationNumber:
        typeof details.confirmationNumber === "string" &&
        details.confirmationNumber.trim()
          ? details.confirmationNumber.trim()
          : undefined,
      provider: supplierRef(details.provider),
    }),
    price: mapMoney(props.price),
    notes: asRichText(props.description),
  }) as ItineraryEvent;
}

function mapTransportCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id =
    typeof props.id === "string" ? props.id : cryptoRandomId("transport");
  const t = (props.type as string) || "flight";
  const timing = mergeTiming(
    props.timing as Record<string, unknown>,
    ctx.dayDate
  );
  const price = props.price as Record<string, unknown> | undefined;
  let money: { amount: number; currency: string } | undefined;
  if (
    price &&
    typeof price.amount === "number" &&
    Number.isFinite(price.amount)
  ) {
    const rawCur =
      typeof price.currency === "string"
        ? price.currency.trim().toUpperCase()
        : "";
    const currency = rawCur.length === 3 ? rawCur : "USD";
    money = { amount: price.amount, currency };
  }

  const confirmationNumber =
    typeof props.confirmationNumber === "string" &&
    props.confirmationNumber.trim()
      ? props.confirmationNumber.trim()
      : undefined;
  const legValue = props.leg === "arrival" ? "arrival" : "departure";
  const bookedThroughRef = supplierRef(props.bookedThrough);

  if (t === "flight") {
    const fd = (props.flightDetails as Record<string, unknown>) || {};
    return stripUndefinedDeep({
      id,
      category: "flight" as const,
      type: legValue as "departure" | "arrival",
      timing,
      details: stripUndefinedDeep({
        bookedThrough: bookedThroughRef,
        confirmationNumber,
        airline: supplierRef(props.carrier),
        flightNumber:
          typeof fd.flightNumber === "string" && fd.flightNumber.trim()
            ? fd.flightNumber.trim()
            : undefined,
        terminal:
          typeof fd.terminal === "string" && fd.terminal.trim()
            ? fd.terminal.trim()
            : undefined,
        gate:
          typeof fd.gate === "string" && fd.gate.trim()
            ? fd.gate.trim()
            : undefined,
        seatTicketDetails:
          typeof fd.seatTicketDetails === "string" &&
          fd.seatTicketDetails.trim()
            ? fd.seatTicketDetails.trim()
            : undefined,
      }),
      price: money,
      notes: asRichText(props.notes),
    }) as ItineraryEvent;
  }

  if (t === "train") {
    const td = (props.trainDetails as Record<string, unknown>) || {};
    return stripUndefinedDeep({
      id,
      category: "transportation" as const,
      subCategory: "rail" as const,
      type: legValue as "departure" | "arrival",
      timing,
      details: stripUndefinedDeep({
        bookedThrough: bookedThroughRef,
        confirmationNumber,
        carrier: supplierRef(props.carrier),
        trainNumber:
          typeof td.trainNumber === "string" && td.trainNumber.trim()
            ? td.trainNumber.trim()
            : undefined,
      }),
      price: money,
      notes: asRichText(props.notes),
    }) as ItineraryEvent;
  }

  if (t === "carRental") {
    const cr = (props.carRentalDetails as Record<string, unknown>) || {};
    const leg = cr.leg === "dropOff" ? "dropOff" : "pickUp";
    return stripUndefinedDeep({
      id,
      category: "transportation" as const,
      subCategory: "carRental" as const,
      type: leg,
      timing,
      details: stripUndefinedDeep({
        bookedThrough: bookedThroughRef,
        confirmationNumber,
        carrier: supplierRef(props.carrier),
      }),
      price: money,
      notes: asRichText(props.notes),
    }) as ItineraryEvent;
  }

  const od = (props.otherDetails as Record<string, unknown>) || {};
  return stripUndefinedDeep({
    id,
    category: "transportation" as const,
    subCategory: "other" as const,
    type: legValue as "departure" | "arrival",
    timing,
    details: stripUndefinedDeep({
      bookedThrough: bookedThroughRef,
      confirmationNumber,
      carrier: supplierRef(props.carrier),
      number:
        typeof od.number === "string" && od.number.trim()
          ? od.number.trim()
          : undefined,
    }),
    price: money,
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapRestaurantCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id =
    typeof props.id === "string" ? props.id : cryptoRandomId("restaurant");
  const details = (props.details as Record<string, unknown>) || {};
  return stripUndefinedDeep({
    id,
    category: "activity" as const,
    subCategory: "foodDrink" as const,
    title: typeof props.name === "string" ? props.name : undefined,
    timing: mergeTiming(props.timing as Record<string, unknown>, ctx.dayDate),
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(details.bookedThrough),
      confirmationNumber:
        typeof details.confirmationNumber === "string" &&
        details.confirmationNumber.trim()
          ? details.confirmationNumber.trim()
          : undefined,
      provider: supplierRef(details.provider),
    }),
    price: mapMoney(props.price),
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapCruiseCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id = typeof props.id === "string" ? props.id : cryptoRandomId("cruise");
  const timing = mergeTiming(
    props.timing as Record<string, unknown>,
    ctx.dayDate
  );
  const money = mapMoney(props.price);

  const cruiseType = props.type === "arrival" ? "arrival" : "departure";
  return stripUndefinedDeep({
    id,
    category: "cruise" as const,
    type: cruiseType as "departure" | "arrival",
    title: typeof props.name === "string" ? props.name : undefined,
    timing,
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(props.bookedThrough),
      carrier: supplierRef(props.carrier),
      confirmationNumber:
        typeof props.confirmationNumber === "string" &&
        props.confirmationNumber.trim()
          ? props.confirmationNumber.trim()
          : undefined,
      cabinType:
        typeof props.cabinType === "string" && props.cabinType.trim()
          ? props.cabinType.trim()
          : undefined,
      cabinNumber:
        typeof props.cabinNumber === "string" && props.cabinNumber.trim()
          ? props.cabinNumber.trim()
          : undefined,
    }),
    price: money,
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapInfoCard(
  props: Record<string, unknown>,
  _ctx: { dayDate?: string }
): ItineraryEvent {
  const id = typeof props.id === "string" ? props.id : cryptoRandomId("info");
  const sub = props.subCategory === "cityGuide" ? "cityGuide" : "info";
  return stripUndefinedDeep({
    id,
    category: "info" as const,
    subCategory: sub,
    title: typeof props.name === "string" ? props.name : undefined,
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapTourCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id = typeof props.id === "string" ? props.id : cryptoRandomId("tour");
  const details = (props.details as Record<string, unknown>) || {};
  return stripUndefinedDeep({
    id,
    category: "tour" as const,
    title: typeof props.name === "string" ? props.name : undefined,
    timing: mergeTiming(props.timing as Record<string, unknown>, ctx.dayDate),
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(details.bookedThrough),
      confirmationNumber:
        typeof details.confirmationNumber === "string" &&
        details.confirmationNumber.trim()
          ? details.confirmationNumber.trim()
          : undefined,
      provider: supplierRef(details.provider),
      meetingPoint:
        typeof details.meetingPoint === "string" && details.meetingPoint.trim()
          ? details.meetingPoint.trim()
          : undefined,
      groupSize:
        typeof details.groupSize === "number" &&
        Number.isFinite(details.groupSize) &&
        details.groupSize > 0
          ? details.groupSize
          : undefined,
      included:
        typeof details.included === "string" && details.included.trim()
          ? details.included.trim()
          : undefined,
    }),
    price: mapMoney(props.price),
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function mapBookingCard(
  props: Record<string, unknown>,
  ctx: { dayDate?: string }
): ItineraryEvent {
  const id =
    typeof props.id === "string" ? props.id : cryptoRandomId("booking");
  const details = (props.details as Record<string, unknown>) || {};
  return stripUndefinedDeep({
    id,
    category: "booking" as const,
    title: typeof props.name === "string" ? props.name : undefined,
    timing: mergeTiming(props.timing as Record<string, unknown>, ctx.dayDate),
    details: stripUndefinedDeep({
      bookedThrough: supplierRef(details.bookedThrough),
      confirmationNumber:
        typeof details.confirmationNumber === "string" &&
        details.confirmationNumber.trim()
          ? details.confirmationNumber.trim()
          : undefined,
      provider: supplierRef(details.provider),
      bookingReference:
        typeof details.bookingReference === "string" &&
        details.bookingReference.trim()
          ? details.bookingReference.trim()
          : undefined,
    }),
    price: mapMoney(props.price),
    notes: asRichText(props.notes),
  }) as ItineraryEvent;
}

function cryptoRandomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapCard(
  node: PuckNode,
  ctx: { dayDate?: string }
): ItineraryEvent | null {
  const props = node.props || {};
  switch (node.type) {
    case "StayCard":
      return mapStayCard(props, ctx);
    case "ActivityCard":
      return mapActivityCard(props, ctx);
    case "TransportCard":
      return mapTransportCard(props, ctx);
    case "RestaurantCard":
      return mapRestaurantCard(props, ctx);
    case "CruiseCard":
      return mapCruiseCard(props, ctx);
    case "InfoCard":
      return mapInfoCard(props, ctx);
    case "TourCard":
      return mapTourCard(props, ctx);
    case "BookingCard":
      return mapBookingCard(props, ctx);
    default:
      return null;
  }
}

function walkComponentList(
  nodes: PuckNode[],
  ctx: { dayDate?: string },
  out: ItineraryEvent[]
): void {
  for (const node of nodes) {
    if (node.type === "DaySection") {
      const p = node.props || {};
      const dayDate = typeof p.date === "string" ? p.date : undefined;
      const next = { ...ctx, dayDate };
      for (const slot of ["morning", "afternoon", "evening"] as const) {
        const arr = p[slot];
        if (isComponentArray(arr)) walkComponentList(arr, next, out);
      }
      continue;
    }

    const ev = mapCard(node, ctx);
    if (ev) out.push(ev);

    if (node.props) {
      for (const v of Object.values(node.props)) {
        if (isComponentArray(v)) walkComponentList(v, ctx, out);
      }
    }
  }
}

type TripMeta = {
  description?: RichText;
  dateRange?: string;
  destination?: string;
  travelerCount?: number;
  price?: ItineraryPrice;
};

function extractTripMeta(content: PuckNode[]): TripMeta {
  let description: RichText | undefined;
  let dateRange: string | undefined;
  let destination: string | undefined;
  let travelerCount: number | undefined;
  let price: ItineraryPrice | undefined;

  const visit = (nodes: PuckNode[]) => {
    for (const n of nodes) {
      if (n.type === "TripOverview" && n.props?.summary != null) {
        description = asRichText(n.props.summary);
      }
      if (n.type === "TripHeader" && n.props) {
        if (typeof n.props.dateRange === "string") {
          dateRange = n.props.dateRange;
        }
        if (
          typeof n.props.destination === "string" &&
          n.props.destination.trim()
        ) {
          destination = n.props.destination.trim();
        }
        if (typeof n.props.travelerCount === "number") {
          travelerCount = n.props.travelerCount;
        }
      }
      if (n.type === "PricingSummary" && n.props && !price) {
        const total = n.props.total;
        const currency = n.props.currency;
        const basis = n.props.basis;
        if (typeof total === "number" && Number.isFinite(total) && total > 0) {
          const cur =
            typeof currency === "string" && currency.trim().length === 3
              ? currency.trim().toUpperCase()
              : "USD";
          const b =
            basis === "perPerson" || basis === "total" ? basis : "perPerson";
          price = { amount: total, currency: cur, basis: b };
        }
      }
      if (n.props) {
        for (const v of Object.values(n.props)) {
          if (isComponentArray(v)) visit(v);
        }
      }
    }
  };
  visit(content);
  return { description, dateRange, destination, travelerCount, price };
}

function firstDaySectionDate(content: PuckNode[]): string | undefined {
  let found: string | undefined;
  const scan = (nodes: PuckNode[]) => {
    for (const n of nodes) {
      if (n.type === "DaySection" && typeof n.props?.date === "string") {
        found = found || n.props.date;
      }
      if (n.props) {
        for (const v of Object.values(n.props)) {
          if (isComponentArray(v)) scan(v);
        }
      }
    }
  };
  scan(content);
  return found;
}

export function docIdFromPath(p: string): string {
  const slug = p
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "document";
}

export function mapPuckDataToItineraryDocument(
  path: string,
  data: Partial<Data>
): ItineraryDocument {
  const root = data.root?.props as Record<string, unknown> | undefined;
  const title =
    (typeof root?.title === "string" && root.title) || "Untitled Trip";
  const content = (data.content || []) as PuckNode[];
  const meta = extractTripMeta(content);
  const fromDay = firstDaySectionDate(content);
  const startDate =
    toIsoDate(fromDay) || toIsoDate(meta.dateRange) || "1970-01-01";

  const events: ItineraryEvent[] = [];
  walkComponentList(content, {}, events);

  const docName = meta.destination ? `${title} — ${meta.destination}` : title;

  return stripUndefinedDeep({
    id: docIdFromPath(path),
    name: docName,
    visibility: "visible" as const,
    startDate,
    price: meta.price,
    description: meta.description,
    events,
  }) as ItineraryDocument;
}
