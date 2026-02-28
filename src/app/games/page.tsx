"use client";
import React, { useState, useMemo } from 'react';
import { useApps } from "@/hooks/useApps";
import Image from "next/image";
import { GameHero } from "@/components/games/GameHero";
import { GamingRow } from "@/components/games/GamingRow";
import { GamingGrid } from "@/components/games/GamingGrid";
import {
    Search, X, Filter, Smartphone, Monitor, Gamepad2,
    Trophy, Flame, Zap, Compass, ArrowLeft, ShoppingBag,
    Layout
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeader } from '@/components/SectionHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GamesPage() {
    const { apps, loading } = useApps();
    const [selectedPlatform, setSelectedPlatform] = useState('Android');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const router = useRouter();

    // Helper for robust tag checking
    const hasTag = (app: any, tag: string) => {
        return app.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase());
    };

    // Memoized filter — only recalculate when deps change
    const games = useMemo(() => apps.filter(app => {
        const isActuallyGame = app.isGame || app.category.toLowerCase().includes('game') || hasTag(app, 'row:game-explore');
        if (!isActuallyGame) return false;

        const platformMatch = selectedPlatform === 'all' ||
            app.platforms?.some((p: string) => p.toLowerCase() === selectedPlatform.toLowerCase());
        if (!platformMatch) return false;

        if (selectedCategory) {
            return app.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                app.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
        }

        return true;
    }), [apps, selectedPlatform, selectedCategory]);

    const categories = [
        { id: 'Action', label: 'Action', desc: 'High-octane combat.', icon: <Flame size={32} />, span: 2, row: 2, color: '#ff4b2b' },
        { id: 'Competitive', label: 'Competitive', desc: 'Global leaderboards.', icon: <Trophy size={18} />, span: 1, color: '#007AFF' },
        { id: 'Adventure', label: 'Adventure', desc: 'Epic open worlds.', icon: <Compass size={18} />, span: 1, color: '#10b981' },
        { id: 'RPG', label: 'RPG', desc: 'Deep character growth.', icon: <Zap size={18} />, span: 1, color: '#a855f7' },
        { id: 'Strategy', label: 'Strategy', desc: 'Tactical mastery.', icon: <Layout size={18} />, span: 1, color: '#f59e0b' },
    ];

    // Memoized sort + hero filter
    const sortedGames = useMemo(() =>
        [...games].sort((a, b) => (b.priority || 0) - (a.priority || 0)),
        [games]
    );

    const heroGames = useMemo(() => {
        const heroes = sortedGames.filter(g => g.isHero);
        // Only return games explicitly marked as Hero
        return heroes.slice(0, 6);
    }, [sortedGames]);

    // Store based filters
    const playStoreGames = useMemo(() =>
        sortedGames.filter(g => g.storeSource?.includes('playstore') || hasTag(g, 'row:game-playstore')),
        [sortedGames]
    );

    const appStoreGames = useMemo(() =>
        sortedGames.filter(g => g.storeSource?.includes('appstore') || hasTag(g, 'row:game-originals')),
        [sortedGames]
    );

    // Collection Rows - Tag-based priority with generic fallbacks
    const popularAction = useMemo(() => {
        const tagged = sortedGames.filter(g => hasTag(g, 'row:game-popular-action'));
        const generic = sortedGames.filter(g => (g.category === 'Action' || g.category?.includes('Action')) && !hasTag(g, 'row:game-popular-action'));
        return [...tagged, ...generic];
    }, [sortedGames]);

    const topPicks = useMemo(() => {
        const tagged = sortedGames.filter(g => hasTag(g, 'row:game-top-picks'));
        const generic = sortedGames.filter(g => g.trending && !hasTag(g, 'row:game-top-picks'));
        return [...tagged, ...generic];
    }, [sortedGames]);

    const rareFinds = useMemo(() => sortedGames.filter(t => hasTag(t, 'row:rare-find')), [sortedGames]);
    const editorsChoice = useMemo(() => sortedGames.filter(t => hasTag(t, 'row:editors-choice')), [sortedGames]);
    const trendingRow = useMemo(() => sortedGames.filter(g => hasTag(g, 'row:game-trending') || g.trending), [sortedGames]);

    const competitiveRow = useMemo(() => {
        const tagged = sortedGames.filter(t => hasTag(t, 'row:game-competitive') || hasTag(t, 'row:competitive'));
        const generic = sortedGames.filter(t => (t.category?.includes('Sports') || t.category?.includes('Racing')) && !hasTag(t, 'row:game-competitive'));
        return [...tagged, ...generic];
    }, [sortedGames]);

    const adventureRow = useMemo(() => {
        const tagged = sortedGames.filter(t => hasTag(t, 'row:game-adventure') || hasTag(t, 'row:adventure'));
        const generic = sortedGames.filter(t => (t.category?.includes('RPG') || t.category?.includes('Adventure')) && !hasTag(t, 'row:game-adventure'));
        return [...tagged, ...generic];
    }, [sortedGames]);

    const consoleQuality = useMemo(() => sortedGames.filter(g => hasTag(g, 'row:game-console') || g.platforms?.includes('Windows') || g.platforms?.includes('PS')), [sortedGames]);
    const exploreUniverse = useMemo(() => sortedGames.filter(g => hasTag(g, 'row:game-explore')), [sortedGames]);

    const platforms = [
        { id: 'Android', label: 'Mobile', icon: <Image src="/platforms/playstore_logo.png" width={18} height={18} alt="Play Store" style={{ objectFit: 'contain' }} />, color: '#3ddc84' },
        { id: 'iOS', label: 'iPhone', icon: <Image src="/platforms/appstore_logo.png" width={18} height={18} alt="App Store" style={{ objectFit: 'contain' }} />, color: '#ffffff' },
        { id: 'Windows', label: 'Windows', icon: <Image src="/platforms/windows.png" width={18} height={18} alt="Windows" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />, color: '#0078d4' },
        { id: 'PS', label: 'PlayStation', icon: <Image src="/platforms/ps.png" width={20} height={20} alt="PS" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />, color: '#003087' },
        { id: 'Xbox', label: 'Xbox', icon: <Image src="/platforms/xbox.png" width={18} height={18} alt="Xbox" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />, color: '#52b043' },
    ];

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
                title="Games Portal"
                icon={<Gamepad2 size={18} />}
                showSearch={true}
                searchHref="/search?type=games"
                searchPlaceholder="Search games..."
                accentColor="#ff4b2b"
            />


            {/* Main Stage: Hero Component */}
            {heroGames.length > 0 && !selectedCategory && <GameHero games={heroGames} />}

            {/* Selection Center: Platforms & Categories */}
            <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                {/* Platform Dock */}
                <div className="platform-dock-container" style={{ display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
                    <div className="ultra-glass glass-noise" style={{
                        display: 'flex', gap: '0.5rem', padding: '0.45rem 1.25rem',
                        borderRadius: '24px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                        zIndex: 10
                    }}>
                        {platforms.map(plat => {
                            const isActive = selectedPlatform === plat.id;
                            return (
                                <button key={plat.id} onClick={() => setSelectedPlatform(plat.id)} className="ios-btn-haptic platform-dock-btn"
                                    style={{
                                        padding: isActive ? '0.5rem 1rem' : '0.5rem', borderRadius: '16px', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        color: isActive ? (plat.id === 'iOS' ? '#000000' : 'white') : 'rgba(255,255,255,0.3)',
                                        background: isActive ? plat.color : 'transparent', minWidth: isActive ? '110px' : '40px',
                                        height: '40px', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: isActive ? `0 8px 16px ${plat.color}33` : 'none'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: isActive && plat.id === 'iOS' ? 'brightness(0)' : (isActive ? 'none' : 'grayscale(1) opacity(0.5)'), transition: 'all 0.4s ease' }}>{plat.icon}</div>
                                    {isActive && <span style={{ fontSize: '0.75rem', fontWeight: '900', whiteSpace: 'nowrap', animation: 'fadeInSlide 0.4s ease forwards' }}>{plat.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Chips */}
                <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', maxWidth: '100%', padding: '0.5rem', scrollbarWidth: 'none' }} className="no-scrollbar">
                    <button onClick={() => setSelectedCategory(null)}
                        style={{
                            padding: '0.6rem 1.25rem', borderRadius: '100px', border: 'none',
                            background: !selectedCategory ? 'white' : 'rgba(255,255,255,0.03)',
                            color: !selectedCategory ? 'black' : 'rgba(255,255,255,0.5)',
                            fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s'
                        }}>
                        All Universes
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                padding: '0.6rem 1.25rem', borderRadius: '100px',
                                background: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.03)',
                                color: selectedCategory === cat.id ? 'black' : 'white',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s'
                            }}>
                            <span style={{ display: 'flex', scale: '0.8' }}>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Discovery Section (Popular Action) */}
            {(!selectedCategory || selectedCategory === 'Action') && popularAction.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                    <GamingGrid title="Popular Action" games={popularAction.slice(0, 6)} seeAllHref="/categories/action" />
                </div>
            )}

            {/* Selected Category Header (If filtering) */}
            {selectedCategory && (
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', color: categories.find(c => c.id === selectedCategory)?.color || 'white' }}>
                        {selectedCategory} Universe
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '500' }}>Exploring the best {selectedCategory.toLowerCase()} experiences.</p>
                </div>
            )}

            {/* Gaming Categories/Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {rareFinds.length > 0 && !selectedCategory && (
                    <GamingRow title="💎 Rare Gaming Finds" games={rareFinds} seeAllHref="/categories/rare" />
                )}

                {editorsChoice.length > 0 && !selectedCategory && (
                    <GamingGrid title="✨ Editor's Choice" games={editorsChoice} limit={6} seeAllHref="/games/editors" />
                )}

                {/* TOP PICKS SECTION */}
                <GamingGrid
                    title={selectedCategory ? `Top ${selectedCategory} Hits` : "Top Picks for You"}
                    games={topPicks.length > 0 ? topPicks : (selectedCategory ? sortedGames : sortedGames.slice(0, 6))}
                    limit={6}
                    seeAllHref="/games/all"
                />

                {!selectedCategory && (
                    <>
                        {/* Branded Play Store Section */}
                        {playStoreGames.length > 0 && (
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-0.75rem',
                                    top: '0',
                                    bottom: '0',
                                    width: '4px',
                                    background: 'linear-gradient(to bottom, #4285F4, #34A853, #FBBC05, #EA4335)',
                                    borderRadius: '0 4px 4px 0',
                                    opacity: 0.8
                                }} />
                                <GamingRow
                                    title="Play Store Favorites"
                                    games={playStoreGames}
                                    seeAllHref="/games/playstore"
                                />
                            </div>
                        )}

                        <GamingRow title="Trending Powerhouses" games={trendingRow} seeAllHref="/games/trending" />

                        {adventureRow.length > 0 && (
                            <GamingGrid title="Epic Adventures" games={adventureRow} seeAllHref="/categories/adventure" />
                        )}

                        {/* Branded App Store Section */}
                        {appStoreGames.length > 0 && (
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-0.75rem',
                                    top: '0',
                                    bottom: '0',
                                    width: '4px',
                                    background: 'rgba(255,255,255,0.4)',
                                    borderRadius: '0 4px 4px 0',
                                    backdropFilter: 'blur(4px)',
                                    opacity: 0.8
                                }} />
                                <GamingRow
                                    title="App Store Originals"
                                    games={appStoreGames}
                                    seeAllHref="/games/appstore"
                                />
                            </div>
                        )}

                        {competitiveRow.length > 0 && (
                            <GamingRow title="Competitive Edge" games={competitiveRow} seeAllHref="/categories/sports" />
                        )}

                        {/* Cross-Platform Marvels */}
                        {consoleQuality.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <GamingRow title="Console Quality" games={consoleQuality} seeAllHref="/suggested" />
                            </div>
                        )}
                    </>
                )}
            </div>

            {!selectedCategory && (
                <section style={{ marginTop: '5rem', marginBottom: '4rem' }}>
                    <SectionHeader
                        title="Explore Universes"
                        subtitle="Find your next obsession."
                        marginTop="0"
                        marginBottom="1.5rem"
                    />

                    {exploreUniverse.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <GamingGrid title="Universe Highlights" games={exploreUniverse} limit={5} />
                        </div>
                    )}

                    <div className="discovery-bento-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(var(--bento-cols, 4), 1fr)',
                        gridAutoRows: 'minmax(120px, auto)',
                        gap: '1rem',
                        padding: '0 0.25rem'
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="ultra-glass haptic-scale glass-noise hw-accel"
                                style={{
                                    gridColumn: cat.span ? `span var(--bento-span-${cat.id}, ${cat.span})` : 'span 1',
                                    gridRow: cat.row ? `span ${cat.row}` : 'span 1',
                                    background: `linear-gradient(135deg, ${cat.color}25, transparent)`,
                                    borderRadius: '28px',
                                    border: `1px solid ${cat.color}35`,
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: cat.row ? 'column' : 'row',
                                    justifyContent: cat.row ? 'flex-end' : 'flex-start',
                                    alignItems: cat.row ? 'flex-start' : 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textAlign: 'left',
                                    gap: '1.25rem',
                                    cursor: 'pointer',
                                    boxShadow: `0 10px 30px -10px ${cat.color}22`
                                }}
                            >
                                <div style={{
                                    background: `${cat.color}25`,
                                    padding: cat.row ? '1rem' : '0.75rem',
                                    borderRadius: '16px',
                                    color: cat.color,
                                    boxShadow: `0 0 25px ${cat.color}33`,
                                    zIndex: 2
                                }}>
                                    {cat.icon}
                                </div>
                                <div style={{ zIndex: 2 }}>
                                    <h3 style={{ fontSize: cat.row ? '1.4rem' : '1.1rem', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>{cat.label}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{cat.desc}</p>
                                </div>

                                {/* Absolute Decor Icon */}
                                {cat.row && <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.15 }}>{cat.icon}</div>}

                                {/* Background Accent Glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20%',
                                    right: '-20%',
                                    width: '60%',
                                    height: '60%',
                                    background: `radial-gradient(circle, ${cat.color}20 0%, transparent 70%)`,
                                    zIndex: 1,
                                    pointerEvents: 'none'
                                }} />
                            </button>
                        ))}
                    </div>

                    <style jsx>{`
                        @media (max-width: 768px) {
                            .discovery-bento-grid {
                                --bento-cols: 2;
                            }
                        }
                    `}</style>
                </section>
            )}

            {/* Join Community Banner */}
            <section style={{
                marginBottom: '5rem',
                position: 'relative',
                borderRadius: '32px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(88, 86, 214, 0.08))',
                border: '1px solid rgba(0, 122, 255, 0.15)',
                padding: '3rem 1.5rem',
                textAlign: 'center'
            }}>
                <div className="aura-pulse" style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        background: 'rgba(0, 122, 255, 0.15)',
                        width: '56px',
                        height: '56px',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 8px 16px rgba(0,122,255,0.2)',
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} className="haptic-scale">
                        <Zap size={28} color="#007AFF" fill="#007AFF" />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Join the Nexus</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6', fontWeight: '500' }}>
                        Be the first to experience the latest releases and exclusive beta drops.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://t.me/+QJ14XHv-HIM5MjA1" target="_blank" rel="noopener noreferrer" className="ios-btn-haptic btn-premium" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.85rem 2.5rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.9rem' }}>Follow us</a>
                        <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" rel="noopener noreferrer" className="ios-btn-haptic glass" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.85rem 2.5rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white' }}>Our GitHub</a>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes auraPulse {
                        0% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.1); }
                        100% { opacity: 0.5; transform: scale(1); }
                    }
                    .aura-pulse {
                        animation: auraPulse 8s infinite alternate ease-in-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </section>

            {/* Premium Footer */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.03)',
                paddingTop: '2rem',
                paddingBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span className="btn-haptic">Legal</span>
                    <span className="btn-haptic">Privacy</span>
                    <span className="btn-haptic">About</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1rem', fontWeight: '900', opacity: 0.4, marginBottom: '0.25rem' }}>NEXA PORTAL</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1.5px' }}>&copy; 2026 NEXA LABS</p>
                </div>
            </footer>

            {/* Aesthetic Ambient Aura */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at center, rgba(0, 122, 255, 0.05), transparent 70%)',
                transform: 'translate(-50%, -50%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
        </div>
    );
}
