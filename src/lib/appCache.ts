/**
 * appCache.ts — 3-Layer Cache System
 *
 * Layer 1: Module-level memory Map
 *   → Same session mein route change pe ZERO re-fetch
 *   → Instant (<1ms) read
 *
 * Layer 2: localStorage (compressed JSON)
 *   → Hard refresh ke baad bhi data ready
 *   → TTL: 30 minutes (configurable)
 *   → Stale data turant dikhao, background mein fresh fetch
 *
 * Layer 3: Background revalidation (SWR pattern)
 *   → User ko loading spinner kabhi nahi dikhta
 *   → Fresh data silently update hota hai
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string; // app version — deploy pe old cache auto-bust
}

const CACHE_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0';
const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ─── Layer 1: Module-level memory ───────────────────────────────────────────
// Next.js mein yeh module ek baar load hota hai per session.
// Route change pe yeh reset NAHI hota — isliye instant hai.
const memoryCache = new Map<string, CacheEntry<unknown>>();

// ─── Helpers ────────────────────────────────────────────────────────────────

function isExpired(entry: CacheEntry<unknown>, ttlMs: number): boolean {
  return Date.now() - entry.timestamp > ttlMs;
}

function storageKey(key: string): string {
  return `nexa_cache_${key}`;
}

/** localStorage se safely read karo */
function readFromStorage<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    // Version mismatch — old cache ignore karo
    if (entry.version !== CACHE_VERSION) {
      localStorage.removeItem(storageKey(key));
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

/** localStorage mein safely likho */
function writeToStorage<T>(key: string, entry: CacheEntry<T>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch (e) {
    // Storage full hone pe purana data clear karo
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      clearOldestEntries();
      try {
        localStorage.setItem(storageKey(key), JSON.stringify(entry));
      } catch {
        // Silent fail — memory cache kaam karega
      }
    }
  }
}

/** localStorage ke sabse purane nexa entries hatao */
function clearOldestEntries(): void {
  const entries: { key: string; timestamp: number }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith('nexa_cache_')) continue;
    try {
      const val = JSON.parse(localStorage.getItem(k) ?? '{}');
      entries.push({ key: k, timestamp: val.timestamp ?? 0 });
    } catch {}
  }
  // Purana sabse pehle hatao
  entries.sort((a, b) => a.timestamp - b.timestamp);
  entries.slice(0, Math.ceil(entries.length / 2)).forEach(e => localStorage.removeItem(e.key));
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Cache se data lo.
 * Returns: { data, isStale }
 * isStale = true matlab data hai lekin background mein refresh karo
 */
export function getCached<T>(
  key: string,
  ttlMs = DEFAULT_TTL_MS
): { data: T; isStale: boolean } | null {
  // Layer 1: Memory check (instant)
  const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memEntry) {
    return { data: memEntry.data, isStale: isExpired(memEntry, ttlMs) };
  }

  // Layer 2: localStorage check
  const storageEntry = readFromStorage<T>(key);
  if (storageEntry) {
    // Warm up memory cache
    memoryCache.set(key, storageEntry);
    return { data: storageEntry.data, isStale: isExpired(storageEntry, ttlMs) };
  }

  return null;
}

/** Data cache mein store karo (dono layers mein) */
export function setCached<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    version: CACHE_VERSION,
  };
  memoryCache.set(key, entry);
  writeToStorage(key, entry);
}

/** Cache invalidate karo (deploy ke baad ya force-refresh pe) */
export function invalidateCache(key?: string): void {
  if (key) {
    memoryCache.delete(key);
    if (typeof window !== 'undefined') localStorage.removeItem(storageKey(key));
  } else {
    // Sab clear
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter(k => k.startsWith('nexa_cache_'))
        .forEach(k => localStorage.removeItem(k));
    }
  }
}

/** Cache mein hai ya nahi (stale ho toh bhi) */
export function hasCached(key: string): boolean {
  return memoryCache.has(key) || readFromStorage(key) !== null;
}
