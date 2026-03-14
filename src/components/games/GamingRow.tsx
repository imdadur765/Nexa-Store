"use client";
import React from 'react';
import { AppEntry } from '@/data/apps';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProxiedImageUrl } from '@/lib/utils';
import { SectionHeader } from '../SectionHeader';
import { IconType } from '@/data/apps';
import { Shield, Flame, Terminal, Rocket, Globe, MessageCircle, Play, Music, Camera, ShoppingBag, Gamepad2 } from "lucide-react";

// Local IconMap for the CompactCard fallback
const IconMap: Record<IconType, React.ReactNode> = {
    zap: <Zap size={24} color="#3b82f6" />,
    shield: <Shield size={24} color="#8b5cf6" />,
    flame: <Flame size={24} color="#f59e0b" />,
    terminal: <Terminal size={24} color="#10b981" />,
    rocket: <Rocket size={24} color="#ef4444" />,
    globe: <Globe size={24} color="#0ea5e9" />,
    message: <MessageCircle size={24} color="#10b981" />,
    play: <Play size={24} color="#ef4444" />,
    music: <Music size={24} color="#1db954" />,
    camera: <Camera size={24} color="#d946ef" />,
    shop: <ShoppingBag size={24} color="#f59e0b" />,
    game: <Gamepad2 size={24} color="#f59e0b" />,
};

interface GamingRowProps {
    title: string;
    games: AppEntry[];
    seeAllHref?: string;
}

const MotionLink = motion.create(Link);

// Featured Cover Art Item — iOS App Store Style (text below image)
const GamingCoverItem = ({ game, index = 0 }: { game: AppEntry, index?: number }) => {
    const [imgError, setImgError] = React.useState(false);
    return (
        <Link
            key={game.id}
            href={`/app/${game.id}`}
            className="ios-btn-haptic"
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                flexShrink: 0,
            }}>

            {/* ─── Clean Image Area ─── */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                <Image
                    src={imgError ? 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80' :
                        (getProxiedImageUrl(game.slider_image_url) ||
                            getProxiedImageUrl(game.heroImage) ||
                            getProxiedImageUrl(game.iconUrl) ||
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600')}
                    alt={game.name}
                    fill
                    sizes="(max-width: 640px) 80vw, 380px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={() => setImgError(true)}
                />
                {/* Only subtle bottom fade so image bleeds into info panel */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)' }} />

                {/* Floating top-right rating pill only */}
                <div style={{
                    position: 'absolute', top: '0.6rem', right: '0.6rem',
                    padding: '0.25rem 0.55rem', borderRadius: '100px',
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.7rem', fontWeight: '800', color: '#fbbf24',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {game.rating} <Star size={10} fill="currentColor" />
                </div>

                {/* Trending pill top-left */}
                {game.trending && (
                    <div style={{
                        position: 'absolute', top: '0.6rem', left: '0.6rem',
                        padding: '0.25rem 0.55rem', borderRadius: '100px',
                        background: 'linear-gradient(135deg,#ff4b2b,#ff416c)',
                        fontSize: '0.6rem', fontWeight: '900', color: 'white',
                        boxShadow: '0 2px 8px rgba(255,75,43,0.5)'
                    }}>🔥 Hot</div>
                )}
            </div>

            {/* ─── Clean Info Panel below image ─── */}
            <div style={{ padding: '0.85rem 1rem 1rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                {/* Small app icon */}
                <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    overflow: 'hidden', position: 'relative',
                    background: game.gradient || '#222', flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.35)'
                }}>
                    {getProxiedImageUrl(game.iconUrl || game.icon_url_external) && (
                        <Image src={getProxiedImageUrl(game.iconUrl || game.icon_url_external)!} alt="" fill sizes="46px" style={{ objectFit: 'cover' }} />
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'white', letterSpacing: '-0.3px', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {game.name}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginBottom: '0.4rem' }}>
                        {game.category}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {game.description}
                    </p>
                </div>

                {/* GET button */}
                <div style={{
                    flexShrink: 0,
                    padding: '0.4rem 1rem',
                    borderRadius: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'white',
                    fontSize: '0.78rem',
                    fontWeight: '900',
                    letterSpacing: '0.3px',
                    alignSelf: 'center'
                }}>
                    GET
                </div>
            </div>
        </Link>
    );
};

// Premium Compact App List Item with Rank Number
const AppListItem = ({ app, rank }: { app: AppEntry; rank?: number }) => {
    return (
        <Link href={`/app/${app.id}`} className="ios-btn-haptic" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: '0.75rem',
            padding: '0.65rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
            {/* Optional Rank Number */}
            {typeof rank === 'number' && (
                <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    color: rank <= 3 ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                    width: '20px',
                    textAlign: 'center',
                    flexShrink: 0,
                    letterSpacing: '-1px',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1
                }}>
                    {rank}
                </span>
            )}

            {/* Icon */}
            <div className="ios-squircle ios-card-shadow" style={{
                width: '58px',
                height: '58px',
                background: (app.iconUrl || app.icon_url_external) ? 'transparent' : app.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '14px',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                {getProxiedImageUrl(app.iconUrl || app.icon_url_external) ? (
                    <Image
                        src={getProxiedImageUrl(app.iconUrl || app.icon_url_external)!}
                        alt={app.name}
                        fill
                        sizes="58px"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{ color: 'white', opacity: 0.95, transform: 'scale(1.15)' }}>
                        {IconMap[app.iconId]}
                    </div>
                )}
                {/* Trending badge overlay on icon */}
                {app.trending && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', background: '#ef4444', borderRadius: '4px', width: '8px', height: '8px', boxShadow: '0 0 4px rgba(239,68,68,0.8)' }} />
                )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    marginBottom: '0.12rem',
                    letterSpacing: '-0.2px'
                }}>
                    {app.name}
                </h4>
                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '0.15rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {app.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={9} fill={s <= Math.round(Number(app.rating)) ? "#f59e0b" : "transparent"} color={s <= Math.round(Number(app.rating)) ? "#f59e0b" : "rgba(255,255,255,0.15)"} />
                    ))}
                    <span style={{ fontSize: '0.6rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginLeft: '0.1rem' }}>
                        {app.rating}
                    </span>
                </div>
            </div>

            {/* GET Button */}
            <div style={{
                flexShrink: 0,
                padding: '0.35rem 1rem',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '900',
                letterSpacing: '0.3px'
            }}>
                GET
            </div>
        </Link>
    );
};

