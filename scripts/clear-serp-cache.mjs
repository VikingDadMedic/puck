#!/usr/bin/env node
/**
 * Remove cached SerpAPI / image-search JSON files.
 * Run from apps/travel-studio: node ../../scripts/clear-serp-cache.mjs
 * Or from repo root with cwd travel-studio.
 */
import fs from "fs";
import path from "path";

const cacheDir = path.join(process.cwd(), ".cache", "serp");

if (!fs.existsSync(cacheDir)) {
  console.log("No cache directory at", cacheDir);
  process.exit(0);
}

const files = fs.readdirSync(cacheDir);
let removed = 0;
for (const f of files) {
  try {
    fs.unlinkSync(path.join(cacheDir, f));
    removed++;
  } catch {
    /* ignore */
  }
}
console.log(`Removed ${removed} cache file(s) from ${cacheDir}`);
