export type ParamRule = {
  required?: boolean;
  pattern?: RegExp;
  maxLength?: number;
};

type ValidationResult =
  | { valid: true; params: Record<string, string> }
  | { valid: false; message: string };

export function validateSearchParams(
  url: string,
  rules: Record<string, ParamRule>
): ValidationResult {
  const { searchParams } = new URL(url);
  const params: Record<string, string> = {};

  for (const [key, rule] of Object.entries(rules)) {
    const value = searchParams.get(key)?.trim() || "";

    if (rule.required && !value) {
      return { valid: false, message: `Missing required parameter: ${key}` };
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return {
        valid: false,
        message: `Parameter '${key}' exceeds max length of ${rule.maxLength}`,
      };
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, message: `Invalid format for parameter: ${key}` };
    }

    params[key] = value;
  }

  return { valid: true, params };
}

const ALLOWED_DOC_PATH = /^\/[a-z0-9][a-z0-9\-_/]*$/i;
const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024;

export type DocPayloadResult =
  | { valid: true; path: string; data: unknown; expectedVersion?: number }
  | { valid: false; message: string };

export async function validateDocPayload(
  request: Request
): Promise<DocPayloadResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return { valid: false, message: "Payload too large (max 2 MB)" };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { valid: false, message: "Invalid JSON body" };
  }

  if (!body || typeof body !== "object") {
    return { valid: false, message: "Body must be a JSON object" };
  }

  const payload = body as Record<string, unknown>;

  if (
    typeof payload.path !== "string" ||
    !ALLOWED_DOC_PATH.test(payload.path)
  ) {
    return {
      valid: false,
      message:
        "Invalid document path — must start with / and contain only alphanumeric, hyphens, underscores, or slashes",
    };
  }

  if (payload.path.length > 200) {
    return { valid: false, message: "Document path too long (max 200 chars)" };
  }

  if (!payload.data || typeof payload.data !== "object") {
    return { valid: false, message: "Missing or invalid 'data' field" };
  }

  let expectedVersion: number | undefined;
  if (payload.expectedVersion !== undefined) {
    if (
      typeof payload.expectedVersion !== "number" ||
      !Number.isInteger(payload.expectedVersion) ||
      payload.expectedVersion < 0
    ) {
      return {
        valid: false,
        message: "expectedVersion must be a non-negative integer when provided",
      };
    }
    expectedVersion = payload.expectedVersion;
  }

  return {
    valid: true,
    path: payload.path,
    data: payload.data,
    expectedVersion,
  };
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
/** Airport / city codes for SerpAPI (IATA, metro codes, or short slugs). */
const FLIGHT_LOCATION_PATTERN = /^[A-Za-z0-9._\- ]{2,64}$/;
const SAFE_TEXT = /^[\w\s,.\-()]+$/;

export const patterns = {
  date: DATE_PATTERN,
  flightLocation: FLIGHT_LOCATION_PATTERN,
  safeText: SAFE_TEXT,
} as const;
