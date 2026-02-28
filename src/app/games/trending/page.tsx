"use client";
import React from 'react';
import { useApps } from '@/hooks/useApps';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Download, Flame } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export default function TrendingPage() {
    const { apps, loading } = useApps();

    const trendingGames = apps.filter(app =>
        (app.isGame || app.category.toLowerCase().includes('game')) &&
        (app.trending || app.tags?.some(t => t.toLowerCase() === 'row:game-trending'))
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ff4b2b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="no-scrollbar" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem', paddingBottom: '8rem', background: 'var(--bg-primary)' }}>
            {/* Standardized Page Header */}
            <PageHeader
                title="Trending"
                icon={<Flame size={16} />}
                accentColor="#ff4b2b"
                backText="Games"
            />

            <div style={{ padding: '2rem 1.25rem' }}>
                {trendingGames.length > 0 ? (
                    <div className="discovery-bento-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {trendingGames.map(game => (
                            <Link key={game.id} href={`/app/${game.id}`} className="ios-btn-haptic haptic-scale glass-noise" style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'rgba(15, 20, 35, 0.4)',
                                borderRadius: '32px',
                                padding: '0.85rem',
                                border: '1px solid rgba(255,255,255,0.08)',
                                transition: 'var(--transition-smooth)'
                            }}>
                                {/* Adaptive Ambient Glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: '50%',
                                    width: '80%',
                                    height: '80%',
                                    background: `radial-gradient(circle at center, ${game.accentColor || 'rgba(59, 130, 246, 0.4)'} 0%, transparent 60%)`,
                                    transform: 'translateX(-50%)',
                                    opacity: 0.15,
                                    zIndex: -1,
                                    filter: 'blur(35px)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={game.iconUrl || game.heroImage}
                                        alt={game.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {/* Store Badge Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                        display: 'flex',
                                        gap: '4px',
                                        zIndex: 3
                                    }}>
                                        {game.storeSource?.includes('playstore') && (
                                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                                <Image src="/platforms/playstore_logo.png" alt="Play Store" width={14} height={14} style={{ objectFit: 'contain' }} />
                                            </div>
                                        )}
                                        {game.storeSource?.includes('appstore') && (
                                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                                <Image src="/platforms/appstore_logo.png" alt="App Store" width={14} height={14} style={{ objectFit: 'contain' }} />
                                            </div>
                                        )}
                                        {game.storeSource?.includes('steam') && (
                                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                                <Image src="/platforms/steam_logo.png" alt="Steam" width={14} height={14} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ padding: '0 0.25rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{game.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.category}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '900' }}>
                                            {game.rating} <Star size={11} fill="currentColor" />
                                        </div>
                                        <div className="glass" style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '100px',
                                            background: 'rgba(255,255,255,0.12)',
                                            color: 'var(--accent-primary)',
                                            fontSize: '0.7rem',
                                            fontWeight: '900',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            border: '1px solid rgba(255,255,255,0.15)'
                                        }}>
                                            <Download size={11} strokeWidth={3} /> GET
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="ultra-glass animate-float" style={{
                        padding: '4rem 2rem',
                        borderRadius: '32px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        marginTop: '4rem'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(255, 75, 43, 0.1)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <Flame size={32} color="#ff4b2b" opacity={0.5} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>No trending games</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '240px', margin: '0 auto' }}>
                            Check back later for the latest hits.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