function GamingRowInner({ title, games, seeAllHref }: GamingRowProps) {
    if (!games || games.length === 0) return null;

    // --- Build column groups ---
    // Every "column" in the carousel is: [GamingCoverItem] + up to 2 [AppListItem]s below it
    // We build groups of 3 apps (1 hero + 2 below), then trail the rest as pure app columns of 3
    const APPS_PER_COLUMN = 3;
    const columns: Array<{ cover: AppEntry; below: AppEntry[] } | { items: AppEntry[] }> = [];
    
    let i = 0;
    const COVER_EVERY = 3; // insert a cover column every N regular columns
    let regularColCount = 0;

    while (i < games.length) {
        if (regularColCount % COVER_EVERY === 0) {
            // Insert a "cover + 2 items" column
            const cover = games[i];
            const below = games.slice(i + 1, i + APPS_PER_COLUMN);
            columns.push({ cover, below });
            i += APPS_PER_COLUMN;
            regularColCount = 0;
        } else {
            // Insert a regular "3 items" column
            const items = games.slice(i, i + APPS_PER_COLUMN);
            columns.push({ items });
            i += APPS_PER_COLUMN;
            regularColCount++;
        }
    }

    return (
        <section style={{ marginBottom: '2.5rem' }}>
            {/* Section Header */}
            <div style={{ padding: '0 1.25rem' }}>
                <SectionHeader
                    title={title}
                    seeAllHref={seeAllHref}
                    marginTop="0"
                    marginBottom="1rem"
                />
            </div>

            <div className="modern-horizontal-carousel">
                {columns.map((col, colIdx) => {
                    if ('cover' in col) {
                        return (
                            <div key={colIdx} className="carousel-column carousel-cover-column">
                                {/* Cover art item */}
                                <GamingCoverItem game={col.cover} index={colIdx} />
                                {/* Apps below the cover art */}
                                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.5rem', paddingTop: '0.25rem' }}>
                                    {col.below.map(app => (
                                        <AppListItem key={app.id} app={app} />
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={colIdx} className="carousel-column carousel-list-column">
                                {col.items.map(app => (
                                    <AppListItem key={app.id} app={app} />
                                ))}
                            </div>
                        );
                    }
                })}
            </div>
        </section>
    );
}

export const GamingRow = React.memo(GamingRowInner);

