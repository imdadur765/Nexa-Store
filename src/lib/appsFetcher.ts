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
    screenshots?: any;
    github_url?: string;
    trending?: boolean;
    is_editor_choice?: boolean;
    age_rating?: string;
    package_size?: string;
    is_game?: boolean;
    platforms?: any;
    accent_color?: string;
    hero_image?: string;
    is_hero?: boolean;
    priority?: number;
    whats_new?: string;
    status?: string;
    package_name?: string;
    sha256?: string;
    certificate_signature?: string;
    min_android_version?: string;
    permissions?: any;
    languages?: any;
    older_versions?: any;
    icon_url_external?: string;
    screenshots_external?: string;
    slider_image_url?: string;
    editors_verdict?: string;
    pros?: any;
    cons?: any;
    editorial_rating?: number;
    is_safety_verified?: boolean;
}

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

const safeParseTags = (data: unknown, category?: string): string[] => {
    const list = safeParseList(data);
    return list.length > 0 ? list : [category || 'Tools'];
};

const safeParseScreenshots = (data: unknown): string[] => {
    const list = safeParseList(data);
    return list.filter(url => isValidUrl(url));
};

const VALID_PLATFORMS = ['Android', 'iOS', 'Windows', 'PS', 'Xbox', 'Steam'];
const safeParsePlatforms = (data: unknown): string[] => {
    const raw = safeParseList(data);
    const result = raw
        .map(p => VALID_PLATFORMS.find(v => v.toLowerCase() === p.trim().toLowerCase()))
        .filter((p): p is string => !!p);
    return result.length > 0 ? result : ['Android'];
};

export async function fetchAppsFromSource(): Promise<AppEntry[]> {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return appsData;

        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .or('status.eq.approved,status.is.null')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn("[appsFetcher] Supabase error:", error.message);
            return appsData;
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
                ...((item.icon_url || item.icon_url_external) && { iconUrl: item.icon_url || item.icon_url_external }),
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
                package_name: item.package_name,
                sha256: item.sha256,
                certificate_signature: item.certificate_signature,
                min_android_version: item.min_android_version,
                permissions: safeParseList(item.permissions),
                languages: safeParseList(item.languages),
                older_versions: Array.isArray(item.older_versions) ? item.older_versions : [],
                editors_verdict: item.editors_verdict,
                pros: Array.isArray(item.pros) ? item.pros : [],
                cons: Array.isArray(item.cons) ? item.cons : [],
                editorial_rating: item.editorial_rating,
                is_safety_verified: item.is_safety_verified,
                icon_url_external: item.icon_url_external,
                screenshots_external: item.screenshots_external,
                slider_image_url: item.slider_image_url,
                created_at: (item as any).created_at,
                realId: item.id,
            }));

            const supabaseNames = new Set(mappedApps.map(a => a.name.toLowerCase()));
            const uniqueStaticApps = appsData.filter(a => !supabaseNames.has(a.name.toLowerCase()));
            return [...mappedApps, ...uniqueStaticApps];
        }
    } catch (err) {
        console.warn("[appsFetcher] Fetch catch:", err);
    }
    return appsData;
}
