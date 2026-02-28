"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Zap, Download, ShoppingBag, Layout, Shield, Search, Flame, Terminal, Play, Cpu, Compass, Gamepad2, Users, Rocket, Palette } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { isValidUrl } from "@/lib/utils";
import AppCard from "@/components/AppCard";
import React from "react";
import { motion } from "framer-motion";

const CategoryMap: Record<string, { label: string, desc: string, icon: React.ReactNode, color: string, categories: string[], tags: string[] }> = {
    'customization': {
        label: 'Customization',
        desc: 'Personalize your entire device experience.',
        icon: <Palette size={48} />,
        color: '#ec4899',
        categories: ['Personalization', 'Themes', 'Social'],
        tags: ['Theming', 'Layout', 'Customization', 'Photos', 'Social']
    },
    'system': {
        label: 'System Tools',
        desc: 'Advanced tweaks, modules, and root solutions.',
        icon: <Cpu size={48} />,
        color: '#0ea5e9',
        categories: ['System', 'Modules'],
        tags: ['Root', 'System', 'Performance', 'Zygisk', 'Hook']
    },
    'productivity': {
        label: 'Productivity',
        desc: 'Work smarter, not harder. Tools that push limits.',
        icon: <Zap size={48} />,
        color: '#3b82f6',
        categories: ['Productivity', 'Tools', 'Education'],
        tags: ['Work', 'Efficiency', 'Learning', 'AI']
    },
    'rare': {
        label: 'Rare Finds',
        desc: 'Exclusive, hard-to-find modified masterpieces.',
        icon: <Star size={48} />,
        color: '#fbbf24',
        categories: ['Rare'],
        tags: ['Exclusive', 'Patched', 'Rare', 'row:rare-find']
    },
    'security': {
        label: 'Security & Privacy',
        desc: 'Lock down your data and browse with confidence.',
        icon: <Shield size={48} />,
        color: '#10b981',
        categories: ['Security', 'Finance'],
        tags: ['Privacy', 'Protection', 'SafetyNet', 'VPN', 'UPI', 'Payments']
    },
    'gaming': {
        label: 'Gaming Hub',
        desc: 'The ultimate collection of mobile gaming excellence.',
        icon: <Gamepad2 size={48} />,
        color: '#f59e0b',
        categories: ['Games', 'Action', 'RPG', 'Adventure', 'Strategy', 'Casual', 'Racing', 'Horror', 'Action Adventure', 'Action RPG', 'Open World'],
        tags: ['Gaming', 'Tweak', 'Battle Royale', 'FPS', 'Gacha', 'Psychological', 'Ninja', 'Western']
    },
    'action': {
        label: 'Action Packed',
        desc: 'Fast paced, adrenaline pumping combat.',
        icon: <Flame size={48} />,
        color: '#ef4444',
        categories: ['Action', 'Action Adventure', 'Action RPG'],
        tags: ['Combat', 'Fast-paced', 'Battle', 'row:game-popular-action']
    },
    'sports': {
        label: 'Competitive Edge',
        desc: 'Sports, racing, and tactical mastery.',
        icon: <Rocket size={48} />,
        color: '#007AFF',
        categories: ['Sports', 'Racing', 'Strategy'],
        tags: ['Athletic', 'Cars', 'Competition', 'row:game-competitive']
    },
    'adventure': {
        label: 'Epic Adventures',
        desc: 'Explore vast open worlds and gripping stories.',
        icon: <Compass size={48} />,
        color: '#8b5cf6',
        categories: ['Adventure', 'Open World', 'RPG'],
        tags: ['Story', 'Exploration', 'Quest', 'row:game-adventure']
    },
    'rpg': {
        label: 'RPG Worlds',
        desc: 'Deep progression, character building, and fantasy.',
        icon: <Shield size={48} />,
        color: '#d946ef',
        categories: ['RPG', 'Action RPG', 'Adventure'],
        tags: ['Character Build', 'Leveling', 'Fantasy', 'row:game-adventure']
    },
    'strategy': {
        label: 'Strategy & Tactics',
        desc: 'Outsmart your opponents and build empires.',
        icon: <Layout size={48} />,
        color: '#14b8a6',
        categories: ['Strategy', 'Simulation'],
        tags: ['Tactical', 'Planning', 'Mind Games', 'row:game-competitive']
    },
    'tools': {
        label: 'Power Tools',
        desc: 'Unleash the full potential of your device.',
        icon: <Terminal size={48} />,
        color: '#f59e0b',
        categories: ['Tools', 'System', 'Utilities'],
        tags: ['Root', 'Performance', 'Power', 'Clean']
    },
    'social': {
        label: 'Social & Connect',
        desc: 'Stay connected with next-gen communication layers.',
        icon: <Users size={48} />,
        color: '#06b6d4',
        categories: ['Social', 'Communication'],
        tags: ['Messaging', 'Communities', 'Lifestyle']
    },
    'entertainment': {
        label: 'Entertainment',
        desc: 'Premium streaming, media, and fun.',
        icon: <Play size={48} />,
        color: '#ec4899',
        categories: ['Entertainment', 'Music', 'Video'],
        tags: ['Streaming', 'Media', 'Fun']
    },
    'new': {
        label: 'New & Trending',
        desc: 'The freshest drops and hottest rising stars.',
        icon: <Flame size={48} />,
        color: '#ff4b2b',
        categories: ['New', 'Trending'],
        tags: ['Latest', 'Hot', 'Fresh']
    },
};

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { apps } = useApps();
    const { id } = React.use(params);
    const activeApps = apps.length > 0 ? apps : staticApps;

    const categoryInfo = CategoryMap[id] || {
        label: id.charAt(0).toUpperCase() + id.slice(1),
        desc: 'Curated collection of top-tier modules.',
        icon: <Layout size={48} />,
        color: 'var(--accent-primary)',
        categories: [],
        tags: []
    };

    const filteredApps = activeApps.filter(app => {
        const isActuallyGame = app.isGame || app.category.toLowerCase().includes('game');
        const gameCategories = ['gaming', 'action', 'sports', 'adventure', 'rpg', 'strategy'];
        if (!gameCategories.includes(id) && isActuallyGame) return false;

        const appCat = app.category.toLowerCase();
        const appTags = (app.tags || []).map(t => t.toLowerCase());

        const matchCategory = categoryInfo.categories.some(c => appCat.includes(c.toLowerCase()));
        const matchTag = categoryInfo.tags.some(t => appTags.some(at => at.includes(t.toLowerCase())));
        const matchId = appCat.includes(id.toLowerCase());

        return matchCategory || matchTag || matchId;
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
            {/* Immersive Background Orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '400px', height: '400px', background: `${categoryInfo.color}33`, filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '-10%', width: '350px', height: '350px', background: `${categoryInfo.color}22`, filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.6 }} />

            <PageHeader
                title={categoryInfo.label}
                icon={<ArrowLeft size={16} />}
                accentColor={categoryInfo.color}
                backText="Store"
            />

            {/* ── Dynamic Category Hero ── */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="liquid-glass"
                style={{
                    margin: '1.25rem 1.25rem 2rem',
                    padding: '3.5rem 2rem',
                    borderRadius: '32px',
                    background: `linear-gradient(135deg, ${categoryInfo.color}44 0%, ${categoryInfo.color}11 100%)`,
                    border: `1px solid ${categoryInfo.color}66`,
                    boxShadow: `0 30px 60px -10px ${categoryInfo.color}55`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                {/* Visual Flair */}
                <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: `radial-gradient(circle, ${categoryInfo.color}44 0%, transparent 70%)`, pointerEvents: 'none' }} />

                <div style={{
                    width: '90px', height: '90px', borderRadius: '28px',
                    background: `linear-gradient(135deg, ${categoryInfo.color}88, transparent)`,
                    border: `1px solid rgba(255,255,255,0.4)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', marginBottom: '1.5rem',
                    boxShadow: `0 15px 35px ${categoryInfo.color}77`,
                    backdropFilter: 'blur(15px)'
                }}>
                    {React.cloneElement(categoryInfo.icon as React.ReactElement, { color: 'white' } as any)}
                </div>

                <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', letterSpacing: '-1px', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                    {categoryInfo.label}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: '500', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
                    {categoryInfo.desc}
                </p>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="liquid-glass" style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>
                        {filteredApps.length} Curated Apps
                    </div>
                </div>
            </motion.section>

            {/* ── Grid Layout ── */}
            <div style={{ padding: '0 1.25rem' }}>
                {filteredApps.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '1rem'
                    }}>
                        {filteredApps.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <AppCard app={app} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="liquid-glass animate-float"
                        style={{
                            padding: '4rem 2rem',
                            borderRadius: '32px',
                            textAlign: 'center',
                            border: '1px dashed rgba(255, 255, 255, 0.2)',
                            marginTop: '2rem'
                        }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: `${categoryInfo.color}15`,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <Search size={32} color={categoryInfo.color} opacity={0.7} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Empty Universe</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '240px', margin: '0 auto' }}>
                            We couldn't find any specific payload in the {categoryInfo.label} sector.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
