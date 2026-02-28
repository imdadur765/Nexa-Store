"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap, ChevronRight, Globe } from "lucide-react";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { isValidUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

export default function TopCharts() {
    const { apps } = useApps();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Top Free");
    const activeApps = apps.length > 0 ? apps : staticApps;

    const filteredTopApps = useMemo(() => {
        let baseApps = activeApps.filter(app => app.isTopChart || app.rating > 4.5);

        if (activeTab === "Top Rated") {
            return baseApps.sort((a, b) => b.rating - a.rating).slice(0, 5);
        }
        if (activeTab === "PC") {
            baseApps = baseApps.filter(app => app.platforms?.includes('Windows'));
        }
        if (activeTab === "Console") {
            baseApps = baseApps.filter(app => app.platforms?.includes('Xbox') || app.platforms?.includes('PS'));
        }

        return baseApps.sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 5);
    }, [activeApps, activeTab]);

    const tabs = ["Top Free", "Top Rated", "PC", "Console"];

    return (
        <div style={{ marginTop: '2.5rem', padding: '0 1rem' }}>
            <SectionHeader
                title="Top Charts"
                seeAllHref="/top-charts"
                marginTop="0"
                marginBottom="1.25rem"
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="play-btn-outline"
                        style={{
                            position: 'relative',
                            background: 'transparent',
                            borderColor: activeTab === tab ? 'transparent' : 'rgba(255,255,255,0.1)',
                            color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                            minWidth: 'fit-content',
                            zIndex: 1
                        }}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'var(--accent-primary)',
                                    borderRadius: '100px',
                                    zIndex: -1
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredTopApps.map((app, index) => (
                    <Link
                        key={app.id}
                        href={`/app/${app.id}`}
                        className="ultra-glass haptic-scale"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.85rem',
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'var(--transition-smooth)'
                        }}
                    >
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '900',
                            color: 'rgba(255,255,255,0.3)',
                            width: '24px',
                            textAlign: 'center',
                            marginRight: '0.25rem'
                        }}>
                            {index + 1}
                        </div>

                        <div className="ios-squircle" style={{
                            width: '56px',
                            height: '56px',
                            background: app.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}>
                            {isValidUrl(app.iconUrl) ? (
                                <Image src={app.iconUrl as string} alt={app.name} width={56} height={56} style={{ objectFit: 'cover' }} loading="lazy" />
                            ) : (
                                <Zap size={24} color="white" fill="white" />
                            )}

                            {/* Store Badge Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                display: 'flex',
                                gap: '2px',
                                zIndex: 3
                            }}>
                                {app.storeSource?.includes('playstore') && (
                                    <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '3px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                        <Image src="/platforms/playstore_logo.png" alt="Play Store" width={12} height={12} style={{ objectFit: 'contain' }} />
                                    </div>
                                )}
                                {app.storeSource?.includes('appstore') && (
                                    <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '3px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                        <Image src="/platforms/appstore_logo.png" alt="App Store" width={12} height={12} style={{ objectFit: 'contain' }} />
                                    </div>
                                )}
                                {app.storeSource?.includes('steam') && (
                                    <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '3px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
                                        <Image src="/platforms/steam_logo.png" alt="Steam" width={12} height={12} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', marginBottom: '0.1rem', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {app.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '700' }}>
                                <span>{app.category}</span>
                                <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: '#fbbf24' }}>
                                    {app.rating} <Star size={11} fill="currentColor" stroke="none" />
                                </div>
                            </div>
                        </div>

                        <div
                            className="play-btn-outline btn-premium-glow"
                            style={{
                                padding: '0.35rem 1.15rem',
                                borderRadius: '100px',
                                fontSize: '0.7rem',
                                fontWeight: '900',
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'var(--accent-primary)',
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
