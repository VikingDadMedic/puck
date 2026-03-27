import { NextResponse } from "next/server";
import { logApi, newRequestId } from "../logger";
import { apiError } from "./errors";
import { apiGuard } from "./guard";
import { type ParamRule, validateSearchParams } from "./validate";

type RunSearchRouteOptions<T> = {
  routePrefix: string;
  routeLabel?: string;
  rules: Record<string, ParamRule>;
  providerErrorMessage: string;
  run: (params: Record<string, string>) => Promise<T>;
  validateExtra?: (params: Record<string, string>) => string | null;
  maxRequests?: number;
  windowMs?: number;
  skipAuth?: boolean;
};

export async function runSearchRoute<T>(
  request: Request,
  options: RunSearchRouteOptions<T>
): Promise<NextResponse<unknown>> {
  const requestId = newRequestId();
  const routeLabel = options.routeLabel ?? options.routePrefix;

  const guard = apiGuard(request, {
    routePrefix: options.routePrefix,
    maxRequests: options.maxRequests,
    windowMs: options.windowMs,
    skipAuth: options.skipAuth,
    requestId,
  });
  if (!guard.ok) return guard.response;

  const validation = validateSearchParams(request.url, options.rules);
  if (!validation.valid) {
    logApi("warn", requestId, `${routeLabel} validation failed`, {
      message: validation.message,
    });
    return apiError(
      "VALIDATION_ERROR",
      validation.message,
      undefined,
      requestId
    );
  }

  if (options.validateExtra) {
    const extraError = options.validateExtra(validation.params);
    if (extraError) {
      logApi("warn", requestId, `${routeLabel} validation failed`, {
        message: extraError,
      });
      return apiError("VALIDATION_ERROR", extraError, undefined, requestId);
    }
  }

  try {
    const results = await options.run(validation.params);
    const response = NextResponse.json(results);
    response.headers.set("x-request-id", requestId);
    logApi("info", requestId, `${routeLabel} search completed`, {
      resultCount: Array.isArray(results) ? results.length : undefined,
    });
    return response;
  } catch (err: unknown) {
    const detail =
      err instanceof Error ? err.message : "Unknown provider error";
    logApi("error", requestId, `${routeLabel} provider failed`, { detail });
    return apiError(
      "PROVIDER_ERROR",
      options.providerErrorMessage,
      detail,
      requestId
    );
  }
}
