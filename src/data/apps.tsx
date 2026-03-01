import { Zap, Shield, Flame, Terminal, Rocket, Globe, MessageCircle, Play, Music, Camera, ShoppingBag, Gamepad2 } from "lucide-react";

export type IconType = 'zap' | 'shield' | 'flame' | 'terminal' | 'rocket' | 'globe' | 'message' | 'play' | 'music' | 'camera' | 'shop' | 'game';

export interface AppEntry {
    id: number;
    name: string;
    category: string;
    version: string;
    description: string;
    rating: number;
    downloads: string;
    iconId: IconType;
    gradient: string;
    tags: string[];
    isTopChart?: boolean;
    rank?: number;
    githubUrl?: string;
    iconUrl?: string;
    downloadUrl?: string;
    developer?: string;
    screenshots?: string[];
    whatsNew?: string;
    trending?: boolean;
    isEditorChoice?: boolean;
    ageRating?: string;
    packageSize?: string;
    // New fields for Games Portal
    isGame?: boolean;
    platforms?: ('Android' | 'iOS' | 'Windows' | 'Xbox' | 'PS' | 'Steam')[];
    heroImage?: string;
    accentColor?: string;
    isHero?: boolean;
    priority?: number;
    // Store source for games
    storeSource?: ('playstore' | 'appstore' | 'steam' | 'epic')[];
    status?: 'pending' | 'approved' | 'rejected';
    // Technical Info (Uptodown style)
    package_name?: string;
    sha256?: string;
    certificate_signature?: string;
    min_android_version?: string;
    permissions?: string[];
    languages?: string[];
    older_versions?: { version: string; android: string; date: string; type: string }[];
    // Mapping helpers
    icon?: React.ReactNode;
    isPopular?: boolean;
    is_new?: boolean;
    isNew?: boolean;
    created_at?: string;
    // Phase 25/27 Professional Upgrade Fields
    is_safety_verified?: boolean;
    editorial_rating?: number;
    editors_verdict?: string;
    pros?: string[];
    cons?: string[];
    // External Data Overrides
    icon_url_external?: string;
    screenshots_external?: string;
}

export const appsData: AppEntry[] = [];

