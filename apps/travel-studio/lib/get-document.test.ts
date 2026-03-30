import { cloneAndReId } from "./get-document";

describe("cloneAndReId", () => {
  const sampleData = {
    root: {
      props: {
        title: "Test Template",
        documentType: "template",
        documentMode: "itinerary",
      },
    },
    content: [
      {
        type: "DaySection",
        props: {
          id: "day-1",
          label: "Day 1",
          morning: [
            {
              type: "StayCard",
              props: {
                id: "stay-1",
                name: "Hotel Example",
                coordinates: null,
              },
            },
          ],
          afternoon: [],
          evening: [
            {
              type: "ActivityCard",
              props: {
                id: "activity-1",
                name: "Museum Tour",
              },
            },
          ],
        },
      },
      {
        type: "TripHeader",
        props: {
          id: "header-1",
          destination: "Paris",
        },
      },
    ],
  };

  it("deep clones without mutating the original", () => {
    const cloned = cloneAndReId(sampleData);
    expect(cloned).not.toBe(sampleData);
    expect(cloned.content).not.toBe(sampleData.content);

    const original = sampleData.content![0] as Record<string, unknown>;
    const clonedFirst = (cloned.content as Record<string, unknown>[])[0];
    expect(clonedFirst).not.toBe(original);
  });

  it("regenerates all component IDs", () => {
    const cloned = cloneAndReId(sampleData);
    const content = cloned.content as Record<string, unknown>[];

    const daySection = content[0];
    const dayProps = daySection.props as Record<string, unknown>;
    expect(dayProps.id).not.toBe("day-1");
    expect(typeof dayProps.id).toBe("string");
    expect((dayProps.id as string).length).toBeGreaterThan(0);

    const morning = dayProps.morning as Record<string, unknown>[];
    const stayProps = morning[0].props as Record<string, unknown>;
    expect(stayProps.id).not.toBe("stay-1");

    const evening = dayProps.evening as Record<string, unknown>[];
    const activityProps = evening[0].props as Record<string, unknown>;
    expect(activityProps.id).not.toBe("activity-1");

    const headerProps = content[1].props as Record<string, unknown>;
    expect(headerProps.id).not.toBe("header-1");
  });

  it("generates unique IDs across all components", () => {
    const cloned = cloneAndReId(sampleData);
    const content = cloned.content as Record<string, unknown>[];

    const ids = new Set<string>();
    const collectIds = (nodes: unknown[]) => {
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const n = node as Record<string, unknown>;
        const props = n.props as Record<string, unknown> | undefined;
        if (props?.id) ids.add(props.id as string);
        if (props) {
          for (const v of Object.values(props)) {
            if (Array.isArray(v)) collectIds(v);
          }
        }
      }
    };
    collectIds(content);

    expect(ids.size).toBe(4);
  });

  it("applies title override", () => {
    const cloned = cloneAndReId(sampleData, { title: "My Trip" });
    const root = cloned.root as Record<string, unknown>;
    const props = root.props as Record<string, unknown>;
    expect(props.title).toBe("My Trip");
  });

  it("applies documentType override", () => {
    const cloned = cloneAndReId(sampleData, { documentType: "itinerary" });
    const root = cloned.root as Record<string, unknown>;
    const props = root.props as Record<string, unknown>;
    expect(props.documentType).toBe("itinerary");
  });

  it("preserves non-overridden root props", () => {
    const cloned = cloneAndReId(sampleData, { documentType: "itinerary" });
    const root = cloned.root as Record<string, unknown>;
    const props = root.props as Record<string, unknown>;
    expect(props.documentMode).toBe("itinerary");
  });

  it("handles empty content gracefully", () => {
    const empty = { root: { props: { title: "Empty" } }, content: [] };
    const cloned = cloneAndReId(empty);
    expect(cloned.content).toEqual([]);
  });

  it("handles missing content gracefully", () => {
    const noContent = { root: { props: { title: "No content" } } };
    const cloned = cloneAndReId(noContent);
    expect(cloned.content).toBeUndefined();
  });
});
