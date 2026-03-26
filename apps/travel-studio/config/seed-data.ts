import type { Data } from "@/core";

export const mediterraneanCruise: Partial<Data> = {
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
                    carrier: "Air France",
                    departure: "New York (JFK)",
                    arrival: "Nice (NCE)",
                    departureTime: "7:30 PM",
                    arrivalTime: "9:15 AM +1",
                    notes: "Business class, lounge access included",
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "stay-1",
                    name: "Hotel Negresco",
                    location: "Nice, France",
                    dates: "June 16–17",
                    roomType: "Sea View Suite",
                    rating: 5,
                    imageUrl: "",
                    notes:
                      "Iconic Belle Époque palace on the Promenade des Anglais",
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
                    name: "Old Nice Walking Tour",
                    time: "9:00 AM",
                    duration: "3 hours",
                    description:
                      "Explore the charming streets of Vieux Nice with a local historian. Visit the famous flower market, taste socca, and discover hidden baroque chapels.",
                    imageUrl: "",
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "activity-2",
                    name: "Provence Wine Country Excursion",
                    time: "2:00 PM",
                    duration: "4 hours",
                    description:
                      "Private vineyard tour through the rolling hills of Bellet AOC, one of France's smallest and most exclusive wine regions.",
                    imageUrl: "",
                  },
                },
              ],
              evening: [],
            },
          },
        ],
        sidebar: [
          {
            type: "PricingSummary",
            props: {
              id: "pricing-1",
              currency: "USD",
              lineItems: [
                { description: "Flights (Business)", amount: "8,400" },
                { description: "Cruise (Suite, 12 nights)", amount: "14,200" },
                { description: "Pre-cruise hotel (2 nights)", amount: "1,800" },
                { description: "Shore excursions package", amount: "3,200" },
                { description: "Travel insurance", amount: "680" },
              ],
              total: "28,280",
              notes: "Per person, based on double occupancy",
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
                "The Johnsons prefer window-facing dining. Request table 42 in the Grand Dining Room—it has the best sunset view. Also note: Mrs. Johnson is allergic to shellfish, flag this with the maître d'.",
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
          "Client budget ceiling is $65k for the couple. Current quote is well within range. Upsell opportunity: the Amalfi private yacht experience (+$2,400pp) aligns with their anniversary celebration.",
        visibility: "advisor_only",
      },
    },
  ],
};

export const seedData: Record<string, Partial<Data>> = {
  "/trip": mediterraneanCruise,
};
