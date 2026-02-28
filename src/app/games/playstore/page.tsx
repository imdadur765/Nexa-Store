"use client";
import React from 'react';
import { useApps } from '@/hooks/useApps';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Download, Layout } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export default function PlayStorePortalPage() {
    const { apps, loading } = useApps();

    const playStoreGames = apps.filter(app =>
        (app.isGame || app.category.toLowerCase().includes('game')) &&
        (app.storeSource?.includes('playstore') || app.tags?.some(t => t.toLowerCase() === 'row:game-playstore'))
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3ddc84', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="no-scrollbar" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem', paddingBottom: '8rem', background: 'var(--bg-primary)' }}>
            <PageHeader
                title="Play Store Favorites"
                icon={<Image src="/platforms/playstore_logo.png" width={20} height={20} alt="Play Store" style={{ objectFit: 'contain' }} />}
                accentColor="#3ddc84"
                backText="Games"
            />

            <div style={{ padding: '2rem 1.25rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '0.6rem', color: 'white' }}>Play Store Hits</h1>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '-0.2px' }}>Most popular on Android.</p>
                </div>

                <div className="discovery-bento-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1.25rem',
                }}>
                    {playStoreGames.map(game => (
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
                            </div>

                            <div style={{ padding: '0 0.25rem' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{game.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.category}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: '900' }}>
                                        {game.rating} <Star size={11} fill="currentColor" />
                                    </div>
                                    <div className="glass" style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '100px',
                                        background: 'rgba(255,255,255,0.12)',
                                        color: 'var(--accent-primary)',
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        border: '1px solid rgba(255,255,255,0.15)'
                                    }}>
                                        <Download size={11} strokeWidth={3} /> GET
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at 110% 110%, rgba(61, 220, 132, 0.05), transparent 50%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
        </div>
    );
}
