import Root from "./root";
import { DocumentSection } from "./components/structural/DocumentSection";
import { DaySection } from "./components/structural/DaySection";
import { SidebarLayout } from "./components/structural/SidebarLayout";
import { CardGroup } from "./components/structural/CardGroup";
import { Spacer } from "./components/structural/Spacer";
import { Divider } from "./components/structural/Divider";
import { TripHeader } from "./components/travel/TripHeader";
import { TripOverview } from "./components/travel/TripOverview";
import { StayCard } from "./components/travel/StayCard";
import { ActivityCard } from "./components/travel/ActivityCard";
import { TransportCard } from "./components/travel/TransportCard";
import { RestaurantCard } from "./components/travel/RestaurantCard";
import { CruiseCard } from "./components/travel/CruiseCard";
import { PricingSummary } from "./components/travel/PricingSummary";
import { AdvisorInsight } from "./components/context/AdvisorInsight";
import { IncludedFeatures } from "./components/context/IncludedFeatures";
import { PrimaryCTA } from "./components/conversion/PrimaryCTA";
import type { TravelStudioConfig } from "./types";

const TRAVEL_CONTENT = [
  "TripHeader",
  "TripOverview",
  "StayCard",
  "ActivityCard",
  "TransportCard",
  "RestaurantCard",
  "CruiseCard",
  "PricingSummary",
  "AdvisorInsight",
  "IncludedFeatures",
  "PrimaryCTA",
  "Spacer",
  "Divider",
];

const CARD_TYPES = [
  "StayCard",
  "ActivityCard",
  "TransportCard",
  "RestaurantCard",
  "CruiseCard",
];

const config: TravelStudioConfig = {
  root: Root,
  categories: {
    structure: {
      title: "Structure",
      components: [
        "DocumentSection",
        "DaySection",
        "SidebarLayout",
        "CardGroup",
        "Spacer",
        "Divider",
      ],
    },
    trip: {
      title: "Trip Content",
      components: [
        "TripHeader",
        "TripOverview",
        "StayCard",
        "ActivityCard",
        "TransportCard",
        "RestaurantCard",
        "CruiseCard",
      ],
    },
    pricing: {
      title: "Pricing",
      components: ["PricingSummary"],
    },
    context: {
      title: "Context",
      components: ["AdvisorInsight", "IncludedFeatures"],
    },
    actions: {
      title: "Actions",
      components: ["PrimaryCTA"],
    },
  },
  components: {
    DocumentSection: {
      ...DocumentSection,
      label: "Section",
      fields: {
        title: { type: "text" },
        content: {
          type: "slot",
          allow: TRAVEL_CONTENT,
        },
      },
    },
    DaySection: {
      ...DaySection,
      label: "Day",
      fields: {
        date: { type: "text", label: "Date" },
        label: { type: "text", label: "Day Label" },
        morning: { type: "slot", allow: CARD_TYPES },
        afternoon: { type: "slot", allow: CARD_TYPES },
        evening: { type: "slot", allow: CARD_TYPES },
      },
    },
    SidebarLayout: {
      ...SidebarLayout,
      label: "Sidebar Layout",
      fields: {
        main: {
          type: "slot",
          allow: [
            "DocumentSection",
            "DaySection",
            "CardGroup",
            ...TRAVEL_CONTENT,
          ],
        },
        sidebar: {
          type: "slot",
          allow: [
            "PricingSummary",
            "IncludedFeatures",
            "AdvisorInsight",
            "PrimaryCTA",
            "Spacer",
            "Divider",
          ],
        },
      },
    },
    CardGroup: {
      ...CardGroup,
      label: "Card Group",
      fields: {
        title: { type: "text" },
        items: { type: "slot", allow: CARD_TYPES },
      },
    },
    Spacer,
    Divider,
    TripHeader: { ...TripHeader, label: "Trip Header" },
    TripOverview: { ...TripOverview, label: "Trip Overview" },
    StayCard: { ...StayCard, label: "Stay / Hotel" },
    ActivityCard: { ...ActivityCard, label: "Activity" },
    TransportCard: { ...TransportCard, label: "Transport" },
    RestaurantCard: { ...RestaurantCard, label: "Restaurant / Dining" },
    CruiseCard: { ...CruiseCard, label: "Cruise" },
    PricingSummary: { ...PricingSummary, label: "Pricing Summary" },
    AdvisorInsight: { ...AdvisorInsight, label: "Advisor Insight" },
    IncludedFeatures: { ...IncludedFeatures, label: "Included Features" },
    PrimaryCTA: { ...PrimaryCTA, label: "Call to Action" },
  },
};

export default config;
