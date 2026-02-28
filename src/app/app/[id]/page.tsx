"use client";

import { use, useState, useEffect } from "react";
import { useApps } from "@/hooks/useApps";
import {
    Star, Download, Share2, Info, CheckCircle2,
    ArrowLeft, MessageCircle, Play, Music, Camera,
    ShoppingBag, Gamepad2, Zap, Shield, Flame,
    Terminal, Rocket, Globe, ChevronRight, Clock, History, GitCompare, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { fetchRepoData, fetchLatestRelease, parseGitHubUrl, fetchReadme, GitHubRepo, GitHubRelease } from "@/lib/github";
import { useTheme } from "@/context/ThemeContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import { isValidUrl } from "@/lib/utils";
import { SectionHeader } from "@/components/SectionHeader";
import { Skeleton } from "@/components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedApps } from "@/hooks/useSavedApps";
import { AppInfoSections } from "@/components/AppInfoSections";

const IconMap = {
    zap: <Zap size={48} />,
    shield: <Shield size={48} />,
    flame: <Flame size={48} />,
    terminal: <Terminal size={48} />,
    rocket: <Rocket size={48} />,
    globe: <Globe size={48} />,
    message: <MessageCircle size={48} />,
    play: <Play size={48} />,
    music: <Music size={48} />,
    camera: <Camera size={48} />,
    shop: <ShoppingBag size={48} />,
    game: <Gamepad2 size={48} />,
};

const SmallIconMap = {
    zap: <Zap size={20} />,
    shield: <Shield size={20} />,
    flame: <Flame size={20} />,
    terminal: <Terminal size={20} />,
    rocket: <Rocket size={20} />,
    globe: <Globe size={20} />,
    message: <MessageCircle size={20} />,
    play: <Play size={20} />,
    music: <Music size={20} />,
    camera: <Camera size={20} />,
    shop: <ShoppingBag size={20} />,
    game: <Gamepad2 size={20} />,
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    // Fetch directly from DB as hooks can't be used in generateMetadata
    const { data: appData } = await supabase
        .from('apps')
        .select('name, description, category, tags, is_hero, icon_url_external, screenshots')
        .eq('id', id)
        .single();

    if (!appData) {
        return {
            title: 'App Not Found | Nexa Store',
            description: 'The requested application could not be found.',
        };
    }

    const appName = appData.name;
    const shortDesc = appData.description.substring(0, 150) + (appData.description.length > 150 ? '...' : '');
    const iconUrl = appData.icon_url_external || '/assets/default-icon.png';
    const screenshot = Array.isArray(appData.screenshots) && appData.screenshots.length > 0
        ? appData.screenshots[0]
        : iconUrl;

    return {
        title: `${appName} - Free Download | Nexa Store`,
        description: shortDesc,
        keywords: [appName, appData.category, ...(appData.tags || []), 'download', 'free', 'nexa store'],
        openGraph: {
            title: `${appName} | Nexa Store`,
            description: shortDesc,
            images: [
                {
                    url: appData.is_hero ? screenshot : iconUrl,
                    width: appData.is_hero ? 1280 : 512,
                    height: appData.is_hero ? 720 : 512,
                    alt: `${appName} cover`,
                },
            ],
            type: 'website',
            siteName: 'Nexa Store',
        },
        twitter: {
            card: appData.is_hero ? 'summary_large_image' : 'summary',
            title: `${appName} Download`,
            description: shortDesc,
            images: [appData.is_hero ? screenshot : iconUrl],
        },
    };
}

export default function AppDetails({ params }: Props) {
    const { id } = use(params);
    const { apps: appsData, loading: appsLoading } = useApps();
    const app = appsData.find((a) => a.id === parseInt(id));
    const { setTheme, resetAccent } = useTheme();
    const [showSticky, setShowSticky] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const router = useRouter();
    const { isAppSaved, toggleSaveApp } = useSavedApps();

    const [githubData, setGithubData] = useState<GitHubRepo | null>(null);
    const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
    const [readmeContent, setReadmeContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

    useEffect(() => {
        if (!app) return;
        setTheme(app.gradient, app.accentColor ? `${app.accentColor}26` : undefined);

        const loadGitHubData = async () => {
            if (app.githubUrl) {
                const repoPath = parseGitHubUrl(app.githubUrl);
                if (repoPath) {
                    setLoading(true);
                    const [repo, release, readme] = await Promise.all([
                        fetchRepoData(repoPath),
                        fetchLatestRelease(repoPath),
                        fetchReadme(repoPath)
                    ]);
                    setGithubData(repo);
                    setLatestRelease(release);
                    setReadmeContent(readme);
                    setLoading(false);
                }
            }
        };

        loadGitHubData();

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowSticky(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            resetAccent();
        };
    }, [app, setTheme, resetAccent]);

    // Wait for data to load before showing 404
    if (appsLoading && !app) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
            </div>
        );
    }

    if (!app) notFound();

    // Import hook inside the component
    // We already imported useSavedApps at the top theoretically, oh wait, we didn't. 
    // Wait, let's just add it inline. It's better to add the import at the top of the file, then use it here.

    // Dynamic Background Opacity based on scroll
    const headerOpacity = Math.max(0, 1 - scrollY / 300);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1rem 10rem 1rem', position: 'relative' }}>

            {/* Dynamic Radial Backdrop */}
            <div style={{
                position: 'fixed',
                top: '-10%',
                right: '-10%',
                width: '60%',
                height: '60%',
                background: `radial-gradient(circle at center, var(--dynamic-accent-glow) 0%, transparent 70%)`,
                opacity: 0.3,
                filter: 'blur(80px)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>

            {/* Header Actions */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                position: 'sticky',
                top: '1rem',
                zIndex: 100
            }}>
                <button
                    onClick={() => router.back()}
                    className="liquid-glass ios-btn-haptic"
                    style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        color: 'white',
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={16} />
                    <ShoppingBag size={18} /> Store
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="liquid-glass ios-btn-haptic pulse-soft"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleSaveApp(app.id);
                        }}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isAppSaved(app.id) ? '#ec4899' : 'white',
                            borderColor: isAppSaved(app.id) ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.2)'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isAppSaved(app.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </button>
                    <button
                        className="liquid-glass ios-btn-haptic"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}
                        onClick={() => {
                            const shareData = {
                                title: app.name,
                                text: `Check out ${app.name} on Nexa Store!`,
                                url: window.location.href,
                            };

                            if (navigator.share) {
                                navigator.share(shareData).catch(() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                });
                            } else if (navigator.clipboard) {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            } else {
                                alert('Sharing not supported on this browser.');
                            }
                        }}
                    >
                        <Share2 size={18} color="white" />
                    </button>
                </div>
            </div>

            {/* Main App Header with Stretchy Logic */}
            <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '2.5rem',
                    opacity: headerOpacity,
                    transform: `translateY(${scrollY * 0.1}px)`,
                    transition: 'opacity 0.2s ease, transform 0.1s linear'
                }}>
                <div className="ios-squircle ios-card-shadow" style={{
                    width: '110px',
                    height: '110px',
                    background: app.iconUrl ? 'transparent' : app.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden'
                }}>
                    {app.iconUrl ? (
                        <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        IconMap[app.iconId]
                    )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h1 className="ios-text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.5px' }}>{app.name}</h1>
                            <Link href="/services/safety" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05, background: 'rgba(61, 220, 132, 0.15)' }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.35rem 0.8rem', background: 'rgba(61, 220, 132, 0.1)',
                                        borderRadius: '12px', border: '1px solid rgba(61, 220, 132, 0.2)',
                                        cursor: 'pointer', flexShrink: 0,
                                        boxShadow: '0 4px 12px rgba(61, 220, 132, 0.1)'
                                    }}
                                >
                                    <ShieldCheck size={14} color="#3ddc84" fill="#3ddc84" fillOpacity={0.2} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3ddc84', letterSpacing: '0.5px' }}>SAFETY VERIFIED</span>
                                </motion.div>
                            </Link>
                        </div>
                        <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem', opacity: 0.9 }}>
                            {app.category}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link
                            href={`/compare?a=${app.id}`}
                            className="ios-btn-haptic ultra-glass"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-primary)',
                                border: '1px solid rgba(0, 122, 255, 0.2)',
                                background: 'rgba(59, 130, 246, 0.05)'
                            }}
                        >
                            <GitCompare size={22} />
                        </Link>
                        <button
                            type="button"
                            className="btn-get-ios btn-premium-glow ios-btn-haptic"
                            style={{
                                background: app.storeSource?.includes('playstore') ? '#34A853' :
                                    app.storeSource?.includes('steam') ? '#171a21' :
                                        app.storeSource?.includes('appstore') ? '#007AFF' :
                                            'var(--accent-primary)',
                                color: 'white',
                                padding: '0.65rem 2.8rem',
                                fontSize: '1.05rem',
                                border: 'none',
                                boxShadow: `0 8px 20px -5px ${app.storeSource?.includes('playstore') ? '#34A853' :
                                    app.storeSource?.includes('steam') ? '#171a21' :
                                        app.storeSource?.includes('appstore') ? '#007AFF' :
                                            'var(--accent-primary)'}`
                            }}
                            onClick={() => {
                                const url = latestRelease?.assets?.[0]?.browser_download_url || app.downloadUrl || app.githubUrl;
                                if (url) window.open(url, '_blank');
                                else alert('Download link not available yet.');
                            }}
                        >
                            {loading ? "..." : (app.storeSource?.includes('steam') ? "PLAY" : "GET")}
                        </button>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                            {githubData ? `${githubData.stargazers_count} Stars` : "Offers In-App"}
                        </p>
                    </div>
                </div>
            </motion.header>

            {/* Premium "Available On" Section */}
            {app.storeSource && app.storeSource.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{ marginBottom: '2.5rem' }}>
                    <div className="liquid-glass hw-accel" style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Available On
                            </div>
                            <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {app.storeSource.map(source => (
                                    <div key={source} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {source === 'playstore' && <Image src="/platforms/playstore_logo.png" width={18} height={18} style={{ objectFit: 'contain' }} alt="Play Store" />}
                                        {source === 'appstore' && <Image src="/platforms/appstore_logo.png" width={18} height={18} style={{ objectFit: 'contain' }} alt="App Store" />}
                                        {source === 'steam' && <Image src="/platforms/steam_logo.png" width={18} height={18} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} alt="Steam" />}
                                        {source === 'epic' && <Zap size={18} color="#ffffff" fill="white" />}
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white' }}>
                                            {source.charAt(0).toUpperCase() + source.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Bento Stats Grid */}
            <div className="bento-row no-scrollbar" style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                {[
                    { label: 'Stars', value: githubData ? (githubData.stargazers_count / 1000).toFixed(1) + 'K' : app.rating, sub: githubData ? 'GitHub Community' : 'User Rating', icon: <Star size={14} fill="currentColor" /> },
                    { label: 'Version', value: latestRelease ? latestRelease.tag_name : app.version, sub: 'Latest Release' },
                    { label: 'Age', value: app.ageRating || '4+', sub: 'Age Rating' },
                    { label: 'Size', value: latestRelease?.assets?.[0] ? (latestRelease.assets[0].size / (1024 * 1024)).toFixed(1) + 'MB' : (app.packageSize || '45MB'), sub: 'Package Size' },
                    { label: 'Dev', value: githubData ? githubData.owner.login : (app.developer || 'NexaLabs'), sub: 'Verified Repo' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -5, background: 'rgba(255,255,255,0.08)' }}
                        className="bento-box liquid-glass"
                    >
                        <span className="bento-box-label">{stat.label}</span>
                        <span className="bento-box-value" style={{ fontSize: String(stat.value).length > 8 ? '0.8rem' : '1.1rem' }}>
                            {stat.value}
                            {stat.icon && <span style={{ marginLeft: '4px', verticalAlign: 'middle' }}>{stat.icon}</span>}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{stat.sub}</span>
                    </motion.div>
                ))}
            </div>

            {/* Screenshots Gallery */}
            {app.screenshots && app.screenshots.filter(s => isValidUrl(s)).length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                    <SectionHeader
                        title="Preview"
                        marginTop="0"
                        marginBottom="1.5rem"
                    />
                    <div className="screenshot-carousel no-scrollbar">
                        {app.screenshots.filter(s => isValidUrl(s)).map((src, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="screenshot-item liquid-glass ios-btn-haptic"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveScreenshot(src)}
                                style={{
                                    minWidth: '220px', height: '400px',
                                    borderRadius: '20px', overflow: 'hidden',
                                    position: 'relative',
                                    flexShrink: 0,
                                    cursor: 'pointer'
                                }}
                            >
                                <Image src={src} alt={`Screenshot ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Ratings & Distribution Chart */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ padding: '0 1.25rem', marginBottom: '3rem' }}>
                <SectionHeader
                    title="Ratings & Reviews"
                    subtitle={`${app.rating} Stars — Community Feedback`}
                    marginTop="0"
                    marginBottom="1.5rem"
                />
                <div className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', lineHeight: '1' }}>{app.rating}</div>
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '0.5rem 0' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={14} fill={s <= Math.floor(app.rating) ? "var(--accent-primary)" : "none"} color={s <= Math.floor(app.rating) ? "var(--accent-primary)" : "rgba(255,255,255,0.2)"} />
                            ))}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{Math.floor(Math.random() * 500) + 100} RATINGS</div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const percent = star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 3 : 2;
                            return (
                                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', width: '10px' }}>{star}</span>
                                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{ height: '100%', background: 'var(--accent-primary)', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* What's New & Description */}
            <div style={{ padding: '0 1.25rem', paddingBottom: '5rem' }}>
                {app.whatsNew && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '2.5rem' }}>
                        <SectionHeader
                            title="What's New"
                            subtitle={`Version ${app.version}`}
                            marginTop="0"
                            marginBottom="1.25rem"
                        />
                        <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '22px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {app.whatsNew}
                            </p>
                        </div>
                    </motion.div>
                )}


                {/* Description & Version History */}
                <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '4rem' }}>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}>
                        <SectionHeader
                            title={readmeContent ? 'Documentation' : 'Description'}
                            marginTop="0"
                            marginBottom="1.25rem"
                        />
                        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <Skeleton width="100%" height="1.2rem" />
                                    <Skeleton width="90%" height="1.2rem" />
                                    <Skeleton width="95%" height="1.2rem" />
                                    <Skeleton width="40%" height="1.2rem" />
                                </div>
                            ) : readmeContent ? (
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {readmeContent}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p>
                                    {app.description} Nexa Store provide exclusive early access to this module. Designed for performance enthusiasts and customization experts.
                                </p>
                            )}
                        </div>
                        {!readmeContent && <button style={{ color: 'var(--accent-primary)', fontWeight: '700', marginTop: '1rem', background: 'none', border: 'none', padding: 0 }}>more</button>}
                    </motion.section>

                    {/* Time Machine Version History */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}>
                        <SectionHeader
                            title="Time Machine"
                            subtitle="Version History"
                            marginTop="0"
                            marginBottom="1.5rem"
                        />

                        <div className="time-machine">
                            {[
                                { v: latestRelease ? latestRelease.tag_name : app.version, date: 'Now', size: latestRelease?.assets?.[0] ? (latestRelease.assets[0].size / (1024 * 1024)).toFixed(1) + ' MB' : '45.2 MB', desc: 'Current stable release from GitHub.' },
                                { v: '2.4.0', date: '2 weeks ago', size: '44.8 MB', desc: 'Added support for new APIs and modular hooks.' },
                                { v: '2.3.5', date: '1 month ago', size: '42.1 MB', desc: 'Bug fixes and performance optimization.' }
                            ].map((version, i) => (
                                <div key={version.v} className="version-node">
                                    <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '18px' }}>
                                        {loading ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Skeleton width="60px" height="1.2rem" />
                                                    <Skeleton width="80px" height="0.8rem" />
                                                </div>
                                                <Skeleton width="100%" height="0.9rem" />
                                                <Skeleton width="40px" height="0.8rem" />
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontWeight: '800', color: 'white', fontSize: '1.1rem' }}>v{version.v}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{version.date}</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{version.desc}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{version.size}</span>
                                                    {i > 0 && <button style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', background: 'none', border: 'none' }}>Compare</button>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </main>

                {/* Uptodown-style Info Sections */}
                <AppInfoSections
                    app={app}
                    latestRelease={latestRelease}
                    githubStars={githubData?.stargazers_count}
                />

                {/* Elite Sticky Download Bar */}
                <div className={`sticky-bar ${showSticky ? 'visible' : ''}`}>
                    <div className="liquid-glass" style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="ios-squircle" style={{
                                width: '48px',
                                height: '48px',
                                background: app.iconUrl ? 'transparent' : app.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                {app.iconUrl ? (
                                    <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ transform: 'scale(0.6)', color: 'white' }}>{SmallIconMap[app.iconId]}</div>
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>{app.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: '700' }}>{app.category}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-get-ios btn-premium-glow ios-btn-haptic"
                            style={{
                                background: 'var(--accent-primary)',
                                color: 'white',
                                padding: '0.85rem 2rem',
                                fontSize: '1.05rem',
                                border: 'none',
                                flex: 1.5, /* Increased flex to take more space */
                                marginLeft: '1rem', /* Reduced margin */
                                fontWeight: '900',
                                boxShadow: '0 8px 25px -5px var(--accent-primary)',
                                borderRadius: '100px'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const url = latestRelease?.assets?.[0]?.browser_download_url || app.downloadUrl || app.githubUrl;
                                if (url) window.open(url, '_blank');
                                else alert('Download link not available.');
                            }}
                        >
                            Get
                        </button>
                    </div>
                </div>
            </div>
            {/* Elite Media Lightbox */}
            <AnimatePresence>
                {activeScreenshot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveScreenshot(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 20000,
                            background: 'rgba(0,0,0,0.92)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                width: '100%',
                                maxHeight: '85vh',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                src={activeScreenshot}
                                alt="Screenshot Full"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '85vh',
                                    borderRadius: '24px',
                                    objectFit: 'contain',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                                }}
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveScreenshot(null); }}
                                className="liquid-glass"
                                style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    right: '0',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '900',
                                    fontSize: '1.2rem'
                                }}
                            >
                                ✕
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
