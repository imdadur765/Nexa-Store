"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    ArrowLeft, Search, Filter, Plus, Smartphone,
    Edit2, Trash2, Zap, ShieldCheck, Star,
    TrendingUp, Layout, CheckCircle2, XCircle, RefreshCw,
    Palette, Gem, Shield, Rocket, Cpu, Flame, Compass, ShoppingBag, Trophy, Monitor, Download, Play
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const COLLECTIONS = [
    { id: 'row:game-popular-action', label: '🔥 Popular Action', icon: <Flame size={18} />, color: '#ff4b2b' },
    { id: 'row:game-top-picks', label: '🎯 Top Picks', icon: <Star size={18} />, color: '#3b82f6' },
    { id: 'row:game-playstore', label: '📲 Playstore Favs', icon: <Smartphone size={18} />, color: '#3ddc84' },
    { id: 'row:game-trending', label: '⚡ Trending Game', icon: <TrendingUp size={18} />, color: '#ef4444' },
    { id: 'row:game-adventure', label: '🗺️ Adventures', icon: <Compass size={18} />, color: '#10b981' },
    { id: 'row:game-originals', label: '🍎 Store Originals', icon: <ShoppingBag size={18} />, color: '#ffffff' },
    { id: 'row:game-competitive', label: '🏆 Competitive', icon: <Trophy size={18} />, color: '#007AFF' },
    { id: 'row:game-console', label: '🎮 Console Qual', icon: <Monitor size={18} />, color: '#0078d4' },
    { id: 'row:game-explore', label: '🌌 Explore Univ', icon: <Compass size={18} />, color: '#a855f7' },

    // -- App Collections --
    { id: 'row:app-trending', label: '⚡ Trending App', icon: <TrendingUp size={18} />, color: '#ff4b2b' },
    { id: 'row:app-top-picks', label: '🎯 App Top Picks', icon: <Star size={18} />, color: '#fbbf24' },
    { id: 'row:app-essential', label: '🛠️ Essential Apps', icon: <Download size={18} />, color: '#10b981' },
    { id: 'row:app-productivity', label: '📈 Productivity', icon: <TrendingUp size={18} />, color: '#3b82f6' },
    { id: 'row:app-entertainment', label: '🎬 Entertainment', icon: <Play size={18} />, color: '#ec4899' },

    { id: 'row:rare-find', label: 'Rare Finds', icon: <Gem size={18} />, color: '#fbbf24' },
    { id: 'row:security', label: 'Security & Privacy', icon: <Shield size={18} />, color: '#ef4444' },
    { id: 'row:customization', label: 'Customization', icon: <Palette size={18} />, color: '#ec4899' },
    { id: 'row:editors-choice', label: "Editor's Choice", icon: <Star size={18} />, color: '#3b82f6' },
    { id: 'row:performance', label: 'Performance', icon: <Cpu size={18} />, color: '#10b981' },
    { id: 'row:trending', label: 'Trending Row', icon: <TrendingUp size={18} />, color: '#e11d48' }
];

export default function CollectionManager() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState<any[]>([]);
    const [activeCollection, setActiveCollection] = useState(COLLECTIONS[0].id);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                fetchApps();
            }
        };
        checkAuth();
    }, [router]);

    const fetchApps = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .order('priority', { ascending: false });

        if (data) setApps(data);
        setLoading(false);
    };

    const groupedApps = useMemo(() => {
        const groups: Record<string, any[]> = {};
        COLLECTIONS.forEach(col => {
            groups[col.id] = apps.filter(app => app.tags?.includes(col.id));
        });
        return groups;
    }, [apps]);

    const currentCollection = COLLECTIONS.find(c => c.id === activeCollection);
    const appsInActive = groupedApps[activeCollection] || [];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem' }}>
            {/* Header */}
            <header className="ultra-glass" style={{
                position: 'sticky', top: 0, zIndex: 100, padding: '1rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Collection Rows</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Organize apps into store-wide curated rows.</p>
                </div>
            </header>

            <div style={{ padding: '1rem' }}>
                {/* ── Collection Selection Tabs ── */}
                <div className="no-scrollbar" style={{
                    display: 'flex',
                    gap: '0.6rem',
                    overflowX: 'auto',
                    padding: '0.5rem 0.25rem 1.5rem',
                    marginBottom: '1rem'
                }}>
                    {COLLECTIONS.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setActiveCollection(col.id)}
                            style={{
                                flex: '0 0 auto',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '16px',
                                background: activeCollection === col.id ? `${col.color}20` : 'rgba(255,255,255,0.03)',
                                border: activeCollection === col.id ? `1px solid ${col.color}` : '1px solid rgba(255,255,255,0.05)',
                                color: activeCollection === col.id ? col.color : 'rgba(255,255,255,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                fontSize: '0.85rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            {col.icon}
                            {col.label}
                            <span style={{
                                background: activeCollection === col.id ? col.color : 'rgba(255,255,255,0.1)',
                                color: activeCollection === col.id ? 'black' : 'white',
                                padding: '1px 6px',
                                borderRadius: '6px',
                                fontSize: '0.65rem'
                            }}>
                                {groupedApps[col.id]?.length || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Collection Details Header ── */}
                <div style={{
                    padding: '1.5rem',
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, ${currentCollection?.color}15, transparent)`,
                    border: `1px solid ${currentCollection?.color}25`,
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {currentCollection?.icon} {currentCollection?.label}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '400px' }}>
                        This row appears on the Home, Tools, and Games pages. Add the "{currentCollection?.id}" tag to any app to include it here.
                    </p>
                </div>

                {/* ── Apps in Collection ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>Current Members</h3>
                    <AnimatePresence>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <RefreshCw size={32} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : appsInActive.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                                <Link href="/admin/manage/all" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '800' }}>
                                    Add apps to this collection →
                                </Link>
                            </div>
                        ) : (
                            appsInActive.map((app) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={app.id}
                                    className="ultra-glass"
                                    style={{
                                        display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '20px', gap: '1rem',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }}
                                >
                                    {app.icon_url ? (
                                        <img src={app.icon_url} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '48px', height: '48px', background: 'var(--accent-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={24} color="white" />
                                        </div>
                                    )}

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>{app.name}</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>{app.category} • by {app.developer || 'Nexa Expert'}</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button
                                            onClick={() => router.push(`/admin/edit/${app.id}`)}
                                            style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white' }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
