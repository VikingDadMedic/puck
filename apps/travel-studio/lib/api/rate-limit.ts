type WindowEntry = {
  timestamps: number[];
};

const windows = new Map<string, WindowEntry>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 60;

const CLEANUP_INTERVAL_MS = 300_000;
let lastCleanup = Date.now();

function cleanup(now: number, windowMs: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of windows.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetMs: number;
};

export function checkRateLimit(
  clientKey: string,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  cleanup(now, windowMs);

  let entry = windows.get(clientKey);
  if (!entry) {
    entry = { timestamps: [] };
    windows.set(clientKey, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldestInWindow + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetMs: windowMs,
  };
}

export function rateLimitKey(request: Request, prefix: string): string {
  const ip = extractClientIp(request);
  const ua = request.headers.get("user-agent")?.trim() || "unknown-agent";
  return `${prefix}:${ip ?? ua}`;
}

function extractClientIp(request: Request): string | null {
  const candidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeIp(candidate);
    if (normalized) return normalized;
  }

  return null;
}

function normalizeIp(raw: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(",")[0]?.trim();
  if (!first) return null;

  const noPort = first.replace(/:\d+$/, "");
  const value =
    noPort.startsWith("[") && noPort.endsWith("]")
      ? noPort.slice(1, -1)
      : noPort;

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return value;
  if (/^[a-fA-F0-9:]+$/.test(value) && value.includes(":"))
    return value.toLowerCase();

  return null;
}
