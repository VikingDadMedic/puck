export type RichText = string | Record<string, unknown> | null;

export type Money = {
  amount: number;
  currency: string;
};

export type SupplierRef = {
  id?: string;
  name?: string;
  externalId?: string;
  source?: string;
};

export type MediaAsset = {
  id: string;
  url?: string;
  kind?: "image" | "video";
  mimeType?: string;
  caption?: string;
  altText?: string;
};

export type AttachmentRef = {
  id: string;
  kind: "savedItem" | "place" | "savedIdea" | "genericReference";
  label?: string;
};

export type UploadedDocument = {
  id: string;
  name?: string;
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export type EventTiming = {
  date?: string;
  time?: string;
  duration?: string;
  timezone?: string;
};

export type Visibility = "visible" | "hidden";
