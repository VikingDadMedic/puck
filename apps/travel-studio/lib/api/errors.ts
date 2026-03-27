import { NextResponse } from "next/server";
import { logApi, newRequestId } from "../logger";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_REQUIRED"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "DOCUMENT_CONFLICT"
  | "PROVIDER_ERROR"
  | "INTERNAL_ERROR";

type ErrorEnvelope = {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
  };
};

const STATUS_MAP: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  AUTH_REQUIRED: 401,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  DOCUMENT_CONFLICT: 409,
  PROVIDER_ERROR: 502,
  INTERNAL_ERROR: 500,
};

export function apiError(
  code: ApiErrorCode,
  publicMessage: string,
  internalDetail?: string,
  requestId = newRequestId()
): NextResponse<ErrorEnvelope> {
  if (internalDetail) {
    logApi("error", requestId, `${code}: ${publicMessage}`, {
      internalDetail,
    });
  }

  const response = NextResponse.json(
    { error: { code, message: publicMessage, requestId } },
    { status: STATUS_MAP[code] }
  );
  response.headers.set("x-request-id", requestId);
  return response;
}
