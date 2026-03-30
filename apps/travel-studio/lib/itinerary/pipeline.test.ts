import { mapPuckDataToItineraryDocument } from "./puck-to-itinerary";
import { validateItineraryDocument } from "./validate-itinerary-schema";
import { mediterraneanCruise } from "../../config/seed-data";

function makePuckData(content: any[]) {
  return {
    root: { props: { title: "Test Trip" } },
    content,
  };
}

function card(type: string, props: Record<string, unknown>) {
  return { type, props: { id: `test-${type.toLowerCase()}`, ...props } };
}

describe("itinerary pipeline", () => {
  it("maps seed puck data to a schema-valid itinerary document", () => {
    const doc = mapPuckDataToItineraryDocument("/trip", mediterraneanCruise);
    expect(doc.id).toBe("trip");
    expect(doc.events.length).toBeGreaterThan(0);

    const result = validateItineraryDocument(doc);
    if (!result.ok) {
      throw new Error(result.errors);
    }
    expect(result.ok).toBe(true);
  });

  describe("new component types", () => {
    it("maps InfoCard to InfoEvent", () => {
      const data = makePuckData([
        card("InfoCard", {
          subCategory: "cityGuide",
          name: "Paris Guide",
          notes: "<p>Helpful tips</p>",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/info-test", data);
      expect(doc.events).toHaveLength(1);
      expect(doc.events[0].category).toBe("info");
      expect((doc.events[0] as any).subCategory).toBe("cityGuide");
      expect((doc.events[0] as any).title).toBe("Paris Guide");
    });

    it("maps TourCard to TourEvent", () => {
      const data = makePuckData([
        card("TourCard", {
          name: "Vineyard Tour",
          timing: {
            date: "2026-06-17",
            time: "10:00",
            duration: "3h",
            timezone: "",
          },
          details: {
            bookedThrough: { name: "Viator", externalId: "", source: "" },
            confirmationNumber: "VT-123",
            provider: { name: "Local Guides", externalId: "", source: "" },
            meetingPoint: "Town Square",
            groupSize: 8,
            included: "Wine tasting included",
          },
          price: { amount: 150, currency: "EUR" },
          notes: "<p>Wear comfortable shoes</p>",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/tour-test", data);
      expect(doc.events).toHaveLength(1);
      const ev = doc.events[0] as any;
      expect(ev.category).toBe("tour");
      expect(ev.details.meetingPoint).toBe("Town Square");
      expect(ev.details.groupSize).toBe(8);
      expect(ev.price).toEqual({ amount: 150, currency: "EUR" });

      const result = validateItineraryDocument(doc);
      if (!result.ok) throw new Error(result.errors);
      expect(result.ok).toBe(true);
    });

    it("maps BookingCard to BookingEvent", () => {
      const data = makePuckData([
        card("BookingCard", {
          name: "Spa Reservation",
          timing: {
            date: "2026-06-18",
            time: "14:00",
            duration: "2h",
            timezone: "",
          },
          details: {
            bookedThrough: { name: "Hotel Desk", externalId: "", source: "" },
            confirmationNumber: "SPA-456",
            provider: { name: "Hotel Spa", externalId: "", source: "" },
            bookingReference: "REF-789",
          },
          price: { amount: 200, currency: "USD" },
          notes: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/booking-test", data);
      expect(doc.events).toHaveLength(1);
      const ev = doc.events[0] as any;
      expect(ev.category).toBe("booking");
      expect(ev.details.bookingReference).toBe("REF-789");
      expect(ev.price).toEqual({ amount: 200, currency: "USD" });

      const result = validateItineraryDocument(doc);
      if (!result.ok) throw new Error(result.errors);
      expect(result.ok).toBe(true);
    });
  });

  describe("updated fields on existing components", () => {
    it("StayCard reads type instead of hardcoding checkIn", () => {
      const data = makePuckData([
        card("StayCard", {
          name: "Grand Hotel",
          type: "checkOut",
          timing: {
            date: "2026-06-20",
            time: "11:00",
            duration: "",
            timezone: "",
          },
          details: {
            bookedThrough: { name: "", externalId: "", source: "" },
            confirmationNumber: "",
            roomBedType: "Suite",
          },
          price: { amount: 500, currency: "EUR" },
          notes: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/stay-test", data);
      const ev = doc.events[0] as any;
      expect(ev.type).toBe("checkOut");
      expect(ev.price).toEqual({ amount: 500, currency: "EUR" });
    });

    it("ActivityCard includes price", () => {
      const data = makePuckData([
        card("ActivityCard", {
          name: "Museum Visit",
          timing: { date: "", time: "", duration: "", timezone: "" },
          details: {
            bookedThrough: { name: "", externalId: "", source: "" },
            confirmationNumber: "",
            provider: { name: "", externalId: "", source: "" },
          },
          price: { amount: 25, currency: "USD" },
          description: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/activity-test", data);
      const ev = doc.events[0] as any;
      expect(ev.price).toEqual({ amount: 25, currency: "USD" });
    });

    it("TransportCard reads leg and bookedThrough", () => {
      const data = makePuckData([
        card("TransportCard", {
          type: "flight",
          leg: "arrival",
          carrier: { name: "Delta", externalId: "", source: "" },
          bookedThrough: { name: "Expedia", externalId: "", source: "" },
          timing: {
            date: "2026-06-15",
            time: "14:30",
            duration: "",
            timezone: "",
          },
          departure: "JFK",
          arrival: "CDG",
          price: { amount: 800, currency: "USD" },
          flightDetails: {
            flightNumber: "DL100",
            terminal: "4",
            gate: "B12",
            seatTicketDetails: "",
          },
          trainDetails: { trainNumber: "" },
          otherDetails: { number: "" },
          carRentalDetails: { leg: "pickUp" },
          confirmationNumber: "DL-999",
          notes: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/transport-test", data);
      const ev = doc.events[0] as any;
      expect(ev.category).toBe("flight");
      expect(ev.type).toBe("arrival");
      expect(ev.details.bookedThrough).toEqual({ name: "Expedia" });
    });

    it("CruiseCard reads type and bookedThrough", () => {
      const data = makePuckData([
        card("CruiseCard", {
          type: "arrival",
          name: "MSC Seaside",
          carrier: { name: "MSC Cruises", externalId: "", source: "" },
          bookedThrough: { name: "CruiseDirect", externalId: "", source: "" },
          timing: {
            date: "2026-06-25",
            time: "08:00",
            duration: "",
            timezone: "",
          },
          cabinType: "Balcony",
          cabinNumber: "B412",
          confirmationNumber: "MSC-111",
          price: { amount: 3000, currency: "USD" },
          notes: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/cruise-test", data);
      const ev = doc.events[0] as any;
      expect(ev.type).toBe("arrival");
      expect(ev.details.bookedThrough).toEqual({ name: "CruiseDirect" });
    });

    it("RestaurantCard includes price and provider", () => {
      const data = makePuckData([
        card("RestaurantCard", {
          name: "Le Bistro",
          cuisine: "French",
          rating: 4.5,
          timing: { date: "", time: "19:00", duration: "", timezone: "" },
          details: {
            bookedThrough: { name: "", externalId: "", source: "" },
            confirmationNumber: "LB-100",
            provider: { name: "OpenTable", externalId: "", source: "" },
          },
          price: { amount: 120, currency: "EUR" },
          notes: "",
        }),
      ]);
      const doc = mapPuckDataToItineraryDocument("/restaurant-test", data);
      const ev = doc.events[0] as any;
      expect(ev.category).toBe("activity");
      expect(ev.subCategory).toBe("foodDrink");
      expect(ev.price).toEqual({ amount: 120, currency: "EUR" });
      expect(ev.details.provider).toEqual({ name: "OpenTable" });
    });
  });
});
