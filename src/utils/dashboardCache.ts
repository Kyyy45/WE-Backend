type CacheEntry<T> = { ts: number; ttl: number; value: T };

const CACHE = new Map<string, CacheEntry<any>>();

export const setCache = <T>(key: string, value: T, ttlSeconds = 60) => {
  CACHE.set(key, { ts: Date.now(), ttl: ttlSeconds * 1000, value });
};

export const getCache = <T>(key: string): T | null => {
  const e = CACHE.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > e.ttl) {
    CACHE.delete(key);
    return null;
  }
  return e.value as T;
};

export const clearCache = (key?: string) => {
  if (key) CACHE.delete(key);
  else CACHE.clear();
};
