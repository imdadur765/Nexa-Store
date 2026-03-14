"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppEntry, appsData } from '@/data/apps';
import { getCached, setCached } from '@/lib/appCache';
import { fetchAppsFromSource } from '@/lib/appsFetcher';

// ─── Types ──────────────────────────────────────────────────────────────────
interface UseAppsResult {
  apps: AppEntry[];
  loading: boolean;       
  revalidating: boolean;  
  error: Error | null;
  refetch: () => void;    
}

// ─── Constants ──────────────────────────────────────────────────────────────
const CACHE_KEY = 'apps_all';
const CACHE_TTL = 30 * 60 * 1000;   // 30 min
const FETCH_TIMEOUT = 15_000;        // 15s timeout

// ─── Deduplication ──────────────────────────────────────────────────────────
let inflightFetch: Promise<AppEntry[]> | null = null;

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useApps(): UseAppsResult {
  const cached = getCached<AppEntry[]>(CACHE_KEY, CACHE_TTL);

  const [apps, setApps]                 = useState<AppEntry[]>(cached?.data ?? appsData);
  const [loading, setLoading]           = useState(!cached);
  const [revalidating, setRevalidating] = useState(false);
  const [error, setError]               = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(async (isBackground: boolean) => {
    if (isBackground) setRevalidating(true);
    else setLoading(true);

    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      if (!inflightFetch) {
        inflightFetch = fetchAppsFromSource().finally(() => {
          inflightFetch = null;
        });
      }

      const fresh = await inflightFetch;

      setApps(prev => {
        if (prev.length === fresh.length && prev[0]?.id === fresh[0]?.id && prev[prev.length-1]?.id === fresh[fresh.length-1]?.id) return prev;
        return fresh;
      });

      setCached(CACHE_KEY, fresh);

    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const error = err instanceof Error ? err : new Error('Fetch failed');
      setError(error);
      console.warn('[useApps] Fetch failed, serving cached data:', error.message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setRevalidating(false);
    }
  }, []);

  useEffect(() => {
    const cached = getCached<AppEntry[]>(CACHE_KEY, CACHE_TTL);

    if (!cached) {
      doFetch(false);
    } else if (cached.isStale) {
      doFetch(true);
    }

    return () => abortRef.current?.abort();
  }, [doFetch]);

  const refetch = useCallback(() => doFetch(false), [doFetch]);

  return { apps, loading, revalidating, error, refetch };
}
