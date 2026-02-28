"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { appsData, AppEntry } from '@/data/apps';
import { isValidUrl } from '@/lib/utils';

interface SupabaseAppRow {
    id: number;
    name: string;
    category?: string;
    version?: string;
    description?: string;
    rating?: number;
    downloads?: string;
    tags?: string[];
    is_featured?: boolean;
    icon_url?: string;
    download_url?: string;
    developer?: string;
    screenshots?: any; // Can be string or string[]
    github_url?: string;
    trending?: boolean;
    is_editor_choice?: boolean;
    age_rating?: string;
    package_size?: string;
    is_game?: boolean;
    platforms?: any; // Can be string or string[]
    accent_color?: string;
    hero_image?: string;
    is_hero?: boolean;
    priority?: number;
    whats_new?: string;
    status?: string;
    // Technical Info
    package_name?: string;
    sha256?: string;
    certificate_signature?: string;
    min_android_version?: string;
    permissions?: any;
    languages?: any;
    older_versions?: any;
    icon_url_external?: string;
    screenshots_external?: string;
}

// Helper to safely parse screenshots
const parseScreenshotsRaw = (data: unknown): string[] => {
    if (Array.isArray(data)) return data as string[];
    if (typeof data === 'string') {
        try {
            // Try parsing as JSON first
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            // If JSON fails, try Postgres array format {url,url}
            if (data.startsWith('{') && data.endsWith('}')) {
                const parsed = data
                    .slice(1, -1) // Remove { }
                    .split(',') // Split by comma
                    .map(s => s.trim().replace(/^"|"$/g, '')) // Remove quotes if present
                    .filter(s => s.length > 0);
                return parsed;
            }
            return [];
        }
    }
    return [];
};

const safeParseScreenshots = (data: unknown): string[] => {
    const raw = parseScreenshotsRaw(data);
    return raw.filter(url => isValidUrl(url));
};

const VALID_PLATFORMS = ['Android', 'iOS', 'Windows', 'PS', 'Xbox', 'Steam'];

const safeParsePlatforms = (data: unknown): string[] => {
    let raw: string[] = [];

    if (Array.isArray(data)) {
        raw = data as string[];
    } else if (typeof data === 'string') {
        let str = data.trim();
        // Handle Postgres array literal: {PS,Windows,Xbox}
        if (str.startsWith('{') && str.endsWith('}')) {
            str = str.slice(1, -1);
        }
        // Handle JSON array: ["PS","Windows"]
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                raw = parsed;
            } else {
                raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            }
        } catch {
            raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        }
    }

    // Only keep valid platform names (case-insensitive match, return canonical name)
    const result = raw
        .map(p => VALID_PLATFORMS.find(v => v.toLowerCase() === p.trim().toLowerCase()))
        .filter((p): p is string => !!p);

    return result.length > 0 ? result : ['Android'];
};


const safeParseTags = (data: unknown, category?: string): string[] => {
    let raw: string[] = [];

    if (Array.isArray(data)) {
        raw = data as string[];
    } else if (typeof data === 'string') {
        let str = data.trim();
        // Handle Postgres array literal: {tag1,tag2}
        if (str.startsWith('{') && str.endsWith('}')) {
            str = str.slice(1, -1);
        }
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) {
                raw = parsed;
            } else {
                raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            }
        } catch {
            raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        }
    }

    const filtered = raw.filter(s => s.length > 0);
    return filtered.length > 0 ? filtered : [category || 'Tools'];
};


const safeParseList = (data: unknown): string[] => {
    let raw: string[] = [];
    if (Array.isArray(data)) {
        raw = data as string[];
    } else if (typeof data === 'string') {
        let str = data.trim();
        if (str.startsWith('{') && str.endsWith('}')) str = str.slice(1, -1);
        try {
            const parsed = JSON.parse(str);
            if (Array.isArray(parsed)) raw = parsed;
            else raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        } catch {
            raw = str.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        }
    }
    return raw.filter(s => s.length > 0);
};

export function useApps() {
    const [apps, setApps] = useState<AppEntry[]>(appsData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApps() {
            try {
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('apps')
                    .select('*')
                    .or('status.eq.approved,status.is.null')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn("Supabase fetch error (using fallback data):", error.message);
                    return;
                }

                if (data && data.length > 0) {
                    const mappedApps: AppEntry[] = (data as SupabaseAppRow[]).map((item) => ({
                        id: 10000 + item.id,
                        name: item.name,
                        category: item.category || 'Tools',
                        version: item.version || '1.0.0',
                        description: item.description || '',
                        rating: item.rating || 4.5,
                        downloads: item.downloads || '0',
                        iconId: 'zap' as const,
                        gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        tags: safeParseTags(item.tags, item.category),
                        isTopChart: item.is_featured || false,
                        ...(item.icon_url && { iconUrl: item.icon_url }),
                        ...(item.download_url && { downloadUrl: item.download_url }),
                        ...(item.developer && { developer: item.developer }),
                        ...(item.screenshots && { screenshots: safeParseScreenshots(item.screenshots) }),
                        ...(item.github_url && { githubUrl: item.github_url }),
                        trending: item.trending || false,
                        isEditorChoice: item.is_editor_choice || false,
                        ageRating: item.age_rating || '4+',
                        packageSize: item.package_size || '45MB',
                        isGame: item.is_game || false,
                        platforms: safeParsePlatforms(item.platforms) as any,
                        accentColor: item.accent_color,
                        heroImage: isValidUrl(item.hero_image || '') ? item.hero_image : undefined,
                        isHero: item.is_hero || false,
                        priority: item.priority || 0,
                        ...(item.whats_new && { whatsNew: item.whats_new }),
                        status: item.status as any,
                        // Technical Info
                        package_name: item.package_name,
                        sha256: item.sha256,
                        certificate_signature: item.certificate_signature,
                        min_android_version: item.min_android_version,
                        permissions: safeParseList(item.permissions),
                        languages: safeParseList(item.languages),
                        older_versions: Array.isArray(item.older_versions) ? item.older_versions : [],
                        icon_url_external: item.icon_url_external,
                        screenshots_external: item.screenshots_external,
                        created_at: (item as any).created_at,
                    }));

                    // Deduplicate: If an app exists in both Supabase and static data, prefer Supabase
                    const supabaseNames = new Set(mappedApps.map(a => a.name.toLowerCase()));
                    const uniqueStaticApps = appsData.filter(a => !supabaseNames.has(a.name.toLowerCase()));

                    setApps([...mappedApps, ...uniqueStaticApps]);
                }
            } catch (err) {
                console.warn("Error fetching apps:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchApps();
    }, []);

    return { apps, loading };
}
