import { mapPuckDataToItineraryDocument } from "./puck-to-itinerary";
import { validateItineraryDocument } from "./validate-itinerary-schema";
import { mediterraneanCruise } from "../../config/seed-data";

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
});
