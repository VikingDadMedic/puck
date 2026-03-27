import type { TravelStudioData } from "./types";

export const mediterraneanCruise: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Mediterranean Cruise Escape",
      documentMode: "itinerary",
      brandTheme: "luxury",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "trip-header-1",
        destination: "Western Mediterranean Cruise",
        dateRange: "June 15 – June 29, 2026",
        heroImage: "",
        travelerCount: 2,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "trip-overview-1",
        summary:
          "Embark on a 14-night journey through the stunning Western Mediterranean. From the glamour of the French Riviera to the ancient ruins of Rome and the sun-drenched shores of the Greek islands, this carefully curated itinerary blends relaxation with cultural discovery.",
        duration: "14 nights",
        highlights: [
          { text: "Private guided tour of the Colosseum and Roman Forum" },
          { text: "Sunset sailing excursion along the Amalfi Coast" },
          { text: "Wine tasting in Provence with a local sommelier" },
          { text: "Exclusive access to the Acropolis at golden hour" },
          { text: "Michelin-starred dining experience onboard" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "day-1",
              label: "Day 1",
              date: "June 15, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "transport-1",
                    type: "flight",
                    flightSearch: null,
                    carrier: {
                      name: "Air France",
                      externalId: "",
                      source: "",
                    },
                    departure: "New York (JFK)",
                    arrival: "Nice (NCE)",
                    timing: {
                      date: "June 15, 2026",
                      time: "7:30 PM",
                      duration: "",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "USD" },
                    flightDetails: {
                      flightNumber: "",
                      terminal: "",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes: "<p>Business class, lounge access included</p>",
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "stay-1",
                    hotel: null,
                    place: null,
                    name: "Hotel Negresco",
                    location: "Nice, France",
                    dates: "June 16–17",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Sea View Suite",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes:
                      "<p>Iconic Belle Époque palace on the Promenade des Anglais</p>",
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "day-2",
              label: "Day 2",
              date: "June 16, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "activity-1",
                    activity: null,
                    event: null,
                    name: "Old Nice Walking Tour",
                    timing: {
                      date: "June 16, 2026",
                      time: "9:00 AM",
                      duration: "3 hours",
                      timezone: "",
                    },
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      provider: {
                        name: "Nice Heritage Walks",
                        externalId: "",
                        source: "",
                      },
                    },
                    description:
                      "<p>Explore the charming streets of Vieux Nice with a local historian. Visit the famous flower market, taste socca, and discover hidden baroque chapels.</p>",
                    imageUrl: "",
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "activity-2",
                    activity: null,
                    event: null,
                    name: "Provence Wine Country Excursion",
                    timing: {
                      date: "June 16, 2026",
                      time: "2:00 PM",
                      duration: "4 hours",
                      timezone: "",
                    },
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Private vineyard tour through the rolling hills of Bellet AOC, one of France's smallest and most exclusive wine regions.</p>",
                    imageUrl: "",
                  },
                },
              ],
              evening: [
                {
                  type: "CruiseCard",
                  props: {
                    id: "cruise-1",
                    name: "MSC Seaview",
                    carrier: {
                      name: "MSC Cruises",
                      externalId: "",
                      source: "",
                    },
                    timing: {
                      date: "June 17, 2026",
                      time: "5:00 PM",
                      duration: "12 nights",
                      timezone: "",
                    },
                    cabinType: "Balcony Suite",
                    cabinNumber: "12042",
                    confirmationNumber: "MSC-78432",
                    price: { amount: 14200, currency: "USD" },
                    notes:
                      "<p>Embarkation from Nice port. Suite includes private balcony and butler service.</p>",
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "day-3",
              label: "Day 3",
              date: "June 17, 2026",
              morning: [],
              afternoon: [],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "restaurant-1",
                    restaurant: null,
                    name: "Le Petit Maison",
                    cuisine: "French Mediterranean",
                    rating: 4.8,
                    imageUrl: "",
                    notes:
                      "<p>Michelin-starred dining experience. Pre-dinner cocktails on the terrace overlooking the port.</p>",
                    timing: {
                      date: "June 17, 2026",
                      time: "8:00 PM",
                      duration: "2 hours",
                      timezone: "",
                    },
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "LPM-9921",
                    },
                  },
                },
              ],
            },
          },
        ],
        sidebar: [
          {
            type: "PricingSummary",
            props: {
              id: "pricing-1",
              currency: "USD",
              basis: "perPerson",
              lineItems: [
                { description: "Flights (Business)", amount: 8400 },
                { description: "Cruise (Suite, 12 nights)", amount: 14200 },
                { description: "Pre-cruise hotel (2 nights)", amount: 1800 },
                { description: "Shore excursions package", amount: 3200 },
                { description: "Travel insurance", amount: 680 },
              ],
              total: 28280,
              notes: "<p>Per person, based on double occupancy</p>",
            },
          },
          {
            type: "IncludedFeatures",
            props: {
              id: "included-1",
              title: "What's Included",
              features: [
                { text: "All flights and transfers", included: true },
                { text: "12-night cruise with balcony suite", included: true },
                { text: "All meals onboard", included: true },
                { text: "5 curated shore excursions", included: true },
                { text: "Travel insurance", included: true },
                { text: "Spa treatments", included: false },
                { text: "Specialty dining surcharges", included: false },
              ],
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "advisor-1",
              content:
                "<p>The Johnsons prefer window-facing dining. Request table 42 in the Grand Dining Room—it has the best sunset view. Also note: Mrs. Johnson is allergic to shellfish, flag this with the maître d'.</p>",
              visibility: "advisor_only",
            },
          },
          {
            type: "PrimaryCTA",
            props: {
              id: "cta-1",
              text: "Reserve This Journey",
              url: "#book",
              variant: "primary",
            },
          },
        ],
      },
    },
    {
      type: "Spacer",
      props: { id: "spacer-1", height: 32 },
    },
    {
      type: "AdvisorInsight",
      props: {
        id: "advisor-2",
        content:
          "<p>Client budget ceiling is $65k for the couple. Current quote is well within range. Upsell opportunity: the Amalfi private yacht experience (+$2,400pp) aligns with their anniversary celebration.</p>",
        visibility: "advisor_only",
      },
    },
  ],
};

export const seedData: Record<string, Partial<TravelStudioData>> = {
  "/trip": mediterraneanCruise,
};
