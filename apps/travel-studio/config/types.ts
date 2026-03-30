import type { Config, Data } from "@/core";
import type { RootProps } from "./root";
import type { DocumentSectionProps } from "./components/structural/DocumentSection";
import type { DaySectionProps } from "./components/structural/DaySection";
import type { SidebarLayoutProps } from "./components/structural/SidebarLayout";
import type { CardGroupProps } from "./components/structural/CardGroup";
import type { SpacerProps } from "./components/structural/Spacer";
import type { DividerProps } from "./components/structural/Divider";
import type { TripHeaderProps } from "./components/travel/TripHeader";
import type { TripOverviewProps } from "./components/travel/TripOverview";
import type { StayCardProps } from "./components/travel/StayCard";
import type { ActivityCardProps } from "./components/travel/ActivityCard";
import type { TransportCardProps } from "./components/travel/TransportCard";
import type { RestaurantCardProps } from "./components/travel/RestaurantCard";
import type { CruiseCardProps } from "./components/travel/CruiseCard";
import type { InfoCardProps } from "./components/travel/InfoCard";
import type { TourCardProps } from "./components/travel/TourCard";
import type { BookingCardProps } from "./components/travel/BookingCard";
import type { ItineraryMapProps } from "./components/travel/ItineraryMap";
import type { PricingSummaryProps } from "./components/travel/PricingSummary";
import type { AdvisorInsightProps } from "./components/context/AdvisorInsight";
import type { IncludedFeaturesProps } from "./components/context/IncludedFeatures";
import type { PrimaryCTAProps } from "./components/conversion/PrimaryCTA";

export type Components = {
  DocumentSection: DocumentSectionProps;
  DaySection: DaySectionProps;
  SidebarLayout: SidebarLayoutProps;
  CardGroup: CardGroupProps;
  Spacer: SpacerProps;
  Divider: DividerProps;
  TripHeader: TripHeaderProps;
  TripOverview: TripOverviewProps;
  StayCard: StayCardProps;
  ActivityCard: ActivityCardProps;
  TransportCard: TransportCardProps;
  RestaurantCard: RestaurantCardProps;
  CruiseCard: CruiseCardProps;
  InfoCard: InfoCardProps;
  TourCard: TourCardProps;
  BookingCard: BookingCardProps;
  ItineraryMap: ItineraryMapProps;
  PricingSummary: PricingSummaryProps;
  AdvisorInsight: AdvisorInsightProps;
  IncludedFeatures: IncludedFeaturesProps;
  PrimaryCTA: PrimaryCTAProps;
};

export type TravelStudioConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ["structure", "trip", "pricing", "context", "actions"];
}>;

export type TravelStudioData = Data<Components, RootProps>;
