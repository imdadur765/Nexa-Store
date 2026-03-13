"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Info, Globe } from 'lucide-react';
import { AppEntry } from '@/data/apps';
import Link from 'next/link';
import { isValidUrl, getProxiedImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface GameHeroProps {
    games: AppEntry[];
}

export const GameHero: React.FC<GameHeroProps> = ({ games }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
    const [isHorizontal, setIsHorizontal] = useState(false);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setDirection(1);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % games.length);
            setIsAnimating(false);
        }, 400);
    }, [games.length, isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setDirection(-1);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
            setIsAnimating(false);
        }, 400);
    }, [games.length, isAnimating]);

    useEffect(() => {
        if (games.length <= 1) return;
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [nextSlide, games.length]);

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex || isAnimating) return;
        setDirection(index > currentIndex ? 1 : -1);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 400);
    }, [currentIndex, isAnimating]);

    const game = games[currentIndex];


    if (!game) return null;

    const accent = game.accentColor || 'rgba(59, 130, 246, 1)';

    return (
        <section className="hw-accel game-hero-container" style={{
            position: 'relative',
            height: isHorizontal ? '220px' : '340px',
            borderRadius: '24px',
            margin: '0 0.75rem 2rem',
            overflow: 'hidden',
            zIndex: 10,
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `0 20px 50px -10px ${accent}66, 0 0 0 1px rgba(255,255,255,0.1)` // Dynamic glow + subtle border
        }}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={{
                        enter: (direction: number) => ({
                            x: direction > 0 ? '100%' : '-100%',
                            opacity: 0,
                            scale: 0.95
                        }),
                        center: {
                            zIndex: 1,
                            x: 0,
                            opacity: 1,
                            scale: 1
                        },
                        exit: (direction: number) => ({
                            zIndex: 0,
                            x: direction < 0 ? '100%' : '-100%',
                            opacity: 0,
                            scale: 0.95
                        })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.4 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                        if (swipe) {
                            if (offset.x > 0) {
                                prevSlide();
                            } else {
                                nextSlide();
                            }
                        }
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        cursor: 'grab'
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                >
                    <Image
                        src={getProxiedImageUrl(game.slider_image_url) ||
                            getProxiedImageUrl(game.heroImage) ||
                            getProxiedImageUrl(game.screenshots?.[0]) ||
                            getProxiedImageUrl(game.iconUrl || game.icon_url_external) ||
                            'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200'}
                        alt={game.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        style={{
                            objectFit: 'cover'
                        }}
                        priority
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth && img.naturalHeight) {
                                // Use a slightly lower threshold to be safe
                                setIsHorizontal(img.naturalWidth / img.naturalHeight > 1.1);
                            }
                        }}
                    />

                    {/* Global Dark Tint */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.2)',
                        zIndex: 1
                    }} />

                    {/* Accent Tint */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(135deg, ${accent}44 0%, transparent 60%)`,
                        zIndex: 1,
                        mixBlendMode: 'overlay'
                    }} />

                    {/* Bottom Gradient */}
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
                        bottom: isHorizontal ? '1.5rem' : '2.5rem',
                        left: isHorizontal ? '1.5rem' : '1.75rem',
                        right: isHorizontal ? '1.5rem' : '1.75rem',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        {/* Platform Badges */}
                        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
                            {Array.isArray(game.platforms) && game.platforms.map(p => (
                                <div key={p} style={{
                                    padding: isHorizontal ? '0.3rem' : '0.4rem',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: isHorizontal ? '30px' : '36px',
                                    height: isHorizontal ? '30px' : '36px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}>
                                    {p === 'Windows' && <Image src="/platforms/windows.png" width={isHorizontal ? 16 : 20} height={isHorizontal ? 16 : 20} alt="Windows" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                                    {p === 'Android' && <Image src="/platforms/playstore_logo.png" width={isHorizontal ? 18 : 22} height={isHorizontal ? 18 : 22} alt="Play Store" style={{ objectFit: 'contain' }} />}
                                    {p === 'iOS' && <Image src="/platforms/appstore_logo.png" width={isHorizontal ? 18 : 22} height={isHorizontal ? 18 : 22} alt="App Store" style={{ objectFit: 'contain' }} />}
                                    {p === 'Steam' && <Image src="/platforms/steam_logo.png" width={isHorizontal ? 18 : 22} height={isHorizontal ? 18 : 22} alt="Steam" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                                    {p === 'Xbox' && <Image src="/platforms/xbox.png" width={isHorizontal ? 14 : 18} height={isHorizontal ? 14 : 18} alt="Xbox" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                                    {p === 'PS' && <Image src="/platforms/ps.png" width={isHorizontal ? 16 : 20} height={isHorizontal ? 16 : 20} alt="PS" style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
                                    {!['Windows', 'Android', 'iOS', 'Xbox', 'PS', 'Steam'].includes(p) && <Globe size={isHorizontal ? 16 : 20} color="white" />}
                                </div>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: isHorizontal ? '1.8rem' : '2.2rem',
                            fontWeight: '900',
                            lineHeight: '1.05',
                            marginBottom: '0.5rem',
                            letterSpacing: '-1px',
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.6)'
                        }}>
                            {game.name}
                        </h1>

                        {/* Category Tag */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: isHorizontal ? '0.75rem' : '1rem'
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
                        <p style={{
                            fontSize: isHorizontal ? '0.75rem' : '0.82rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: '500',
                            marginBottom: isHorizontal ? '0.8rem' : '1.25rem',
                            maxWidth: isHorizontal ? '350px' : '450px',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: isHorizontal ? 1 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {game.description}
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', pointerEvents: 'auto' }}>
                            <Link href={`/app/${game.id}`} className="ios-btn-haptic btn-premium-glow haptic-scale" style={{
                                background: accent,
                                color: 'white',
                                padding: isHorizontal ? '0.4rem 1.8rem' : '0.6rem 2.5rem',
                                fontSize: isHorizontal ? '0.85rem' : '1rem',
                                borderRadius: '100px',
                                fontWeight: '900',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                boxShadow: `0 8px 25px ${accent}88`
                            }}>
                                <Play size={isHorizontal ? 16 : 18} fill="currentColor" /> PLAY
                            </Link>
                            <Link href={`/app/${game.id}`} className="ios-btn-haptic haptic-scale" style={{
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
                </motion.div>
            </AnimatePresence>

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
                                width: currentIndex === idx ? (isHorizontal ? '20px' : '24px') : '6px',
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
