"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowLeft, X, TrendingUp, Sparkles, Zap, Download, Gamepad2, Layout, Wrench } from "lucide-react";
import { useApps } from "@/hooks/useApps";
import { useNexaPoints } from "@/hooks/useNexaPoints";
import AppCard from "@/components/AppCard";
import { motion } from "framer-motion";

function SearchContent() {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type"); // 'games', 'apps', or 'tools'
    const { apps: appsData } = useApps();
    const { points } = useNexaPoints();

    // Contextual filtering logic
    const contextualApps = useMemo(() => {
        if (!type || type === 'all') return appsData;

        return appsData.filter(app => {
            const catLower = app.category?.toLowerCase() || "";
            const tagsLower = app.tags?.map(t => t.toLowerCase()) || [];
            const isGame = app.isGame || catLower.includes('game') || tagsLower.includes('game');

            if (type === 'games') return isGame;
            if (type === 'apps') {
                // Apps portal excludes games and usually root/tools
                const isTool = catLower.includes('tool') || tagsLower.includes('tool') || tagsLower.includes('root') || catLower.includes('module');
                return !isGame && !isTool;
            }
            if (type === 'tools') {
                return !isGame && (catLower.includes('tool') || tagsLower.includes('tool') || tagsLower.includes('root') || catLower.includes('module'));
            }
            return true;
        });
    }, [appsData, type]);

    const filteredApps = useMemo(() => {
        return contextualApps.filter(app =>
            app.name.toLowerCase().includes(query.toLowerCase()) ||
            app.description.toLowerCase().includes(query.toLowerCase()) ||
            app.category.toLowerCase().includes(query.toLowerCase()) ||
            app.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }, [contextualApps, query]);

    const getContextInfo = () => {
        const t = type?.toLowerCase();
        if (t === 'games') return { title: "Games Search", icon: <Gamepad2 size={14} color="white" />, placeholder: "Search the gaming universe..." };
        if (t === 'apps') return { title: "Apps Search", icon: <Layout size={14} color="white" />, placeholder: "Search premium apps..." };
        if (t === 'tools') return { title: "Tools Search", icon: <Wrench size={14} color="white" />, placeholder: "Search root & system tools..." };
        return { title: "Nexa Search", icon: <Download size={14} color="white" />, placeholder: "Search the entire library..." };
    };

    const ctx = getContextInfo();
    const trendingSearches = type === 'games'
        ? ["PUBG Mobile", "Genshin Impact", "Cyberpunk", "Minecraft", "GTA"]
        : (type === 'tools' ? ["Magisk", "LSPosed", "Termux", "Root", "Debloater"] : ["WhatsApp", "Instagram", "Spotify", "Netflix", "Truecaller"]);

    return (
        <div className="no-scrollbar" style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
            {/* iOS 26 Liquid Glass Background Orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '250px', height: '250px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: '200px', height: '200px', background: '#ec4899', opacity: 0.08, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '40%', right: '15%', width: '150px', height: '150px', background: '#f59e0b', opacity: 0.05, filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Synced Search Header */}
            <header
                className="liquid-glass hw-accel"
                style={{
                    padding: '1.25rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    background: 'rgba(5, 5, 5, 0.7)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    borderRadius: '0 0 32px 32px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <button
                            onClick={() => router.back()}
                            className="ios-btn-haptic"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                                {ctx.icon}
                            </div>
                            <h1 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{ctx.title}</h1>
                        </div>
                    </div>

                    <div className="ultra-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', border: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Sparkles size={12} fill="currentColor" /> {points.toLocaleString()}
                    </div>
                </div>

                <div className="search-pill-container ultra-glass shadow-premium" style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease'
                }}>
                    <Search size={18} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                    <input
                        autoFocus
                        type="text"
                        placeholder={ctx.placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            letterSpacing: '0.2px'
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="ios-btn-haptic"
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </header>

            <div style={{ padding: '2rem 1.25rem', position: 'relative', zIndex: 1 }}>
                {!query ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Trending Section */}
                        <section style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'white' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={18} color="var(--accent-primary)" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.4px' }}>Trending {type === 'games' ? 'Discoveries' : (type === 'tools' ? 'Tools' : 'Apps')}</h2>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {trendingSearches.map((term, idx) => (
                                    <motion.button
                                        key={term}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                                        onClick={() => setQuery(term)}
                                        style={{
                                            padding: '0.7rem 1.4rem',
                                            borderRadius: '100px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            background: 'rgba(255,255,255,0.03)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}
                                        className="ultra-glass haptic-scale"
                                    >
                                        {term}
                                    </motion.button>
                                ))}
                            </div>
                        </section>

                        {/* Discover More */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'white' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={18} color="rgba(255,255,255,0.4)" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.4px' }}>Discover More</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { label: "Top Rated Games", icon: <Gamepad2 size={18} />, color: "#ff4b2b", href: "/games" },
                                    { label: "Power User Tools", icon: <Wrench size={18} />, color: "#f59e0b", href: "/tools" },
                                    { label: "Essential Services", icon: <Zap size={18} />, color: "#3b82f6", href: "/apps" }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        onClick={() => router.push(item.href)}
                                        className="ultra-glass haptic-scale"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1.25rem',
                                            borderRadius: '20px',
                                            background: `linear-gradient(90deg, ${item.color}10, transparent)`,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            cursor: 'pointer'
                                        }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ color: item.color, opacity: 0.8 }}>{item.icon}</div>
                                            <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>{item.label}</span>
                                        </div>
                                        <ArrowLeft size={18} color="rgba(255,255,255,0.3)" style={{ transform: 'rotate(180deg)' }} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <div className="animate-fade-in">
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '600' }}>
                                Results for <span style={{ color: 'var(--accent-primary)' }}>&quot;{query}&quot;</span>
                                <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>({filteredApps.length})</span>
                            </p>
                        </div>

                        {filteredApps.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                                gap: '1rem'
                            }}>
                                {filteredApps.map((app, idx) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <AppCard app={app} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ultra-glass hw-accel shadow-premium"
                                style={{
                                    padding: '5rem 2rem',
                                    borderRadius: '40px',
                                    textAlign: 'center',
                                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(255,255,255,0.02)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem auto',
                                    boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                    <Search size={40} color="var(--accent-primary)" style={{ opacity: 0.4 }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Empty Orbit</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '280px', margin: '0 auto', lineHeight: '1.5', fontWeight: '500' }}>
                                    We couldn&apos;t find anything matching <span style={{ color: 'var(--accent-primary)' }}>&quot;{query}&quot;</span>.
                                </p>
                                <button
                                    onClick={() => setQuery("")}
                                    className="ios-btn-haptic"
                                    style={{ marginTop: '2rem', background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.9rem', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}
                                >
                                    Clear Mission
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}



export default function SearchPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading Search...</div>}>
            <SearchContent />
        </Suspense>
    );
}

