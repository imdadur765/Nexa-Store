"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search, Download, Star, Zap, Shield, Terminal,
    Rocket, Cpu, Lock, Palette, Wrench, Eye, Wifi, Battery, Smartphone,
    Settings, Code, HardDrive, Layers, RefreshCw, Bug, FileText, Box,
    Fingerprint, Globe, Gauge, MonitorSmartphone, Sparkles, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { useApps } from "@/hooks/useApps";
import { GamingRow } from "@/components/games/GamingRow";
import AppCard from "@/components/AppCard";


// ── Comprehensive Android Tools Data ──────────────────────────────────────────

interface ToolEntry {
    id: number;
    name: string;
    description: string;
    category: string;
    version: string;
    rating: number;
    downloads: string;
    developer: string;
    icon: React.ReactNode;
    gradient: string;
    accentColor: string;
    githubUrl?: string;
    downloadUrl?: string;
    tags: string[];
    isPopular?: boolean;
    isNew?: boolean;
}

const TOOL_CATEGORIES = [
    { id: "all", label: "All Tools", icon: <Layers size={16} />, color: "#007AFF" },
    { id: "root", label: "Root", icon: <Zap size={16} />, color: "#ef4444" },
    { id: "security", label: "Security", icon: <Shield size={16} />, color: "#8b5cf6" },
    { id: "performance", label: "Performance", icon: <Gauge size={16} />, color: "#f59e0b" },
    { id: "ui", label: "UI / UX", icon: <Palette size={16} />, color: "#ec4899" },
    { id: "developer", label: "Developer", icon: <Code size={16} />, color: "#3ddc84" },
    { id: "system", label: "System", icon: <HardDrive size={16} />, color: "#0ea5e9" },
    { id: "privacy", label: "Privacy", icon: <Eye size={16} />, color: "#14b8a6" },
];

const toolsData: ToolEntry[] = [];


// ── Component ─────────────────────────────────────────────────────────────────

