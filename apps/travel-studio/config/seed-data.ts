import type { TravelStudioData } from "./types";

export const mediterraneanCruise: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Mediterranean Cruise Escape",
      documentMode: "itinerary",
      documentType: "template",
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
          "<p>Embark on a 14-night journey through the stunning Western Mediterranean. From the glamour of the French Riviera to the ancient ruins of Rome and the sun-drenched shores of the Greek islands, this carefully curated itinerary blends relaxation with cultural discovery.</p>",
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
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "Air France",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
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
                    departureCoordinates: { lat: 40.6413, lng: -73.7781 },
                    arrivalCoordinates: { lat: 43.6584, lng: 7.2156 },
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
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "USD" },
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
                    coordinates: { lat: 43.6951, lng: 7.2617 },
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
                    price: { amount: 0, currency: "USD" },
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
                    coordinates: { lat: 43.6977, lng: 7.272 },
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
                    price: { amount: 0, currency: "USD" },
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
                    coordinates: { lat: 43.7102, lng: 7.262 },
                  },
                },
              ],
              evening: [
                {
                  type: "CruiseCard",
                  props: {
                    id: "cruise-1",
                    type: "departure",
                    name: "MSC Seaview",
                    carrier: {
                      name: "MSC Cruises",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    price: { amount: 0, currency: "EUR" },
                    coordinates: { lat: 43.696, lng: 7.27 },
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

export const weekendCityBreak: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Weekend in Paris",
      documentMode: "itinerary",
      documentType: "template",
      brandTheme: "default",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "cb-header-1",
        destination: "Paris, France",
        dateRange: "March 14 – March 16, 2026",
        heroImage: "",
        travelerCount: 2,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "cb-overview-1",
        summary:
          "<p>A perfect weekend escape to the City of Light. From world-class museums to charming café culture, experience the best of Paris in just two unforgettable days.</p>",
        duration: "2 nights",
        highlights: [
          { text: "Skip-the-line entry to the Louvre Museum" },
          { text: "Stroll the Champs-Élysées and Arc de Triomphe" },
          { text: "Explore the artistic quarter of Montmartre" },
          { text: "Dinner at the Eiffel Tower's Le Jules Verne" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "cb-sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "cb-day-1",
              label: "Day 1",
              date: "April 12, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "cb-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "EUR" },
                    name: "Louvre Museum",
                    timing: {
                      date: "April 12, 2026",
                      time: "9:30 AM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Skip-the-line guided tour of the world's largest art museum. Highlights include the Mona Lisa, Winged Victory, and Venus de Milo.</p>",
                    imageUrl: "",
                    coordinates: { lat: 48.8606, lng: 2.3376 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "cb-activity-2",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "EUR" },
                    name: "Champs-Élysées",
                    timing: {
                      date: "April 12, 2026",
                      time: "2:00 PM",
                      duration: "2.5 hours",
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
                      "<p>Stroll down the famous avenue from the Arc de Triomphe to Place de la Concorde. Shopping and café stops along the way.</p>",
                    imageUrl: "",
                    coordinates: { lat: 48.8698, lng: 2.3075 },
                  },
                },
              ],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "cb-restaurant-1",
                    restaurant: null,
                    name: "Le Jules Verne",
                    cuisine: "French",
                    rating: 4.7,
                    imageUrl: "",
                    notes:
                      "<p>Michelin-starred restaurant on the second floor of the Eiffel Tower. Reservations required well in advance.</p>",
                    timing: {
                      date: "April 12, 2026",
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
                      confirmationNumber: "",
                      provider: { name: "", externalId: "", source: "" },
                    },
                    price: { amount: 0, currency: "EUR" },
                    coordinates: { lat: 48.8584, lng: 2.2945 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "cb-day-2",
              label: "Day 2",
              date: "April 13, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "cb-activity-3",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "EUR" },
                    name: "Montmartre",
                    timing: {
                      date: "April 13, 2026",
                      time: "10:00 AM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Explore the artistic hilltop village of Montmartre. Visit the Sacré-Cœur basilica, Place du Tertre, and the Montmartre vineyard.</p>",
                    imageUrl: "",
                    coordinates: { lat: 48.8867, lng: 2.3431 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "cb-restaurant-2",
                    restaurant: null,
                    name: "Le Comptoir du Panthéon",
                    cuisine: "French Bistro",
                    rating: 4.5,
                    imageUrl: "",
                    notes:
                      "<p>Classic Parisian bistro in the Latin Quarter. Known for its seasonal prix fixe menu and excellent wine selection.</p>",
                    timing: {
                      date: "March 15, 2026",
                      time: "7:30 PM",
                      duration: "2 hours",
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
                    price: { amount: 0, currency: "EUR" },
                    coordinates: { lat: 48.8462, lng: 2.3464 },
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
              id: "cb-pricing-1",
              currency: "EUR",
              basis: "perPerson",
              lineItems: [
                {
                  description: "Louvre Museum skip-the-line tour",
                  amount: 120,
                },
                { description: "Hotel (2 nights)", amount: 1600 },
                { description: "Dining & restaurants", amount: 680 },
              ],
              total: 2400,
              notes: "<p>Per person, excluding flights</p>",
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "cb-advisor-1",
              content:
                "<p>Paris Métro passes are the most efficient way to get between sites. Consider the Paris Museum Pass for skip-the-line access at major attractions. Book restaurants at least 2 weeks in advance for weekend dining.</p>",
              visibility: "client_visible",
            },
          },
          {
            type: "PrimaryCTA",
            props: {
              id: "cb-cta-1",
              text: "Book This Trip",
              url: "#",
              variant: "primary",
            },
          },
        ],
      },
    },
  ],
};

export const businessProposal: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Tokyo Client Meeting",
      documentMode: "proposal",
      documentType: "template",
      brandTheme: "default",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "bp-header-1",
        destination: "Tokyo, Japan",
        dateRange: "May 4 – May 8, 2026",
        heroImage: "",
        travelerCount: 1,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "bp-overview-1",
        summary:
          "<p>A focused 4-night business trip to Tokyo for the Q2 client strategy review. Accommodation in Shinjuku provides proximity to the client's Nishi-Shinjuku offices while offering easy access to evening entertainment in Shibuya and Roppongi.</p>",
        duration: "4 nights",
        highlights: [
          { text: "Client strategy session at Nishi-Shinjuku HQ" },
          { text: "Executive dinner at Sukiyabashi Jiro (Roppongi Hills)" },
          { text: "Optional cultural half-day: Meiji Shrine & Harajuku" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "bp-sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "bp-day-1",
              label: "Day 1 – Travel",
              date: "May 4, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "bp-transport-1",
                    type: "flight",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "Japan Airlines",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Los Angeles (LAX)",
                    arrival: "Tokyo Narita (NRT)",
                    timing: {
                      date: "May 4, 2026",
                      time: "11:15 AM",
                      duration: "11h 30m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "USD" },
                    flightDetails: {
                      flightNumber: "JL 015",
                      terminal: "B",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes: "<p>Business class, Sakura Lounge access</p>",
                    departureCoordinates: { lat: 33.9425, lng: -118.408 },
                    arrivalCoordinates: { lat: 35.7647, lng: 140.3864 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "bp-stay-1",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "USD" },
                    name: "Park Hyatt Tokyo",
                    location: "Shinjuku, Tokyo",
                    dates: "May 4–8",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Park King",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes:
                      "<p>47th floor room with Mount Fuji view. Club lounge access included.</p>",
                    coordinates: { lat: 35.6855, lng: 139.6906 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "bp-day-2",
              label: "Day 2",
              date: "October 21, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "bp-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Client Presentation — Shibuya Office",
                    timing: {
                      date: "October 21, 2026",
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
                        name: "Voyager Corporate",
                        externalId: "",
                        source: "",
                      },
                    },
                    description:
                      "<p>Main strategy presentation to the Tokyo leadership team. Conference room reserved at client's Shibuya crossing office. AV equipment and translation services confirmed.</p>",
                    imageUrl: "",
                    coordinates: { lat: 35.6595, lng: 139.7004 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "bp-restaurant-1",
                    restaurant: null,
                    name: "Sukiyabashi Jiro",
                    cuisine: "Omakase Sushi",
                    rating: 4.9,
                    imageUrl: "",
                    notes:
                      "<p>Intimate 10-seat omakase experience. Client dinner with the Tokyo team. Reservation confirmed for party of 6.</p>",
                    timing: {
                      date: "October 21, 2026",
                      time: "7:00 PM",
                      duration: "2 hours",
                      timezone: "",
                    },
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "SJ-4421",
                      provider: { name: "", externalId: "", source: "" },
                    },
                    price: { amount: 0, currency: "USD" },
                    coordinates: { lat: 35.6717, lng: 139.7639 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "bp-day-3",
              label: "Day 3",
              date: "October 22, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "bp-transport-2",
                    type: "flight",
                    leg: "arrival",
                    flightSearch: null,
                    carrier: {
                      name: "Japan Airlines",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Tokyo (NRT)",
                    arrival: "Los Angeles (LAX)",
                    timing: {
                      date: "October 22, 2026",
                      time: "11:00 AM",
                      duration: "10h 30m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "USD" },
                    flightDetails: {
                      flightNumber: "JL 016",
                      terminal: "Terminal 2",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes:
                      "<p>Return flight. Business class, lounge access at NRT Terminal 2.</p>",
                    departureCoordinates: { lat: 35.7647, lng: 140.3864 },
                    arrivalCoordinates: { lat: 33.9425, lng: -118.4081 },
                  },
                },
              ],
              afternoon: [],
              evening: [],
            },
          },
        ],
        sidebar: [
          {
            type: "PricingSummary",
            props: {
              id: "bp-pricing-1",
              currency: "USD",
              basis: "perPerson",
              lineItems: [
                { description: "Flights (Business, roundtrip)", amount: 4800 },
                { description: "Park Hyatt Tokyo (4 nights)", amount: 2400 },
                { description: "Ground transportation", amount: 600 },
                { description: "Client dining & entertainment", amount: 700 },
              ],
              total: 8500,
              notes:
                "<p>All expenses pre-approved per corporate travel policy</p>",
            },
          },
          {
            type: "PrimaryCTA",
            props: {
              id: "bp-cta-1",
              text: "Approve Itinerary",
              url: "#approve",
              variant: "primary",
            },
          },
        ],
      },
    },
  ],
};

