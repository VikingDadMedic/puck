import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(process.cwd(), ".cache", "serp");
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const CACHE_STALE_GRACE_MS = 7 * 24 * 60 * 60 * 1000; // keep expired entries for stale-if-error

type CacheWrapper<T> = { storedAt: number; data: T };
export type CacheMeta<T> = { data: T; ageMs: number; isStale: boolean };

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function keyToFilename(key: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(key)
    .digest("hex")
    .slice(0, 16);
  return path.join(CACHE_DIR, `${hash}.json`);
}

function readEntry<T>(key: string): { data: T; ageMs: number } | null {
  try {
    const filepath = keyToFilename(key);
    if (!fs.existsSync(filepath)) return null;

    const stat = fs.statSync(filepath);
    const rawText = fs.readFileSync(filepath, "utf-8");
    const parsed = JSON.parse(rawText) as unknown;

    let storedAt: number;
    let data: T;

    if (
      parsed &&
      typeof parsed === "object" &&
      "storedAt" in parsed &&
      "data" in parsed
    ) {
      const w = parsed as CacheWrapper<T>;
      storedAt = typeof w.storedAt === "number" ? w.storedAt : stat.mtimeMs;
      data = w.data;
    } else {
      data = parsed as T;
      storedAt = stat.mtimeMs;
    }

    const ageMs = Date.now() - storedAt;
    return { data, ageMs };
  } catch {
    return null;
  }
}

/** Return cache entry only if younger than TTL. */
export function getCache<T>(key: string): T | null {
  return getCacheWithMeta<T>(key)?.data ?? null;
}

/** Return fresh cache entry with metadata. */
export function getCacheWithMeta<T>(key: string): CacheMeta<T> | null {
  const e = readEntry<T>(key);
  if (!e) return null;
  if (e.ageMs > CACHE_TTL_MS) return null;
  return { data: e.data, ageMs: e.ageMs, isStale: false };
}

/**
 * Return cache entry if it exists and is within TTL + stale grace window
 * (used after upstream errors).
 */
export function getStaleFallbackCache<T>(key: string): T | null {
  return getStaleFallbackCacheWithMeta<T>(key)?.data ?? null;
}

export function getStaleFallbackCacheWithMeta<T>(
  key: string
): CacheMeta<T> | null {
  const e = readEntry<T>(key);
  if (!e) return null;
  if (e.ageMs > CACHE_TTL_MS + CACHE_STALE_GRACE_MS) {
    try {
      fs.unlinkSync(keyToFilename(key));
    } catch {
      /* ignore */
    }
    return null;
  }
  return { data: e.data, ageMs: e.ageMs, isStale: e.ageMs > CACHE_TTL_MS };
}

export function setCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const filepath = keyToFilename(key);
    const wrapper: CacheWrapper<T> = { storedAt: Date.now(), data };
    fs.writeFileSync(filepath, JSON.stringify(wrapper), "utf-8");
  } catch {
    // Cache write failure is non-fatal
  }
}

export function clearSerpCacheDirectory(): { removed: number } {
  if (!fs.existsSync(CACHE_DIR)) return { removed: 0 };
  const files = fs.readdirSync(CACHE_DIR);
  let removed = 0;
  for (const f of files) {
    try {
      fs.unlinkSync(path.join(CACHE_DIR, f));
      removed += 1;
    } catch {
      /* ignore */
    }
  }
  return { removed };
}
