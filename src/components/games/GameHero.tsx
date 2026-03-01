"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Info, Globe } from 'lucide-react';
import { AppEntry } from '@/data/apps';
import Link from 'next/link';
import { isValidUrl } from '@/lib/utils';

interface GameHeroProps {
    games: AppEntry[];
}

export const GameHero: React.FC<GameHeroProps> = ({ games }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % games.length);
            setIsAnimating(false);
        }, 400);
    }, [games.length]);

    useEffect(() => {
        if (games.length <= 1) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, games.length]);

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 400);
    }, [currentIndex]);

    const game = games[currentIndex];

    if (!game) return null;

    const accent = game.accentColor || 'rgba(59, 130, 246, 1)';

    // Only render current, previous, and next slide images (not all 6)
    const visibleIndices = new Set([
        currentIndex,
        (currentIndex + 1) % games.length,
        (currentIndex - 1 + games.length) % games.length
    ]);

    return (
        <section className="hw-accel game-hero-container" style={{
            position: 'relative',
            height: '340px',
            borderRadius: '24px',
            margin: '0 0.75rem 2rem',
            overflow: 'hidden',
            zIndex: 10,
            transition: 'box-shadow 0.6s ease',
            boxShadow: `0 20px 50px -10px ${accent}66, 0 0 0 1px rgba(255,255,255,0.1)` // Dynamic glow + subtle border
        }}>
            {/* Only render current + adjacent slides (not all 6) */}
            {games.map((g, idx) => {
                if (!visibleIndices.has(idx)) return null;
                return (
                    <div key={g.id} style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: idx === currentIndex && !isAnimating ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        zIndex: 0
                    }}>
                        <Image
                            src={isValidUrl(g.heroImage) ? (g.heroImage as string) :
                                isValidUrl(g.iconUrl || g.icon_url_external) ? ((g.iconUrl || g.icon_url_external) as string) :
                                    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200'}
                            alt={g.name}
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

            {/* Accent Tint */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${accent}44 0%, transparent 60%)`,
                opacity: isAnimating ? 0 : 0.6,
                transition: 'opacity 0.6s ease',
                zIndex: 1,
                mixBlendMode: 'overlay'
            }} />

            {/* Global Dark Tint - Subtle overlay to make text pop */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.2)', // 20% flat black overlay
                zIndex: 1
            }} />

            {/* Accent Tint */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${accent}44 0%, transparent 60%)`,
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

            {/* Left Edge Gradient */}
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
                height: '80px',
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
                transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Platform Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    {Array.isArray(game.platforms) && game.platforms.map(p => (
                        <div key={p} style={{
                            padding: '0.4rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            {p === 'Windows' && <Image src="/platforms/windows.png" width={20} height={20} alt="Windows" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                            {p === 'Android' && <Image src="/platforms/playstore_logo.png" width={22} height={22} alt="Play Store" style={{ objectFit: 'contain' }} />}
                            {p === 'iOS' && <Image src="/platforms/appstore_logo.png" width={22} height={22} alt="App Store" style={{ objectFit: 'contain' }} />}
                            {p === 'Steam' && <Image src="/platforms/steam_logo.png" width={22} height={22} alt="Steam" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                            {p === 'Xbox' && <Image src="/platforms/xbox.png" width={18} height={18} alt="Xbox" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                            {p === 'PS' && <Image src="/platforms/ps.png" width={20} height={20} alt="PS" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                            {!['Windows', 'Android', 'iOS', 'Xbox', 'PS', 'Steam'].includes(p) && <Globe size={20} color="white" />}
                        </div>
                    ))}
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2.2rem',
                    fontWeight: '900',
                    lineHeight: '1.05',
                    marginBottom: '0.5rem',
                    letterSpacing: '-1px',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)' // Enhanced multi-layer shadow
                }}>
                    {game.name}
                </h1>

                {/* Category Tag */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {game.category}
                    </span>
                    {game.rating && (
                        <>
                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fbbf24' }}>
                                ★ {game.rating}
                            </span>
                        </>
                    )}
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link href={`/app/${game.id}`} className="ios-btn-haptic btn-premium-glow haptic-scale" style={{
                        background: accent,
                        color: 'white',
                        padding: '0.6rem 1.6rem',
                        borderRadius: '100px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        textDecoration: 'none',
                        boxShadow: `0 4px 20px ${accent}66`
                    }}>
                        <Play size={18} fill="currentColor" /> PLAY
                    </Link>
                    <Link href={`/app/${game.id}`} className="ios-btn-haptic haptic-scale" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textDecoration: 'none'
                    }}>
                        <Info size={18} />
                    </Link>
                </div>

                {/* Short Description */}
                {game.description && (
                    <p style={{
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: '500',
                        lineHeight: '1.4',
                        marginTop: '0.75rem',
                        maxWidth: '320px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {game.description}
                    </p>
                )}
            </div>

            {/* Slide Indicators */}
            {games.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    right: '1.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 15
                }}>
                    {games.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            style={{
                                width: currentIndex === idx ? '24px' : '6px',
                                height: '4px',
                                borderRadius: '10px',
                                background: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        />
                    ))}
                </div>
            )}

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
        </section>
    );
};
