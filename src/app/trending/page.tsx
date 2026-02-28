"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, Star, Zap, Download } from "lucide-react";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { isValidUrl } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export default function TrendingPage() {
    const router = useRouter();
    const { apps } = useApps();
    const activeApps = apps.length > 0 ? apps : staticApps;
    const trending = activeApps.filter(app => app.trending);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
            <PageHeader
                title="Trending Powerhouses"
                accentColor="#f59e0b"
            />

            <div style={{ padding: '1.5rem 1.25rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hot Right Now</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The most popular modules in the community.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {trending.map((app) => (
                        <Link
                            key={app.id}
                            href={`/app/${app.id}`}
                            className="ultra-glass haptic-scale"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '24px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'var(--transition-smooth)'
                            }}
                        >
                            <div className="ios-squircle" style={{
                                width: '64px',
                                height: '64px',
                                background: app.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
                            }}>
                                {isValidUrl(app.iconUrl) ? (
                                    <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Flame size={32} color="white" fill="white" />
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.3px' }}>{app.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{app.category}</span>
                                    <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: '800' }}>
                                        {app.rating} <Star size={12} fill="currentColor" stroke="none" />
                                    </div>
                                </div>
                            </div>

                            <div className="play-btn-outline btn-premium-glow" style={{
                                padding: '0.45rem 1.15rem',
                                borderRadius: '100px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                color: '#f59e0b',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                fontSize: '0.7rem',
                                fontWeight: '900'
                            }}>GET</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
