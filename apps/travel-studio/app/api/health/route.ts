import { NextResponse } from "next/server";
import { newRequestId } from "../../../lib/logger";
import { ensureEnvValidated } from "../../../lib/api";

export async function GET() {
  const requestId = newRequestId();
  try {
    ensureEnvValidated();
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Unknown env error";
    const response = NextResponse.json(
      {
        ok: false,
        requestId,
        error: detail,
      },
      { status: 500 }
    );
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const response = NextResponse.json({
    ok: true,
    requestId,
    serpApiConfigured: Boolean(process.env.SERP_API_KEY),
    authConfigured: Boolean(process.env.TRAVEL_STUDIO_API_KEY),
    timestamp: new Date().toISOString(),
  });
  response.headers.set("x-request-id", requestId);
  return response;
}
