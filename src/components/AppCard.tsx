"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Download, Zap, Shield, Flame, Terminal, Rocket, Globe, MessageCircle, Play, Music, Camera, ShoppingBag, Gamepad2 } from "lucide-react";
import { AppEntry, IconType } from "@/data/apps";
import { useTheme } from "@/context/ThemeContext";
import { isValidUrl } from "@/lib/utils";

const IconMap: Record<IconType, React.ReactNode> = {
    zap: <Zap size={32} color="#3b82f6" />,
    shield: <Shield size={32} color="#8b5cf6" />,
    flame: <Flame size={32} color="#f59e0b" />,
    terminal: <Terminal size={32} color="#10b981" />,
    rocket: <Rocket size={32} color="#ef4444" />,
    globe: <Globe size={32} color="#0ea5e9" />,
    message: <MessageCircle size={32} color="#10b981" />,
    play: <Play size={32} color="#ef4444" />,
    music: <Music size={32} color="#1db954" />,
    camera: <Camera size={32} color="#d946ef" />,
    shop: <ShoppingBag size={32} color="#f59e0b" />,
    game: <Gamepad2 size={32} color="#f59e0b" />,
};

import { Skeleton } from "./Skeleton";
import { useSavedApps } from "@/hooks/useSavedApps";

function AppCardInner({ app, isLoading }: { app: AppEntry; isLoading?: boolean }) {
    const { setTheme, resetAccent } = useTheme();
    const { isAppSaved, toggleSaveApp } = useSavedApps();
    const isSaved = isAppSaved(app.id);

    if (isLoading) {
        return (
            <div className="glass" style={{ padding: '1.25rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Skeleton width="60px" height="60px" borderRadius="18px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="120px" height="1.1rem" style={{ marginBottom: '0.4rem' }} />
                        <Skeleton width="80px" height="0.8rem" />
                    </div>
                    <Skeleton width="64px" height="32px" borderRadius="100px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <Skeleton width="100%" height="0.8rem" />
                    <Skeleton width="70%" height="0.8rem" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="liquid-glass app-card glass-reflection"
            onMouseEnter={() => setTheme(app.gradient)}
            onMouseLeave={resetAccent}
            onTouchStart={() => setTheme(app.gradient)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                padding: '1.25rem',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
        >
            {/* Absolute Link covering the card except the save button */}
            <Link href={`/app/${app.id}`} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div className="ios-squircle ios-card-shadow" style={{
                    width: '60px',
                    height: '60px',
                    background: (app.iconUrl || app.icon_url_external) ? 'transparent' : app.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    position: 'relative',
                    pointerEvents: 'none'
                }}>
                    {isValidUrl(app.iconUrl || app.icon_url_external) ? (
                        <Image src={(app.iconUrl || app.icon_url_external) as string} alt={app.name} width={60} height={60} style={{ objectFit: 'cover' }} loading="lazy" />
                    ) : (
                        <div style={{ color: 'white', opacity: 0.95 }}>
                            {IconMap[app.iconId]}
                        </div>
                    )}

                    {/* Store Source Badges Overlay */}
                    <div style={{ position: 'absolute', bottom: '4px', right: '4px', display: 'flex', gap: '2px', zIndex: 3 }}>
                        {app.storeSource?.includes('playstore') && (
                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', padding: '4px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                <Image src="/platforms/playstore_logo.png" alt="Play Store" width={14} height={14} style={{ objectFit: 'contain' }} />
                            </div>
                        )}
                        {app.storeSource?.includes('appstore') && (
                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', padding: '4px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                <Image src="/platforms/appstore_logo.png" alt="App Store" width={14} height={14} style={{ objectFit: 'contain' }} />
                            </div>
                        )}
                        {app.storeSource?.includes('steam') && (
                            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', padding: '4px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                <Image src="/platforms/steam_logo.png" alt="Steam" width={14} height={14} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                            </div>
                        )}
                    </div>
                </div>

                {app.isEditorChoice && (
                    <div style={{ position: 'absolute', top: '-8px', left: '-8px', background: '#f59e0b', color: 'white', fontSize: '0.6rem', fontWeight: '900', padding: '2px 6px', borderRadius: '6px', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>
                        Choice
                    </div>
                )}

                <div style={{ flex: 1, minWidth: 0, pointerEvents: 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white', marginBottom: '0.15rem' }}>
                        {app.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                            {app.category}
                        </p>
                        {app.trending && (
                            <span className="pulse-soft" style={{ fontSize: '0.6rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>🔥 Hot</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Star size={12} fill="#94a3b8" color="#94a3b8" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{app.rating}</span>
                    </div>
                </div>

                {/* Save & Get Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', zIndex: 2 }}>
                    <button
                        className="ios-btn-haptic pulse-soft"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaveApp(app.id);
                        }}
                        style={{
                            background: isSaved ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isSaved ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                            color: isSaved ? '#ec4899' : 'var(--text-secondary)',
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </button>
                    <div
                        className="btn-get-ios btn-premium-glow ios-btn-haptic"
                        role="button"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--accent-primary)', fontSize: '0.8rem', padding: '0.3rem 1.2rem', border: 'none', borderRadius: '100px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const url = app.downloadUrl || app.githubUrl;
                            if (url) window.open(url, '_blank');
                            else alert('Download link not available.');
                        }}
                    >
                        GET
                    </div>
                </div>
            </div>

            <p style={{ pointerEvents: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', height: '2.2rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', position: 'relative', zIndex: 1 }}>
                {app.description}
            </p>
        </div>
    );
}

const AppCard = React.memo(AppCardInner);
export default AppCard;
