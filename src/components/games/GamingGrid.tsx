"use client";
import React from 'react';
import { AppEntry } from '@/data/apps';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Download, Globe, Zap } from 'lucide-react';
import { isValidUrl } from '@/lib/utils';
import { SectionHeader } from '../SectionHeader';

interface GamingGridProps {
    title: string;
    games: AppEntry[];
    limit?: number;
    seeAllHref?: string;
}

const GamingGridItem = ({ game }: { game: AppEntry }) => {
    const [imgError, setImgError] = React.useState(false);
    return (
        <Link key={game.id} href={`/app/${game.id}`} className="ultra-glass haptic-scale gaming-grid-card hw-accel" style={{
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '24px',
            padding: '0.75rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 15px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
            }}>
                <Image
                    src={imgError ? 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80' :
                        (isValidUrl(game.iconUrl) ? (game.iconUrl as string) :
                            isValidUrl(game.heroImage) ? (game.heroImage as string) :
                                `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200`)}
                    alt={game.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={() => setImgError(true)}
                />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginBottom: '0.2rem',
                    letterSpacing: '-0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{game.name}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.category}</span>
                    <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: '#fbbf24', fontSize: '0.7rem', fontWeight: '800' }}>
                        {game.rating} <Star size={10} fill="currentColor" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.downloads} dl</span>
                    </div>
                    <div className="ios-btn-haptic" style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '100px',
                        background: 'rgba(0, 122, 255, 0.15)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.7rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid rgba(0, 122, 255, 0.2)'
                    }}>
                        GET
                    </div>
                </div>
            </div>

            {/* Store Icon Overlay - Top Right corner */}
            <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                display: 'flex',
                gap: '0.3rem',
                zIndex: 4
            }}>
                {game.storeSource?.includes('playstore') && (
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                        <Image src="/platforms/playstore_logo.png" alt="Google Play" width={16} height={16} style={{ objectFit: 'contain' }} />
                    </div>
                )}
                {game.storeSource?.includes('appstore') && (
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                        <Image src="/platforms/appstore_logo.png" alt="App Store" width={16} height={16} style={{ objectFit: 'contain' }} />
                    </div>
                )}
                {game.storeSource?.includes('steam') && (
                    <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                        <Image src="/platforms/steam_logo.png" alt="Steam" width={16} height={16} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    </div>
                )}
                {game.storeSource?.includes('epic') && (
                    <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                        <Zap size={14} color="#ffffff" fill="white" />
                    </div>
                )}
            </div>

            {game.trending && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #ff4b2b, #ff416c)',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '3px'
                }}>
                    <Zap size={8} color="white" fill="white" style={{ transform: 'translateX(-1px) translateY(-1px)' }} />
                </div>
            )}
        </Link>
    );
};

function GamingGridInner({ title, games, limit = 6, seeAllHref }: GamingGridProps) {
    const displayGames = games.slice(0, limit);

    return (
        <section style={{ marginBottom: '4rem', padding: '0 0.5rem' }}>
            <SectionHeader
                title={title}
                seeAllHref={seeAllHref}
                marginTop="0"
                marginBottom="1.5rem"
            />

            <div className="gaming-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
            }}>
                {displayGames.map(game => (
                    <GamingGridItem key={game.id} game={game} />
                ))}
            </div>

            <style jsx>{`
                @media (max-width: 640px) {
                    .gaming-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section >
    );
}


export const GamingGrid = React.memo(GamingGridInner);
