import {
  CACHE_STALE_GRACE_MS,
  CACHE_TTL_MS,
  clearSerpCacheDirectory,
  getCache,
  getStaleFallbackCache,
  setCache,
} from "./cache";

describe("serp cache TTL and stale fallback", () => {
  let now = 1_730_000_000_000;
  let dateNowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    clearSerpCacheDirectory();
    now = 1_730_000_000_000;
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    clearSerpCacheDirectory();
  });

  it("returns a fresh cache hit within TTL", () => {
    const key = "cache:fresh";
    setCache(key, { ok: true });

    expect(getCache<{ ok: boolean }>(key)).toEqual({ ok: true });
    expect(getStaleFallbackCache<{ ok: boolean }>(key)).toEqual({ ok: true });
  });

  it("returns stale fallback after TTL expiry", () => {
    const key = "cache:stale";
    setCache(key, { ok: true });

    now += CACHE_TTL_MS + 1;

    expect(getCache<{ ok: boolean }>(key)).toBeNull();
    expect(getStaleFallbackCache<{ ok: boolean }>(key)).toEqual({ ok: true });
  });

  it("evicts entries beyond TTL + stale grace window", () => {
    const key = "cache:expired";
    setCache(key, { ok: true });

    now += CACHE_TTL_MS + CACHE_STALE_GRACE_MS + 1;

    expect(getStaleFallbackCache<{ ok: boolean }>(key)).toBeNull();
    expect(getCache<{ ok: boolean }>(key)).toBeNull();
  });
});
