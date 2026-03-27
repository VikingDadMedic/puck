import { NextResponse } from "next/server";
import { apiError } from "./errors";
import { checkRateLimit, rateLimitKey } from "./rate-limit";
import { ensureEnvValidated } from "./env";
import { logApi } from "../logger";

type GuardOptions = {
  /** Max requests per window. Default: 60 */
  maxRequests?: number;
  /** Window duration in ms. Default: 60_000 */
  windowMs?: number;
  /** Route prefix for rate-limit bucketing */
  routePrefix: string;
  /** Skip API key check for this route */
  skipAuth?: boolean;
  /** Optional request correlation id for envelopes */
  requestId?: string;
};

type GuardResult = { ok: true } | { ok: false; response: NextResponse };

export function apiGuard(request: Request, options: GuardOptions): GuardResult {
  const { requestId } = options;

  try {
    ensureEnvValidated();
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Unknown env error";
    if (requestId) {
      logApi("error", requestId, "env validation failed", { detail });
    }
    return {
      ok: false,
      response: apiError(
        "INTERNAL_ERROR",
        "Server environment is not configured correctly",
        detail,
        requestId
      ),
    };
  }

  const { maxRequests = 60, windowMs = 60_000, routePrefix } = options;
  const key = rateLimitKey(request, routePrefix);
  const result = checkRateLimit(key, maxRequests, windowMs);

  if (!result.allowed) {
    if (requestId) {
      logApi("warn", requestId, "rate limit exceeded", {
        routePrefix,
        resetMs: result.resetMs,
      });
    }
    const response = apiError(
      "RATE_LIMITED",
      "Too many requests — try again shortly",
      undefined,
      requestId
    );
    response.headers.set(
      "Retry-After",
      String(Math.ceil(result.resetMs / 1000))
    );
    return { ok: false, response };
  }

  if (!options.skipAuth) {
    const configuredKey = process.env.TRAVEL_STUDIO_API_KEY;
    if (configuredKey) {
      const provided = request.headers.get("x-api-key");
      if (provided !== configuredKey) {
        if (requestId) {
          logApi("warn", requestId, "api key auth failed", {
            routePrefix,
          });
        }
        return {
          ok: false,
          response: apiError(
            "AUTH_REQUIRED",
            "Valid API key required",
            undefined,
            requestId
          ),
        };
      }
    }
  }

  return { ok: true };
}