export const cruiseItinerary: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Greek Islands Cruise",
      documentMode: "itinerary",
      documentType: "template",
      brandTheme: "luxury",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "gi-header-1",
        destination: "Greek Islands",
        dateRange: "September 10 – September 17, 2026",
        heroImage: "",
        travelerCount: 2,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "gi-overview-1",
        summary:
          "<p>Set sail through the azure waters of the Aegean Sea on a 7-night cruise exploring the most iconic Greek islands. From the dramatic cliffs of Santorini to the vibrant nightlife of Mykonos, this voyage combines ancient history with modern luxury.</p>",
        duration: "7 nights",
        highlights: [
          { text: "Sunset views from Oia village in Santorini" },
          { text: "Explore the ancient ruins of Akrotiri" },
          { text: "Island-hop to Delos, birthplace of Apollo" },
          {
            text: "Wander the charming streets of Little Venice, Mykonos",
          },
          { text: "Onboard dining at Interni Restaurant" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "gi-sidebar-1",
        main: [
          {
            type: "CruiseCard",
            props: {
              id: "gi-cruise-1",
              type: "departure",
              name: "Odyssey of the Seas",
              carrier: {
                name: "Royal Caribbean",
                externalId: "",
                source: "",
              },
              bookedThrough: { name: "", externalId: "", source: "" },
              timing: {
                date: "September 10, 2026",
                time: "4:00 PM",
                duration: "7 nights",
                timezone: "",
              },
              cabinType: "Ocean View Suite",
              cabinNumber: "9514",
              confirmationNumber: "RC-44210",
              price: { amount: 6800, currency: "USD" },
              notes:
                "<p>Embarkation from Piraeus (Athens). Suite includes private balcony, priority boarding, and concierge service.</p>",
            },
          },
          {
            type: "DaySection",
            props: {
              id: "gi-day-1",
              label: "Day 3 – Santorini",
              date: "September 12, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "gi-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Oia Village & Caldera Walk",
                    timing: {
                      date: "September 12, 2026",
                      time: "9:00 AM",
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
                      "<p>Private guided walk through the iconic white-washed village of Oia. Includes a caldera-edge hike with panoramic views of the volcanic crater and Aegean Sea.</p>",
                    imageUrl: "",
                    coordinates: { lat: 36.4618, lng: 25.3753 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "gi-activity-2",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Akrotiri Archaeological Site",
                    timing: {
                      date: "September 12, 2026",
                      time: "2:30 PM",
                      duration: "2 hours",
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
                      '<p>Explore the Minoan Bronze Age settlement preserved under volcanic ash—often called the "Pompeii of the Aegean."</p>',
                    imageUrl: "",
                    coordinates: { lat: 36.3517, lng: 25.4036 },
                  },
                },
              ],
              evening: [],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "gi-day-2",
              label: "Day 5 – Mykonos",
              date: "September 14, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "gi-activity-3",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Delos Island Excursion",
                    timing: {
                      date: "September 14, 2026",
                      time: "8:30 AM",
                      duration: "5 hours",
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
                      "<p>Ferry to the sacred island of Delos, birthplace of Apollo and Artemis. Guided tour of the UNESCO World Heritage archaeological site.</p>",
                    imageUrl: "",
                    coordinates: { lat: 37.3966, lng: 25.2684 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "gi-activity-4",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Little Venice & Windmills",
                    timing: {
                      date: "September 14, 2026",
                      time: "3:00 PM",
                      duration: "2 hours",
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
                      "<p>Wander the colorful waterfront of Little Venice and photograph the iconic Kato Mili windmills at sunset.</p>",
                    imageUrl: "",
                    coordinates: { lat: 37.4467, lng: 25.3253 },
                  },
                },
              ],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "gi-restaurant-1",
                    restaurant: null,
                    name: "Interni Restaurant",
                    cuisine: "Greek Contemporary",
                    rating: 4.6,
                    imageUrl: "",
                    notes:
                      "<p>Open-air courtyard dining in Mykonos Town. Known for creative Mediterranean plates and craft cocktails.</p>",
                    timing: {
                      date: "September 14, 2026",
                      time: "8:30 PM",
                      duration: "2 hours",
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
                    price: { amount: 0, currency: "EUR" },
                    coordinates: { lat: 37.4455, lng: 25.3265 },
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
              id: "gi-pricing-1",
              currency: "USD",
              basis: "perPerson",
              lineItems: [
                {
                  description: "Cruise (Ocean View Suite, 7 nights)",
                  amount: 6800,
                },
                { description: "Shore excursion package", amount: 1200 },
                { description: "Beverage package", amount: 680 },
                { description: "Travel insurance", amount: 420 },
              ],
              total: 9100,
              notes:
                "<p>Per person, based on double occupancy. Flights not included.</p>",
            },
          },
          {
            type: "IncludedFeatures",
            props: {
              id: "gi-included-1",
              title: "What's Included",
              features: [
                {
                  text: "7-night cruise with ocean view suite",
                  included: true,
                },
                { text: "All meals in main dining room", included: true },
                {
                  text: "Guided shore excursions at each port",
                  included: true,
                },
                { text: "Onboard entertainment & pool access", included: true },
                { text: "Specialty restaurant dining", included: false },
                { text: "Spa & wellness treatments", included: false },
              ],
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "gi-advisor-1",
              content:
                "<p>Pack light layers for island excursions — temperatures can vary between ports. Book shore excursions early as popular tours sell out quickly. The ship provides towels and snorkeling gear for beach stops.</p>",
              visibility: "client_visible",
            },
          },
        ],
      },
    },
  ],
};

