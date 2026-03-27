import { sanitizeHtml } from "../api/sanitize";

/** Normalize Puck richtext (string or JSON) to safe HTML for dangerouslySetInnerHTML. */
export function richTextToSafeHtml(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string") return sanitizeHtml(value);
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    const esc = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return sanitizeHtml(`<pre>${esc}</pre>`);
  }
  return sanitizeHtml(String(value));
}
