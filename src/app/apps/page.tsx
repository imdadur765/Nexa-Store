"use client";

import React, { useMemo } from 'react';
import { useApps } from '@/hooks/useApps';
import { AppHero } from '@/components/AppHero';
import { GamingRow } from '@/components/games/GamingRow';
import { motion } from 'framer-motion';
import { Layout, Zap, Filter, Sparkles, Star, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppsPage() {
    const { apps, loading } = useApps();
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState("All Apps");

    // -- Data Filtering (Pure Apps Only) --
    const pureApps = useMemo(() => apps.filter(app => {
        // Exclude games
        const isGame = app.isGame || app.category.toLowerCase().includes('game');
        if (isGame) return false;

        const nameLower = app.name.toLowerCase();
        const catLower = app.category.toLowerCase();
        const tagsLower = app.tags?.map(t => t.toLowerCase()) || [];

        if (
            nameLower.includes('magisk') ||
            nameLower.includes('lsposed') ||
            catLower.includes('module') ||
            tagsLower.includes('module') ||
            tagsLower.includes('root')
        ) {
            return false;
        }

        return true;
    }), [apps]);

    const categories = [
        { id: "all", name: "All Apps", icon: <Layout size={16} /> },
        { id: "productivity", name: "Productivity", icon: <Zap size={16} /> },
        { id: "tools", name: "Premium Tools", icon: <Filter size={16} /> },
        { id: "social", name: "Social & Connect", icon: <Sparkles size={16} /> },
        { id: "entertainment", name: "Entertainment", icon: <Star size={16} /> },
    ];

    // -- Section Queries --
    const heroApps = useMemo(() => pureApps.filter(a => a.isHero).slice(0, 5), [pureApps]);
    const effectiveHeroApps = heroApps.length > 0 ? heroApps : pureApps.sort((a, b) => b.rating - a.rating).slice(0, 5);

    // Filtered Views for Tabs
    const displayApps = useMemo(() => {
        if (activeTab === "All Apps") return []; // Not used for "All Apps" view which has specific rows

        const cat = categories.find(c => c.name === activeTab);
        if (!cat || !cat.id || cat.id === 'all') return [];

        return pureApps.filter(a => {
            const catLower = a.category.toLowerCase();
            const tagsLower = a.tags?.map(t => t.toLowerCase()) || [];
            return catLower.includes(cat.id) || tagsLower.includes(cat.id);
        });
    }, [pureApps, activeTab]);

    // -- Tag-Based Collections (Matching Games Architecture) --
    const hasTag = (a: any, tag: string) => a.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase());

    const parseDownloads = (d: string) => {
        const val = parseFloat(d.replace(/[^0-9.]/g, ''));
        if (d.toLowerCase().includes('b')) return val * 1000000000;
        if (d.toLowerCase().includes('m')) return val * 1000000;
        if (d.toLowerCase().includes('k')) return val * 1000;
        return val;
    };

    const topPicksApps = useMemo(() => {
        const tagged = pureApps.filter(a => hasTag(a, 'row:app-top-picks'));
        return tagged.length > 0 ? tagged : [...pureApps].sort((a, b) => b.rating - a.rating).slice(0, 10);
    }, [pureApps]);

    const trendingApps = useMemo(() => {
        const tagged = pureApps.filter(a => hasTag(a, 'row:app-trending'));
        return tagged.length > 0 ? tagged : [...pureApps].sort((a, b) => parseDownloads(b.downloads) - parseDownloads(a.downloads)).slice(0, 10);
    }, [pureApps]);

    const essentialApps = useMemo(() => pureApps.filter(a => hasTag(a, 'row:app-essential')).slice(0, 10), [pureApps]);
    const productivityApps = useMemo(() => pureApps.filter(a => hasTag(a, 'row:app-productivity') || a.category === 'Productivity').slice(0, 10), [pureApps]);
    const entertainmentApps = useMemo(() => pureApps.filter(a => hasTag(a, 'row:app-entertainment') || a.category === 'Entertainment').slice(0, 10), [pureApps]);

    const newApps = useMemo(() => {
        return [...pureApps].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA || (b.id - a.id);
        }).slice(0, 10);
    }, [pureApps]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="ios-btn-haptic" style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="no-scrollbar" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem', paddingBottom: '8rem', background: 'var(--bg-primary)' }}>

            {/* Standardized Page Header */}
            <PageHeader
                title="Apps Portal"
                icon={<Layout size={18} />}
                showSearch={true}
                searchHref="/search?type=apps"
                searchPlaceholder="Search apps & modules..."
                accentColor="var(--accent-primary)"
            />

            {/* Premium Hero Section - ONLY ON ALL APPS */}
            {activeTab === "All Apps" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <AppHero apps={effectiveHeroApps} />
                </motion.div>
            )}

            {/* Categories Tab Switcher (Animated) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    padding: '0 0.5rem 2.5rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setActiveTab(cat.name)}
                        className="ios-btn-haptic"
                        style={{
                            position: 'relative',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '100px',
                            background: 'transparent',
                            border: `1px solid ${activeTab === cat.name ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                            color: activeTab === cat.name ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexShrink: 0,
                            zIndex: 1
                        }}
                    >
                        {activeTab === cat.name && (
                            <motion.div
                                layoutId="activeAppTab"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'var(--accent-primary)',
                                    borderRadius: '100px',
                                    zIndex: -1,
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </motion.div>

            {/* Main Content Area */}
            {activeTab === "All Apps" ? (
                <>
                    {/* Essential Collections (Bento Grid) */}
                    <div style={{ padding: '0 0.5rem 3.5rem' }}>
                        <SectionHeader
                            title="Essential Collections"
                            marginTop="0"
                            marginBottom="1.5rem"
                        />

                        <div className="bento-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.75rem'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="ultra-glass haptic-scale"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05))',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: '160px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    textDecoration: 'none'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', opacity: 0.2 }}>
                                    <Zap size={60} color="var(--accent-primary)" style={{ transform: 'rotate(15deg) translate(10px, -10px)' }} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.15rem', zIndex: 2 }}>Power Tools</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', zIndex: 2, lineHeight: '1.2' }}>
                                    Supercharge your device.
                                </p>
                                <Link href="/categories/tools" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', zIndex: 2 }}>
                                    View <ArrowRight size={12} strokeWidth={3} />
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="ultra-glass haptic-scale"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(244, 63, 94, 0.05))',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: '160px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    textDecoration: 'none'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', opacity: 0.2 }}>
                                    <Layout size={60} color="#ec4899" style={{ transform: 'rotate(-5deg) translate(5px, -5px)' }} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.15rem', zIndex: 2 }}>Style Shift</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', zIndex: 2, lineHeight: '1.2' }}>
                                    Redefine aesthetic.
                                </p>
                                <Link href="/categories/customization" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', fontWeight: '800', color: '#ec4899', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', zIndex: 2 }}>
                                    View <ArrowRight size={12} strokeWidth={3} />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* App Rows (Tag-Based Curated Collections) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {topPicksApps.length > 0 && <GamingRow title="Top Picks for You" games={topPicksApps} seeAllHref="/apps/top-picks" />}
                        {trendingApps.length > 0 && <GamingRow title="Trending Now" games={trendingApps} seeAllHref="/apps/trending" />}
                        {essentialApps.length > 0 && <GamingRow title="Essential Utilities" games={essentialApps} seeAllHref="/apps/essential" />}
                        {productivityApps.length > 0 && <GamingRow title="Professional Suite" games={productivityApps} seeAllHref="/apps/productivity" />}
                        {entertainmentApps.length > 0 && <GamingRow title="Entertainment Hub" games={entertainmentApps} seeAllHref="/apps/entertainment" />}
                        {newApps.length > 0 && <GamingRow title="Recent Discoveries" games={newApps} seeAllHref="/apps/new" />}
                    </div>
                </>
            ) : (
                /* Tab-specific View */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={activeTab}
                    transition={{ duration: 0.4 }}
                    style={{ padding: '0 0.5rem' }}
                >
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.8px', marginBottom: '0.25rem' }}>{activeTab}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The best {activeTab.toLowerCase()} modules curated for you.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {displayApps.length > 0 ? (
                            <GamingRow title={`${activeTab} Collection`} games={displayApps} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                                <p>No {activeTab.toLowerCase()} apps found.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

        </div>
    );
}
