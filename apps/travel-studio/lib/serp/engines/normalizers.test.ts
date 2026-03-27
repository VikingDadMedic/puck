import { serpFetch } from "../client";
import { searchGoogleEvents } from "./events";
import { searchGoogleFinance } from "./finance";
import { searchHotels } from "./hotels";
import { searchGoogleMapsReviews } from "./maps-reviews";
import { searchYelp } from "./yelp";

jest.mock("../client", () => ({
  serpFetch: jest.fn(),
}));

const mockedSerpFetch = serpFetch as jest.MockedFunction<typeof serpFetch>;

describe("serp engine normalizers", () => {
  beforeEach(() => {
    mockedSerpFetch.mockReset();
  });

  it("normalizes hotel results into the app contract", async () => {
    mockedSerpFetch.mockResolvedValueOnce({
      properties: [
        {
          name: "Hotel Lumiere",
          description: "Paris",
          overall_rating: 4.7,
          hotel_class: 5,
          rate_per_night: { lowest: 420 },
          images: [{ thumbnail: "https://img.example/hotel.jpg" }],
          link: "https://example.com/book",
          amenities: ["WiFi"],
        },
      ],
    } as unknown as Awaited<ReturnType<typeof serpFetch>>);

    const results = await searchHotels({
      destination: "Paris",
      checkIn: "2026-06-01",
      checkOut: "2026-06-05",
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      name: "Hotel Lumiere",
      location: "Paris",
      rating: 4.7,
      stars: 5,
      pricePerNight: "420",
      imageUrl: "https://img.example/hotel.jpg",
      bookingUrl: "https://example.com/book",
      amenities: ["WiFi"],
    });
    expect(mockedSerpFetch).toHaveBeenCalledWith(
      "google_hotels",
      expect.objectContaining({
        q: "Paris",
        check_in_date: "2026-06-01",
      })
    );
  });

  it("normalizes Google Events result fields", async () => {
    mockedSerpFetch.mockResolvedValueOnce({
      events_results: [
        {
          title: "Jazz in Rome",
          description: "Live music",
          date: "2026-06-03",
          address: "Rome Arena",
          link: "https://example.com/event",
          thumbnail: "https://img.example/event.jpg",
        },
      ],
    } as unknown as Awaited<ReturnType<typeof serpFetch>>);

    const results = await searchGoogleEvents({ q: "jazz", location: "rome" });

    expect(results).toEqual([
      {
        id: "event_0_Jazz in Rome",
        title: "Jazz in Rome",
        description: "Live music",
        date: "2026-06-03",
        venue: "Rome Arena",
        link: "https://example.com/event",
        thumbnail: "https://img.example/event.jpg",
      },
    ]);
  });

  it("normalizes maps reviews for string and object users", async () => {
    mockedSerpFetch.mockResolvedValueOnce({
      reviews: [
        {
          user: { name: "Alicia" },
          rating: 5,
          snippet: "Great",
          iso_date: "2026-06-02",
        },
        { user: "Bob", rating: 4, snippet: "Good" },
      ],
    } as unknown as Awaited<ReturnType<typeof serpFetch>>);

    const results = await searchGoogleMapsReviews({ dataId: "abc" });

    expect(results).toEqual([
      {
        id: "greview_0",
        title: "Alicia",
        rating: 5,
        snippet: "Great",
        date: "2026-06-02",
      },
      {
        id: "greview_1",
        title: "Bob",
        rating: 4,
        snippet: "Good",
        date: undefined,
      },
    ]);
  });

  it("returns empty finance list when summary is missing", async () => {
    mockedSerpFetch.mockResolvedValueOnce(
      {} as Awaited<ReturnType<typeof serpFetch>>
    );

    const results = await searchGoogleFinance({ q: "AAPL" });
    expect(results).toEqual([]);
  });

  it("normalizes Yelp review count fallbacks", async () => {
    mockedSerpFetch.mockResolvedValueOnce({
      organic_results: [
        { title: "Cafe 1", snippet: "Nice", rating: 4.2, reviews: 128 },
        { title: "Cafe 2", snippet: "Great", review_count: 98 },
      ],
    } as unknown as Awaited<ReturnType<typeof serpFetch>>);

    const results = await searchYelp({ findLoc: "Paris", findDesc: "cafe" });

    expect(results[0].reviewCount).toBe(128);
    expect(results[1].reviewCount).toBe(98);
  });
});
