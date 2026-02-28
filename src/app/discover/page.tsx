"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rocket, Star, Zap, Download } from "lucide-react";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { isValidUrl } from "@/lib/utils";
import AppCard from "@/components/AppCard";

export default function DiscoverPage() {
    const router = useRouter();
    const { apps } = useApps();
    const activeApps = apps.length > 0 ? apps : staticApps;
    const discover = activeApps.slice(4, 24); // Extended slice for discover page

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
            <header
                className="ultra-glass"
                style={{
                    padding: '0.6rem 1.25rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    background: 'rgba(5, 5, 5, 0.4)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <button
                            onClick={() => router.back()}
                            style={{ background: 'none', border: 'none', color: 'white', padding: '4px', display: 'flex', alignItems: 'center' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '24px', height: '24px', background: 'var(--accent-primary)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Download size={14} color="white" />
                            </div>
                            <h1 style={{ fontSize: '1rem', fontWeight: '900', letterSpacing: '-0.4px' }}>Discovery</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ padding: '1.5rem 1.25rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>More to Discover</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Endless modules for your Nexa experience.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1rem'
                }}>
                    {discover.map((app) => (
                        <div key={app.id}>
                            <AppCard app={app} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
