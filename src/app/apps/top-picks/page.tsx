"use client";
import React from 'react';
import { useApps } from '@/hooks/useApps';
import Link from 'next/link';
import { Star, Download, Target } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export default function AppTopPicksPage() {
    const { apps, loading } = useApps();

    const topPicksApps = apps.filter(app => {
        const isGame = app.isGame || app.category.toLowerCase().includes('game');
        if (isGame) return false;
        return app.tags?.some(t => t.toLowerCase() === 'row:app-top-picks');
    });

    // Fallback if no tagged apps
    const effectiveApps = topPicksApps.length > 0 ? topPicksApps : apps.filter(app => !(app.isGame || app.category.toLowerCase().includes('game'))).sort((a, b) => b.rating - a.rating).slice(0, 20);

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="no-scrollbar" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem', paddingBottom: '8rem', background: 'var(--bg-primary)' }}>
            <PageHeader
                title="Top Picks"
                icon={<Target size={16} />}
                accentColor="#fbbf24"
                backText="Apps"
            />

            <div style={{ padding: '2rem 1.25rem' }}>
                <div className="discovery-bento-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1.25rem',
                }}>
                    {effectiveApps.map(app => (
                        <Link key={app.id} href={`/app/${app.id}`} className="ios-btn-haptic haptic-scale glass-noise" style={{
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
                                background: `radial-gradient(circle at center, ${app.accentColor || '#fbbf24'} 0%, transparent 60%)`,
                                transform: 'translateX(-50%)',
                                opacity: 0.1,
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
                                    src={app.iconUrl || app.icon_url_external || `/icons/${app.iconId}.png`}
                                    alt={app.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div style={{ padding: '0 0.25rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{app.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{app.category}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '900' }}>
                                        {app.rating} <Star size={11} fill="currentColor" />
                                    </div>
                                    <div className="glass" style={{
                                        padding: '0.4rem 0.9rem',
                                        borderRadius: '100px',
                                        background: 'rgba(255,255,255,0.12)',
                                        color: '#fbbf24',
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
            </div>
        </div>
    );
}