export const familyBeach: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Cancun Family Getaway",
      documentMode: "itinerary",
      documentType: "template",
      brandTheme: "adventure",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "fb-header-1",
        destination: "Cancun, Mexico",
        dateRange: "July 5 – July 12, 2026",
        heroImage: "",
        travelerCount: 4,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "fb-overview-1",
        summary:
          "A week-long family-friendly beach vacation on Mexico's Caribbean coast. Combine resort relaxation with cultural excursions to ancient Mayan ruins, cenote swims, and hands-on cooking classes — all designed for parents and kids to enjoy together.",
        duration: "7 nights",
        highlights: [
          { text: "Supervised kids club with daily activities (ages 4–12)" },
          { text: "Snorkeling at Isla Mujeres coral reefs" },
          { text: "Guided day trip to Chichen Itza" },
          { text: "Family Mexican cooking class" },
          { text: "Beach games and watersport sessions" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "fb-sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "fb-day-1",
              label: "Day 1 – Arrival",
              date: "July 5, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "fb-transport-1",
                    type: "flight",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "American Airlines",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Dallas/Fort Worth (DFW)",
                    arrival: "Cancun (CUN)",
                    timing: {
                      date: "July 5, 2026",
                      time: "8:45 AM",
                      duration: "3h 10m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "USD" },
                    flightDetails: {
                      flightNumber: "AA 1294",
                      terminal: "C",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes:
                      "<p>Family of 4, economy plus with extra legroom</p>",
                    departureCoordinates: { lat: 32.8998, lng: -97.0403 },
                    arrivalCoordinates: { lat: 21.0365, lng: -86.877 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "fb-stay-1",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "USD" },
                    name: "Grand Fiesta Americana Coral Beach",
                    location: "Cancun Hotel Zone",
                    dates: "July 5–12",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Family Suite — Ocean View",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes:
                      "<p>All-inclusive family suite with separate kids' sleeping area. Direct beach access and kids club on-site.</p>",
                    coordinates: { lat: 21.1356, lng: -86.7518 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "fb-day-3",
              label: "Day 3 – Excursion",
              date: "July 7, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "fb-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Chichen Itza Day Trip",
                    timing: {
                      date: "July 7, 2026",
                      time: "6:30 AM",
                      duration: "10 hours",
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
                        name: "Cancun Adventures",
                        externalId: "",
                        source: "",
                      },
                    },
                    description:
                      "<p>Early departure to beat the heat. Private guide explains the history of El Castillo and the Great Ball Court in a kid-friendly way. Includes lunch at a local hacienda.</p>",
                    imageUrl: "",
                    coordinates: { lat: 20.6843, lng: -88.5678 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "fb-activity-2",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Cenote Swimming",
                    timing: {
                      date: "July 7, 2026",
                      time: "2:00 PM",
                      duration: "2 hours",
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
                      "<p>Cool off in a stunning underground cenote on the return drive. Life jackets provided for children — suitable for all ages.</p>",
                    imageUrl: "",
                    coordinates: { lat: 20.73, lng: -88.51 },
                  },
                },
              ],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "fb-restaurant-1",
                    restaurant: null,
                    name: "Puerto Madero Cancun",
                    cuisine: "Seafood",
                    rating: 4.6,
                    imageUrl: "",
                    notes:
                      "<p>Lagoon-side dining with a dedicated kids' menu. Reserve the terrace table for sunset views over Nichupté Lagoon.</p>",
                    timing: {
                      date: "July 7, 2026",
                      time: "7:30 PM",
                      duration: "1.5 hours",
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
                    price: { amount: 0, currency: "USD" },
                    coordinates: { lat: 21.1325, lng: -86.751 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "fb-day-5",
              label: "Day 5 – Beach & Water",
              date: "July 9, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "fb-activity-3",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Snorkeling at Isla Mujeres",
                    timing: {
                      date: "July 9, 2026",
                      time: "8:00 AM",
                      duration: "5 hours",
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
                        name: "Isla Mujeres Snorkel Tours",
                        externalId: "",
                        source: "",
                      },
                    },
                    description:
                      "<p>Catamaran ride to Isla Mujeres with guided snorkeling over the MUSA underwater sculpture garden. Equipment and life vests included for all ages.</p>",
                    imageUrl: "",
                    coordinates: { lat: 21.232, lng: -86.7316 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "fb-activity-4",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Family Cooking Class — Mexican Cuisine",
                    timing: {
                      date: "July 9, 2026",
                      time: "3:00 PM",
                      duration: "2.5 hours",
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
                        name: "Cancun Cooking School",
                        externalId: "",
                        source: "",
                      },
                    },
                    description:
                      "<p>Hands-on class making tacos, guacamole, and churros. Kid-friendly stations with aprons and chef hats. Take home recipe cards.</p>",
                    imageUrl: "",
                    coordinates: { lat: 21.161, lng: -86.8235 },
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
              id: "fb-pricing-1",
              currency: "USD",
              basis: "total",
              lineItems: [
                { description: "Flights (family of 4)", amount: 3200 },
                {
                  description: "Resort (7 nights, family suite)",
                  amount: 4900,
                },
                { description: "Excursions package", amount: 1200 },
                { description: "Travel insurance", amount: 480 },
              ],
              total: 9780,
              notes: "<p>Total for family of 4, all-inclusive resort</p>",
            },
          },
          {
            type: "IncludedFeatures",
            props: {
              id: "fb-included-1",
              title: "What's Included",
              features: [
                { text: "All meals and drinks at resort", included: true },
                { text: "Airport transfers", included: true },
                { text: "Kids club ages 4–12", included: true },
                { text: "Beach towels and chairs", included: true },
                { text: "Snorkeling equipment", included: true },
                { text: "Spa access for adults", included: false },
              ],
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "fb-advisor-1",
              content:
                "<p>Pack reef-safe sunscreen — it's required in Mexican national parks and cenotes. Book the Chichen Itza tour for the earliest departure to avoid afternoon heat. The resort's kids club runs 9am–5pm daily with supervised activities.</p>",
              visibility: "client_visible",
            },
          },
        ],
      },
    },
  ],
};

