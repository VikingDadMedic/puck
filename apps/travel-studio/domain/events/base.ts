import type {
  RichText,
  MediaAsset,
  AttachmentRef,
  UploadedDocument,
} from "../common";

export type EventCategory =
  | "smartImport"
  | "activity"
  | "lodging"
  | "flight"
  | "transportation"
  | "cruise"
  | "tour"
  | "booking"
  | "info";

export type EventBase = {
  id: string;
  category: EventCategory;
  subCategory?: string;
  type?: string;
  title?: string;
  notes?: RichText;
  media?: MediaAsset[];
  attachments?: AttachmentRef[];
  documents?: UploadedDocument[];
};