export default function ToolsPage() {
    const router = useRouter();
    const { apps: allApps, loading } = useApps();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchFocused, setSearchFocused] = useState(false);

    const toolsData = useMemo(() => {
        return allApps.filter(app => !app.isGame);
    }, [allApps]);

    const filteredTools = useMemo(() => {
        return toolsData.filter(tool => {
            const matchesCategory = activeCategory === "all" || tool.category?.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = searchQuery === "" ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory, toolsData]);

    const rareFinds = useMemo(() => toolsData.filter(t => t.tags?.includes('row:rare-find')), [toolsData]);
    const securityTools = useMemo(() => toolsData.filter(t => t.tags?.includes('row:security')), [toolsData]);
    const customizationTools = useMemo(() => toolsData.filter(t => t.tags?.includes('row:customization')), [toolsData]);
    const popularTools = useMemo(() => toolsData.filter(t => t.trending || t.isTopChart), [toolsData]);

    const activeCategoryData = TOOL_CATEGORIES.find(c => c.id === activeCategory);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '8rem' }}>

            {/* ── Back to Store Header ── */}
            <PageHeader
                title="Android Toolbox"
                icon={<Wrench size={14} />}
                showSearch={true}
                searchHref="/search?type=tools"
                searchPlaceholder="Search tools & root..."
                accentColor="#f59e0b"
            />

            {/* ── iOS 26 Glass Search Bar ── */}
            <div style={{ padding: '0 1.25rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
                <div
                    className="tools-glass-search"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.7rem 1.25rem',
                        borderRadius: '100px',
                        background: searchFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(40px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                        border: searchFocused ? '1px solid rgba(0, 122, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: searchFocused
                            ? '0 0 0 4px rgba(0, 122, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <Search size={18} color={searchFocused ? '#007AFF' : 'rgba(255,255,255,0.5)'} style={{ transition: 'color 0.3s ease', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search Magisk, LSPosed, Termux..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            letterSpacing: '0.2px',
                            fontFamily: 'inherit'
                        }}
                    />
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={() => setSearchQuery("")}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    color: 'rgba(255,255,255,0.6)'
                                }}
                            >
                                <X size={12} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    margin: '1.25rem',
                    padding: '2rem 1.5rem',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(139, 92, 246, 0.15) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'center'
                }}
            >
                {/* Floating decorative icons */}
                <div style={{ position: 'absolute', top: '15%', left: '8%', opacity: 0.07 }}>
                    <Terminal size={60} />
                </div>
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.07 }}>
                    <Shield size={70} />
                </div>
                <div style={{ position: 'absolute', top: '10%', right: '15%', opacity: 0.05 }}>
                    <Cpu size={50} />
                </div>

                {/* Glow */}
                <div style={{
                    position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.15)', padding: '0.4rem 1rem',
                        borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800',
                        color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                        marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                        <Zap size={12} /> Power User Arsenal
                    </div>

                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                        Android Toolbox
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto', lineHeight: '1.5' }}>
                        Root modules, system tweaks, privacy tools, developer utilities — everything you need to unlock your device&apos;s full potential.
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                            { label: `${toolsData.length}+ Tools`, color: '#ef4444' },
                            { label: 'Open Source', color: '#3ddc84' },
                            { label: '8 Categories', color: '#007AFF' }
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: `${stat.color}15`,
                                padding: '0.4rem 0.85rem',
                                borderRadius: '100px',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                color: stat.color,
                                border: `1px solid ${stat.color}25`
                            }}>
                                {stat.label}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── Category Tab Bar (Glass Capsule) ── */}
            <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
                <div
                    className="glass-capsule no-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '0.35rem',
                        overflowX: 'auto',
                        padding: '0.35rem',
                        borderRadius: '100px',
                        width: 'fit-content',
                        maxWidth: '100%'
                    }}
                >
                    {TOOL_CATEGORIES.map(cat => (
                        <div
                            key={cat.id}
                            className={`tab-pill ${activeCategory === cat.id ? 'active' : ''}`}
                            style={{
                                padding: '0.55rem 1rem',
                                borderRadius: '100px',
                                position: 'relative',
                                background: 'transparent',
                                border: '1px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem',
                                minWidth: 'fit-content',
                                cursor: 'pointer'
                            }}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {activeCategory === cat.id && (
                                <motion.div
                                    layoutId="toolsTab"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `${cat.color}18`,
                                        borderRadius: '100px',
                                        border: `1px solid ${cat.color}30`,
                                        zIndex: 0
                                    }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span style={{
                                position: 'relative', zIndex: 1,
                                color: activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.5)',
                                transition: 'color 0.3s ease',
                                display: 'flex', alignItems: 'center'
                            }}>{cat.icon}</span>
                            <span style={{
                                position: 'relative', zIndex: 1,
                                fontSize: '0.8rem', fontWeight: '700',
                                whiteSpace: 'nowrap',
                                color: activeCategory === cat.id ? 'white' : 'rgba(255,255,255,0.5)',
                                transition: 'color 0.3s ease'
                            }}>
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Results Count ── */}
            <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {searchQuery ? `${filteredTools.length} result${filteredTools.length !== 1 ? 's' : ''} found` : `${filteredTools.length} tools available`}
                </p>
            </div>

            {/* ── Dynamic Collection Rows (only on "All" tab with no search) ── */}
            {activeCategory === "all" && !searchQuery && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '3rem' }}>

                    {rareFinds.length > 0 && (
                        <GamingRow title="💎 Rare Finds" games={rareFinds} seeAllHref="/categories/rare" />
                    )}

                    {popularTools.length > 0 && (
                        <GamingRow title="🔥 Trending Tools" games={popularTools} seeAllHref="/trending" />
                    )}

                    {securityTools.length > 0 && (
                        <GamingRow title="🛡️ Security & Privacy" games={securityTools} seeAllHref="/categories/security" />
                    )}

                    {customizationTools.length > 0 && (
                        <GamingRow title="🎨 Customization Row" games={customizationTools} seeAllHref="/categories/customization" />
                    )}

                </div>
            )}

            {/* ── Tools Grid ── */}
            <section style={{ padding: '0 1.25rem' }}>
                {filteredTools.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence mode="popLayout">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                                gap: '1rem'
                            }}>
                                {filteredTools.map((tool, index) => (
                                    <motion.div
                                        key={tool.id}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03, type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <AppCard app={tool} />
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '32px',
                            border: '1px dashed rgba(255,255,255,0.1)'
                        }}
                    >
                        <Search size={48} style={{ margin: '0 auto 1.5rem auto', opacity: 0.2, color: 'rgba(255,255,255,0.3)' }} />
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>No tools found</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            We couldn&apos;t find any results for &quot;{searchQuery}&quot;
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                            style={{
                                color: 'var(--accent-primary)', fontWeight: '700',
                                background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem'
                            }}
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </section>

            {/* ── Bottom CTA Banner ── */}
            <section style={{
                margin: '4rem 1.25rem 0 1.25rem',
                padding: '2.5rem 1.5rem',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
                    width: '300px', height: '300px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    filter: 'blur(100px)',
                    pointerEvents: 'none'
                }} />
                <Terminal size={36} color="#3ddc84" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                    Open Source Power
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', maxWidth: '340px', margin: '0 auto 1.5rem auto' }}>
                    Most tools here are open source. Contribute, report issues, or star your favorites on GitHub.
                </p>
                <a
                    href="https://github.com/imdadur765/Nexa-Store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-glow"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.7rem 2rem',
                        borderRadius: '100px',
                        background: 'rgba(61, 220, 132, 0.1)',
                        color: '#3ddc84',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        border: '1px solid rgba(61, 220, 132, 0.25)'
                    }}
                >
                    Browse Repositories <ChevronRight size={16} />
                </a>
            </section>
        </div>
    );
}