export const railEurope: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "European Rail Adventure",
      documentMode: "itinerary",
      documentType: "template",
      brandTheme: "default",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "re-header-1",
        destination: "Paris – Amsterdam – Berlin – Prague",
        dateRange: "September 1 – September 11, 2026",
        heroImage: "",
        travelerCount: 2,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "re-overview-1",
        summary:
          "<p>A 10-night rail journey through four of Europe's most captivating capitals. Travel by high-speed train from the boulevards of Paris to the canals of Amsterdam, the vibrant streets of Berlin, and the fairy-tale spires of Prague — all connected by some of the continent's most scenic rail routes.</p>",
        duration: "10 nights",
        highlights: [
          { text: "Eiffel Tower" },
          { text: "Anne Frank House" },
          { text: "Berlin Wall" },
          { text: "Prague Castle" },
          { text: "Scenic train routes" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "re-sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "re-day-1",
              label: "Day 1 – Paris",
              date: "September 1, 2026",
              morning: [
                {
                  type: "StayCard",
                  props: {
                    id: "re-stay-1",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "EUR" },
                    name: "Hôtel Le Marais",
                    location: "Paris, France",
                    dates: "September 1–3",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Deluxe Double",
                    },
                    rating: 4,
                    imageUrl: "",
                    notes: "",
                    coordinates: { lat: 48.8566, lng: 2.3522 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "re-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "EUR" },
                    name: "Eiffel Tower & Seine River Cruise",
                    timing: {
                      date: "September 1, 2026",
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
                      "<p>Ascend the Eiffel Tower for panoramic views of Paris, then board a Seine river cruise past Notre-Dame, the Louvre, and Musée d'Orsay.</p>",
                    imageUrl: "",
                    coordinates: { lat: 48.8584, lng: 2.2945 },
                  },
                },
              ],
              evening: [],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "re-day-4",
              label: "Day 4 – Paris → Amsterdam",
              date: "September 4, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "re-transport-1",
                    type: "train",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "Thalys",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Paris Gare du Nord",
                    arrival: "Amsterdam Centraal",
                    timing: {
                      date: "September 4, 2026",
                      time: "8:25 AM",
                      duration: "3h 20m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "EUR" },
                    flightDetails: {
                      flightNumber: "",
                      terminal: "",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "THA 9321" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes: "",
                    departureCoordinates: { lat: 48.8809, lng: 2.3553 },
                    arrivalCoordinates: { lat: 52.3791, lng: 4.9003 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "re-stay-2",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "EUR" },
                    name: "Hotel V Nesplein",
                    location: "Amsterdam, Netherlands",
                    dates: "September 4–5",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Superior Double",
                    },
                    rating: 4,
                    imageUrl: "",
                    notes: "",
                    coordinates: { lat: 52.3731, lng: 4.8932 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "re-day-6",
              label: "Day 6 – Amsterdam → Berlin",
              date: "September 6, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "re-transport-2",
                    type: "train",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "ICE",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Amsterdam Centraal",
                    arrival: "Berlin Hauptbahnhof",
                    timing: {
                      date: "September 6, 2026",
                      time: "9:00 AM",
                      duration: "6h 15m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "EUR" },
                    flightDetails: {
                      flightNumber: "",
                      terminal: "",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "ICE 240" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes: "",
                    departureCoordinates: { lat: 52.3791, lng: 4.9003 },
                    arrivalCoordinates: { lat: 52.5251, lng: 13.3694 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "re-stay-3",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "EUR" },
                    name: "Hotel Adlon Kempinski",
                    location: "Berlin, Germany",
                    dates: "September 6–8",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Deluxe Room",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes: "",
                    coordinates: { lat: 52.5163, lng: 13.3796 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "re-day-9",
              label: "Day 9 – Berlin → Prague",
              date: "September 9, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "re-transport-3",
                    type: "train",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "EuroCity",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Berlin Hauptbahnhof",
                    arrival: "Praha hlavní nádraží",
                    timing: {
                      date: "September 9, 2026",
                      time: "8:30 AM",
                      duration: "4h 30m",
                      timezone: "",
                    },
                    price: { amount: 0, currency: "EUR" },
                    flightDetails: {
                      flightNumber: "",
                      terminal: "",
                      gate: "",
                      seatTicketDetails: "",
                    },
                    trainDetails: { trainNumber: "EC 171" },
                    otherDetails: { number: "" },
                    carRentalDetails: { leg: "pickUp" },
                    confirmationNumber: "",
                    notes: "",
                    departureCoordinates: { lat: 52.5251, lng: 13.3694 },
                    arrivalCoordinates: { lat: 50.0833, lng: 14.435 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "re-activity-2",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "EUR" },
                    name: "Prague Castle & Old Town Walk",
                    timing: {
                      date: "September 9, 2026",
                      time: "2:00 PM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Guided tour of the Prague Castle complex followed by a walk across Charles Bridge into the Old Town Square.</p>",
                    imageUrl: "",
                    coordinates: { lat: 50.0905, lng: 14.4006 },
                  },
                },
              ],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "re-stay-4",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "EUR" },
                    name: "Aria Hotel Prague",
                    location: "Prague, Czech Republic",
                    dates: "September 9–10",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Deluxe Room",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes: "",
                    coordinates: { lat: 50.0882, lng: 14.4005 },
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
              id: "re-pricing-1",
              currency: "EUR",
              basis: "perPerson",
              lineItems: [
                { description: "Eurail Global Pass (10 days)", amount: 680 },
                { description: "Hotels (10 nights)", amount: 3200 },
                { description: "City tours & excursions", amount: 450 },
                { description: "Travel insurance", amount: 180 },
              ],
              total: 4510,
              notes: "<p>Per person, based on double occupancy</p>",
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "re-advisor-1",
              content:
                "<p>Seat reservations are mandatory on Thalys and recommended on ICE services — book these as soon as the schedule opens. Arrive at major stations 20 minutes early to locate your platform. Eurail Pass holders still need to pay the reservation supplement on Thalys (around €30). Keep digital copies of all reservations in case of spot checks.</p>",
              visibility: "client_visible",
            },
          },
        ],
      },
    },
  ],
};

