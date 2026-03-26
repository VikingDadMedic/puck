import type { RichText, Visibility } from "./common";
import type { ItineraryEvent } from "./union";

export type ItineraryPrice = {
  amount: number;
  currency: string;
  basis: "perPerson" | "total";
};

export type ItineraryDocument = {
  id: string;
  visibility: Visibility;
  name: string;
  startDate: string;
  price?: ItineraryPrice;
  description?: RichText;
  downloadPdf?: boolean;
  events: ItineraryEvent[];
};
