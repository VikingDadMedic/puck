import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(process.cwd(), ".cache", "serp");
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

export function getCache<T>(key: string): T | null {
  try {
    const filepath = keyToFilename(key);
    if (!fs.existsSync(filepath)) return null;

    const stat = fs.statSync(filepath);
    const age = Date.now() - stat.mtimeMs;
    if (age > TTL_MS) {
      fs.unlinkSync(filepath);
      return null;
    }

    const raw = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const filepath = keyToFilename(key);
    fs.writeFileSync(filepath, JSON.stringify(data), "utf-8");
  } catch {
    // Cache write failure is non-fatal
  }
}
