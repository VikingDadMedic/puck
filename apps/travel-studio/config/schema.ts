import type { Data } from "@/core";

export type DocumentMode = "itinerary" | "proposal" | "client_view";

export type DocumentStatus = "draft" | "in_review" | "published" | "archived";

export type VisibilityAudience =
  | "advisor"
  | "client"
  | "email"
  | "pdf"
  | "export_only";

export type VisibilityRule = {
  audience: VisibilityAudience[];
  hiddenInModes?: DocumentMode[];
};

export type ReferencedEntity = {
  id: string;
  entityType:
    | "trip"
    | "client"
    | "traveler"
    | "supplier_option"
    | "pricing_snapshot"
    | "destination_content"
    | "media_asset"
    | "template_asset";
  refId: string;
  snapshotPolicy?: "live" | "publish_snapshot";
  label?: string;
};

export type RenderProfile = {
  mode: DocumentMode | "email" | "pdf";
  componentWhitelist?: string[];
  componentBlacklist?: string[];
  themeOverrides?: Record<string, unknown>;
};

export type TripDocument = {
  id: string;
  tripId?: string;
  clientId?: string;
  title: string;
  status: DocumentStatus;
  version: number;
  documentType: "trip_document";
  defaultMode: DocumentMode;
  brandThemeId?: string;
  locale?: string;
  currency?: string;
  referencedEntities: ReferencedEntity[];
  puckData: Data;
  renderProfiles: RenderProfile[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};
