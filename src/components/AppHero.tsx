"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Download, Info, Zap, Shield, Flame, Terminal, Rocket, Globe } from 'lucide-react';
import { AppEntry, IconType } from '@/data/apps';
import Link from 'next/link';
import { isValidUrl } from '@/lib/utils';

interface AppHeroProps {
    apps: AppEntry[];
}

const IconMap: Record<IconType, React.ReactNode> = {
    zap: <Zap size={20} />,
    shield: <Shield size={20} />,
    flame: <Flame size={20} />,
    terminal: <Terminal size={20} />,
    rocket: <Rocket size={20} />,
    globe: <Globe size={20} />,
    message: null,
    play: null,
    music: null,
    camera: null,
    shop: null,
    game: null,
};

export const AppHero: React.FC<AppHeroProps> = ({ apps }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % apps.length);
            setIsAnimating(false);
        }, 400);
    }, [apps.length]);

    useEffect(() => {
        if (apps.length <= 1) return;
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [nextSlide, apps.length]);

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 400);
    }, [currentIndex]);

    const app = apps[currentIndex];

    if (!app) return null;

    const accent = app.accentColor || 'rgba(59, 130, 246, 1)';

    const visibleIndices = new Set([
        currentIndex,
        (currentIndex + 1) % apps.length,
        (currentIndex - 1 + apps.length) % apps.length
    ]);

    return (
        <section className="hw-accel app-hero-container" style={{
            position: 'relative',
            height: '340px',
            borderRadius: '24px',
            margin: '0 0.75rem 2rem',
            overflow: 'hidden',
            zIndex: 10,
            transition: 'box-shadow 0.6s ease',
            boxShadow: `0 20px 50px -10px ${accent}66, 0 0 0 1px rgba(255,255,255,0.1)` // Dynamic glow + subtle border
        }}>
            {apps.map((a, idx) => {
                if (!visibleIndices.has(idx)) return null;
                return (
                    <div key={a.id} style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: idx === currentIndex && !isAnimating ? 1 : 0,
                        transition: 'opacity 0.6s ease',
                        zIndex: 0
                    }}>
                        <Image
                            src={isValidUrl(a.heroImage) ? (a.heroImage as string) :
                                isValidUrl(a.iconUrl) ? (a.iconUrl as string) :
                                    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200'}
                            alt={a.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            style={{
                                objectFit: 'cover',
                                transform: idx === currentIndex ? 'scale(1.1)' : 'scale(1)',
                                transition: idx === currentIndex ? 'transform 8s ease-out' : 'transform 0.5s ease',
                                opacity: idx === currentIndex && !isAnimating ? 1 : 0
                            }}
                            priority={idx === 0}
                            loading={idx === 0 ? undefined : "lazy"}
                        />
                    </div>
                );
            })}

            {/* Global Dark Tint - Subtle overlay to make text pop */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.2)', // 20% flat black overlay
                zIndex: 1
            }} />

            {/* Vibrant Accent Tint */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${accent}55 0%, transparent 65%)`,
                opacity: isAnimating ? 0 : 0.6,
                transition: 'opacity 0.6s ease',
                zIndex: 1,
                mixBlendMode: 'overlay'
            }} />

            {/* Bottom Gradient - Deepened for text contrast */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 50%, transparent 80%)',
                zIndex: 2
            }} />

            {/* Left Edge Soft Vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%)',
                zIndex: 2
            }} />

            {/* Top Vignette */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
                zIndex: 2
            }} />

            {/* Content */}
            <div className="hw-accel" style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '1.75rem',
                right: '1.75rem',
                zIndex: 10,
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <div style={{
                        padding: '0.4rem',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        {IconMap[app.iconId] || <Zap size={20} />}
                    </div>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        Featured {app.category}
                    </span>
                </div>

                <h1 style={{
                    fontSize: '2.4rem',
                    fontWeight: '900',
                    lineHeight: '1',
                    marginBottom: '0.6rem',
                    letterSpacing: '-1.2px',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)' // Enhanced multi-layer shadow
                }}>
                    {app.name}
                </h1>

                <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: '500',
                    marginBottom: '1.25rem',
                    maxWidth: '350px',
                    lineHeight: '1.4'
                }}>
                    {app.description}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link href={`/app/${app.id}`} className="btn-get-ios btn-premium-glow ios-btn-haptic" style={{
                        background: accent,
                        color: 'white',
                        padding: '0.6rem 2.5rem',
                        fontSize: '1rem',
                        borderRadius: '100px',
                        fontWeight: '900',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        boxShadow: `0 8px 25px ${accent}88`
                    }}>
                        <Download size={18} strokeWidth={3} /> GET
                    </Link>
                    <Link href={`/app/${app.id}`} className="ios-btn-haptic haptic-scale" style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textDecoration: 'none'
                    }}>
                        <Info size={20} />
                    </Link>
                </div>
            </div>

            {/* Premium Glass Inner Border/Sheen */}
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)',
                zIndex: 20,
                pointerEvents: 'none'
            }} />

            {/* Slide Indicators */}
            {apps.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    right: '1.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 15
                }}>
                    {apps.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={currentIndex === idx ? 'btn-premium-glow' : ''}
                            style={{
                                width: currentIndex === idx ? '28px' : '7px',
                                height: '5px',
                                borderRadius: '10px',
                                background: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};