export const honeymoon: Partial<TravelStudioData> = {
  root: {
    props: {
      title: "Maldives Honeymoon",
      documentMode: "proposal",
      documentType: "template",
      brandTheme: "luxury",
    },
  },
  content: [
    {
      type: "TripHeader",
      props: {
        id: "hm-header-1",
        destination: "Maldives",
        dateRange: "January 10 – January 20, 2026",
        heroImage: "",
        travelerCount: 2,
      },
    },
    {
      type: "TripOverview",
      props: {
        id: "hm-overview-1",
        summary:
          "<p>A romantic 10-night overwater villa honeymoon in the Maldives. Crystal-clear lagoons, world-class diving, private dining under the stars, and spa rituals designed for two — the ultimate escape to celebrate your new beginning.</p>",
        duration: "10 nights",
        highlights: [
          { text: "Overwater villa" },
          { text: "Private dining" },
          { text: "Sunset cruise" },
          { text: "Couples spa" },
          { text: "Scuba diving" },
        ],
      },
    },
    {
      type: "SidebarLayout",
      props: {
        id: "hm-sidebar-1",
        main: [
          {
            type: "DaySection",
            props: {
              id: "hm-day-1",
              label: "Day 1 – Arrival",
              date: "January 10, 2026",
              morning: [
                {
                  type: "TransportCard",
                  props: {
                    id: "hm-transport-1",
                    type: "flight",
                    leg: "departure",
                    flightSearch: null,
                    carrier: {
                      name: "Emirates",
                      externalId: "",
                      source: "",
                    },
                    bookedThrough: { name: "", externalId: "", source: "" },
                    departure: "Dubai (DXB)",
                    arrival: "Malé (MLE)",
                    timing: {
                      date: "January 10, 2026",
                      time: "9:30 AM",
                      duration: "4h 15m",
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
                    notes: "",
                    departureCoordinates: { lat: 25.2532, lng: 55.3657 },
                    arrivalCoordinates: { lat: 4.1918, lng: 73.529 },
                  },
                },
              ],
              afternoon: [],
              evening: [
                {
                  type: "StayCard",
                  props: {
                    id: "hm-stay-1",
                    hotel: null,
                    place: null,
                    type: "checkIn",
                    timing: { date: "", time: "", duration: "", timezone: "" },
                    price: { amount: 0, currency: "USD" },
                    name: "Conrad Maldives Rangali Island",
                    location: "Rangali Island, Maldives",
                    dates: "January 10–19",
                    details: {
                      bookedThrough: {
                        name: "",
                        externalId: "",
                        source: "",
                      },
                      confirmationNumber: "",
                      roomBedType: "Overwater Villa with Pool",
                    },
                    rating: 5,
                    imageUrl: "",
                    notes: "",
                    coordinates: { lat: 3.588, lng: 72.759 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "hm-day-3",
              label: "Day 3 – Romance",
              date: "January 12, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "hm-activity-1",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Private Sunset Cruise",
                    timing: {
                      date: "January 12, 2026",
                      time: "5:00 PM",
                      duration: "2 hours",
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
                      "<p>A private dhoni cruise through the atoll at golden hour, with champagne and canapés as the sun dips below the Indian Ocean horizon.</p>",
                    imageUrl: "",
                    coordinates: { lat: 3.591, lng: 72.756 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "hm-activity-2",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Couples Spa — Ocean Pavilion",
                    timing: {
                      date: "January 12, 2026",
                      time: "2:00 PM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Side-by-side treatments in an overwater spa pavilion with glass floors revealing the reef below. Includes aromatherapy massage, body scrub, and floral bath.</p>",
                    imageUrl: "",
                    coordinates: { lat: 3.588, lng: 72.759 },
                  },
                },
              ],
              evening: [
                {
                  type: "RestaurantCard",
                  props: {
                    id: "hm-restaurant-1",
                    restaurant: null,
                    name: "Ithaa Undersea Restaurant",
                    cuisine: "Seafood",
                    rating: 4.9,
                    imageUrl: "",
                    notes:
                      "<p>The world's first all-glass undersea restaurant, 5 meters below the Indian Ocean. Prix fixe 6-course tasting menu.</p>",
                    timing: {
                      date: "January 12, 2026",
                      time: "7:30 PM",
                      duration: "2.5 hours",
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
                    price: { amount: 0, currency: "USD" },
                    coordinates: { lat: 3.5875, lng: 72.7585 },
                  },
                },
              ],
            },
          },
          {
            type: "DaySection",
            props: {
              id: "hm-day-7",
              label: "Day 7 – Adventure",
              date: "January 16, 2026",
              morning: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "hm-activity-3",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Scuba Diving — Manta Point",
                    timing: {
                      date: "January 16, 2026",
                      time: "8:00 AM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>Guided two-tank dive at Manta Point, one of the Maldives' premier sites for encountering reef manta rays and vibrant coral formations.</p>",
                    imageUrl: "",
                    coordinates: { lat: 3.565, lng: 72.74 },
                  },
                },
              ],
              afternoon: [
                {
                  type: "ActivityCard",
                  props: {
                    id: "hm-activity-4",
                    activity: null,
                    event: null,
                    price: { amount: 0, currency: "USD" },
                    name: "Private Beach Picnic",
                    timing: {
                      date: "January 16, 2026",
                      time: "12:30 PM",
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
                      provider: { name: "", externalId: "", source: "" },
                    },
                    description:
                      "<p>A secluded sandbank picnic set up exclusively for two, with grilled seafood, tropical fruits, and snorkeling gear for the surrounding house reef.</p>",
                    imageUrl: "",
                    coordinates: { lat: 3.592, lng: 72.761 },
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
              id: "hm-pricing-1",
              currency: "USD",
              basis: "perPerson",
              lineItems: [
                { description: "Flights (Business)", amount: 6800 },
                { description: "Overwater Villa (10 nights)", amount: 15200 },
                { description: "Dining package (full board)", amount: 2800 },
                { description: "Excursions & spa", amount: 3400 },
                { description: "Seaplane transfers", amount: 1200 },
              ],
              total: 29400,
              notes: "<p>Per person, all-inclusive luxury package</p>",
            },
          },
          {
            type: "AdvisorInsight",
            props: {
              id: "hm-advisor-1",
              content:
                "<p>The Maldives is best visited November through April for dry season. Seaplane transfers operate only during daylight hours — arrivals after 3pm require an overnight in Malé. Pack reef-safe sunscreen and modest clothing for island village visits.</p>",
              visibility: "client_visible",
            },
          },
          {
            type: "PrimaryCTA",
            props: {
              id: "hm-cta-1",
              text: "Confirm Reservation",
              url: "#",
              variant: "primary",
            },
          },
        ],
      },
    },
  ],
};

export const seedData: Record<string, Partial<TravelStudioData>> = {
  "/trip": mediterraneanCruise,
  "/city-break": weekendCityBreak,
  "/business-proposal": businessProposal,
  "/cruise-adventure": cruiseItinerary,
  "/family-beach": familyBeach,
  "/rail-europe": railEurope,
  "/honeymoon": honeymoon,
};
