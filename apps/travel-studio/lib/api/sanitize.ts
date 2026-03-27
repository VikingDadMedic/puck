const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "code",
  "pre",
  "span",
  "div",
  "hr",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
  span: new Set(["class"]),
  div: new Set(["class"]),
};

const SAFE_URL_PROTOCOL = /^(https?|mailto|tel):/i;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strips dangerous HTML while preserving safe rich-text markup.
 * Operates via regex-based tag rewriting. Handles the constrained
 * output of Tiptap (Puck's richtext editor).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";

  let result = dirty;

  result = result.replace(/<!--[\s\S]*?-->/g, "");

  result = result.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)?\/?>/g,
    (match, tagName: string, attrsStr: string) => {
      const tag = tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) return "";

      const isClosing = match.startsWith("</");
      if (isClosing) return `</${tag}>`;

      const isSelfClosing =
        match.endsWith("/>") || tag === "br" || tag === "hr";
      const allowedAttrsForTag = ALLOWED_ATTRS[tag];

      if (!allowedAttrsForTag || !attrsStr?.trim()) {
        return isSelfClosing ? `<${tag} />` : `<${tag}>`;
      }

      const safeAttrs: string[] = [];
      const attrRegex = /([a-zA-Z\-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

        if (!allowedAttrsForTag.has(attrName)) continue;

        if (attrName === "href") {
          if (
            !SAFE_URL_PROTOCOL.test(attrValue) &&
            !attrValue.startsWith("#")
          ) {
            continue;
          }
        }

        safeAttrs.push(`${attrName}="${escapeHtml(attrValue)}"`);
      }

      if (tag === "a" && !safeAttrs.some((a) => a.startsWith("rel="))) {
        safeAttrs.push('rel="noopener noreferrer"');
      }

      const attrString = safeAttrs.length > 0 ? ` ${safeAttrs.join(" ")}` : "";
      return isSelfClosing
        ? `<${tag}${attrString} />`
        : `<${tag}${attrString}>`;
    }
  );

  result = result.replace(/<script[\s\S]*?<\/script>/gi, "");
  result = result.replace(/<style[\s\S]*?<\/style>/gi, "");
  result = result.replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  result = result.replace(/javascript\s*:/gi, "");

  return result;
}

const SAFE_LINK_PROTOCOL = /^(https?:|mailto:|tel:|#)/i;

export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();
  if (SAFE_LINK_PROTOCOL.test(trimmed)) return trimmed;
  return "#";
}

const URLISH_KEYS = new Set(["url", "heroImage", "imageUrl"]);

function sanitizeImageUrl(value: string): string {
  const t = value.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return "";
}

export function sanitizeDocumentData(data: unknown): unknown {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(sanitizeDocumentData);
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && URLISH_KEYS.has(key)) {
        result[key] =
          key === "url" ? sanitizeUrl(value) : sanitizeImageUrl(value);
        continue;
      }
      if (typeof value === "string" && isLikelyHtml(value)) {
        result[key] = sanitizeHtml(value);
      } else {
        result[key] = sanitizeDocumentData(value);
      }
    }
    return result;
  }
  return data;
}

function isLikelyHtml(str: string): boolean {
  return /<[a-zA-Z][^>]*>/.test(str);
}
