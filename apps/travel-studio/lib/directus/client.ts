import { createDirectus, rest, authentication } from "@directus/sdk";

// ---------------------------------------------------------------------------
// Directus collection types — mirrors the travel-studio domain model
// ---------------------------------------------------------------------------

export type DirectusTrip = {
  id: string;
  path: string;
  name: string;
  status: "draft" | "published" | "archived";
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  currency: string;
  total_price: number | null;
  price_basis: "perPerson" | "total" | null;
  cover_image: string | null;
  visibility: "visible" | "hidden";
  download_pdf: boolean;
  puck_data: Record<string, unknown>;
  itinerary_data: Record<string, unknown>;
  version: number;
  created_by: string | null;
  updated_by: string | null;
  date_created: string;
  date_updated: string;
};

export type DirectusTraveler = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  passport_number: string | null;
  nationality: string | null;
  dietary_requirements: string | null;
  emergency_contact: string | null;
  notes: string | null;
  date_created: string;
  date_updated: string;
};

export type DirectusSupplier = {
  id: string;
  name: string;
  type:
    | "hotel"
    | "airline"
    | "cruise_line"
    | "tour_operator"
    | "restaurant"
    | "transport"
    | "other";
  external_id: string | null;
  source: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  notes: string | null;
  date_created: string;
  date_updated: string;
};

export type DirectusTripTraveler = {
  id: string;
  trip_id: string | DirectusTrip;
  traveler_id: string | DirectusTraveler;
  role: "primary" | "companion" | "child";
};

export type DirectusMedia = {
  id: string;
  trip_id: string | DirectusTrip;
  url: string;
  kind: "image" | "video";
  mime_type: string | null;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  date_created: string;
};

// ---------------------------------------------------------------------------
// Directus schema — maps collection names to their row types
// ---------------------------------------------------------------------------

export type TravelStudioSchema = {
  trips: DirectusTrip[];
  travelers: DirectusTraveler[];
  suppliers: DirectusSupplier[];
  trip_travelers: DirectusTripTraveler[];
  media: DirectusMedia[];
};

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

export function isDirectusConfigured(): boolean {
  return Boolean(process.env.DIRECTUS_URL);
}

function buildClient() {
  const url = process.env.DIRECTUS_URL || "http://localhost:8055";
  return createDirectus<TravelStudioSchema>(url)
    .with(rest())
    .with(authentication());
}

type ComposedClient = ReturnType<typeof buildClient>;

let _client: ComposedClient | null = null;

export function getDirectusClient(): ComposedClient {
  if (!_client) {
    _client = buildClient();
  }
  return _client;
}

export default getDirectusClient;
