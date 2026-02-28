"use client";
import React from 'react';
import { AppEntry } from '@/data/apps';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Download, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { isValidUrl } from '@/lib/utils';
import { SectionHeader } from '../SectionHeader';

interface GamingRowProps {
    title: string;
    games: AppEntry[];
    seeAllHref?: string;
}

const MotionLink = motion.create(Link);

const GamingItem = ({ game, index = 0 }: { game: AppEntry, index?: number }) => {
    const [imgError, setImgError] = React.useState(false);
    return (
        <MotionLink
            key={game.id}
            href={`/app/${game.id}`}
            className="ios-btn-haptic haptic-scale game-card-width snap-align-start hw-accel"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
                flex: '0 0 220px',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'visible'
            }}>
            {/* Removed heavy filter: blur(35px) ambient glow div for perf */}

            <div className="liquid-glass game-card-img-container hw-accel" style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '0.75rem',
                zIndex: 1
            }}>
                <Image
                    src={imgError ? 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80' :
                        (isValidUrl(game.heroImage) ? (game.heroImage as string) :
                            isValidUrl(game.iconUrl) ? (game.iconUrl as string) :
                                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600')}
                    alt={game.name}
                    fill
                    sizes="220px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={() => setImgError(true)}
                />

                {/* Rating Badge — no backdrop-filter */}
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#fbbf24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    zIndex: 2
                }}>
                    {game.rating} <Star size={10} fill="currentColor" />
                </div>

                {game.trending && (
                    <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ff4b2b, #ff416c)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.6rem',
                        fontWeight: '900',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(255, 75, 43, 0.4)',
                        zIndex: 3,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                    }}>
                        <Star size={10} fill="currentColor" stroke="none" /> Hot
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    gap: '0.4rem',
                    zIndex: 2
                }}>
                    {game.storeSource?.includes('playstore') && (
                        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <Image src="/platforms/playstore_logo.png" alt="Google Play" width={22} height={22} style={{ objectFit: 'contain' }} />
                        </div>
                    )}
                    {game.storeSource?.includes('appstore') && (
                        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <Image src="/platforms/appstore_logo.png" alt="App Store" width={24} height={24} style={{ objectFit: 'contain' }} />
                        </div>
                    )}
                    {game.storeSource?.includes('steam') && (
                        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <Image src="/platforms/steam_logo.png" alt="Steam" width={22} height={22} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                        </div>
                    )}
                    {game.storeSource?.includes('epic') && (
                        <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <Zap size={18} color="#ffffff" fill="white" />
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '0 0.5rem', position: 'relative', zIndex: 1 }}>
                <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    marginBottom: '0.1rem',
                    letterSpacing: '-0.3px'
                }}>{game.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.category}</span>
                        <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.downloads}</span>
                    </div>
                    <div style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '100px',
                        background: 'rgba(0, 122, 255, 0.12)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.7rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid rgba(0, 122, 255, 0.2)',
                        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)'
                    }}>
                        <Download size={11} strokeWidth={3} /> GET
                    </div>
                </div>
            </div>
        </MotionLink>
    );
};

function GamingRowInner({ title, games, seeAllHref }: GamingRowProps) {
    return (
        <section style={{ marginBottom: '4rem' }}>
            <SectionHeader
                title={title}
                seeAllHref={seeAllHref}
                marginTop="0"
                marginBottom="1.25rem"
            />

            <div className="no-scrollbar snap-x-mandatory mobile-edge-to-edge" style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                padding: '0.5rem 1rem',
                paddingRight: '2rem'
            }}>
                {games.map((game, index) => (
                    <GamingItem key={game.id} game={game} index={index} />
                ))}
            </div>
        </section>
    );
}

export const GamingRow = React.memo(GamingRowInner);

