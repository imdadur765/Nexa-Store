/**
 * AppCacheProvider.tsx
 *
 * Root layout mein wrap karo.
 * App open hote hi background mein apps prefetch ho jaate hain.
 * Jab tak user Home page pe pohonchta hai — data ready hota hai.
 */

'use client';

import { useEffect, useRef } from 'react';
import { getCached, setCached } from '@/lib/appCache';
import { fetchAppsFromSource } from '@/lib/appsFetcher';

const CACHE_KEY   = 'apps_all';
const CACHE_TTL   = 30 * 60 * 1000;
const PREFETCH_DELAY = 500; // 500ms baad prefetch — first paint block nahi ho

async function prefetchApps() {
  try {
    const apps = await fetchAppsFromSource();
    setCached(CACHE_KEY, apps);
  } catch {
    // Silent fail — useApps fallback karega
  }
}

export function AppCacheProvider({ children }: { children: React.ReactNode }) {
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;

    const cached = getCached(CACHE_KEY, CACHE_TTL);

    if (!cached) {
      // Pehli baar — thoda wait karo taaki first paint ho jaaye
      const timer = setTimeout(prefetchApps, PREFETCH_DELAY);
      return () => clearTimeout(timer);
    }

    if (cached.isStale) {
      // Stale — background mein quietly refresh
      prefetchApps();
    }
    // Fresh cache — kuch nahi karna
  }, []);

  return <>{children}</>;
}


/**
 * RevalidatingIndicator
 *
 * Optional — dikhao jab background mein fresh fetch ho rahi ho.
 * Isko status bar ke neeche ya header corner mein rakho.
 */
export function RevalidatingIndicator({ isRevalidating }: { isRevalidating: boolean }) {
  if (!isRevalidating) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 9999,
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
        backgroundSize: '200% 100%',
        animation: 'revalidate-bar 1.5s linear infinite',
      }}
    />
  );
}

// Global keyframe inject (ek baar)
if (typeof document !== 'undefined') {
  const id = 'nexa-revalidate-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `@keyframes revalidate-bar { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
    document.head.appendChild(s);
  }
}
