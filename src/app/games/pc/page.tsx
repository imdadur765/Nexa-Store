"use client";
import React from 'react';
import { appsData } from '@/data/apps';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star, Monitor, Smartphone, Download } from 'lucide-react';

export default function PCPortalPage() {
    const pcGames = appsData.filter(app => app.isGame && app.platforms?.includes('Windows'));

    return (
        <div style={{
            minHeight: '100vh',
            padding: '1.5rem',
            paddingTop: '4rem',
            paddingBottom: '8rem',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative'
        }}>
            {/* Minimalist Navigation */}
            <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                <Link href="/games" className="ios-btn-haptic glass" style={{
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    marginBottom: '2rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textDecoration: 'none'
                }}>
                    <ChevronLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '0.6rem', color: 'white' }}>PC Level</h1>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '-0.2px', marginBottom: '2rem' }}>Desktop power, portable form factor.</p>

                <div className="ios-btn-haptic glass" style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'white',
                    width: 'fit-content'
                }}>
                    <Image src="/platforms/steam_logo.png" width={18} height={18} alt="Steam" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.5px' }}>STEAM PORTAL</span>
                </div>
            </div>

            {/* Play Store Style Grid */}
            <div className="discovery-bento-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1.25rem',
            }}>
                {pcGames.map(game => (
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
                                src={game.iconUrl || game.heroImage || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200`}
                                alt={game.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div style={{ padding: '0 0.25rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{game.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.category}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <div className="glass" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src="/platforms/windows.png" alt="PC" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                    <div className="glass" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src="/platforms/android.png" alt="Mobile" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
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

            {/* Aesthetic Ambient Aura */}
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at 110% 110%, rgba(34, 197, 94, 0.08), transparent 50%), radial-gradient(circle at -10% -10%, rgba(59, 130, 246, 0.08), transparent 50%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
        </div>
    );
}
