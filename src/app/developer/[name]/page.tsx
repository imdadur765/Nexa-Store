"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { User, Package, Star as StarIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useApps } from "@/hooks/useApps";
import { motion } from "framer-motion";

const Star = StarIcon;

export default function DeveloperPage() {
    const params = useParams();
    const router = useRouter();
    const { apps: allApps, loading } = useApps();
    
    // Decode and format developer name
    const rawName = params.name as string;
    const developerName = decodeURIComponent(rawName);

    const developerApps = useMemo(() => {
        return allApps.filter(app => 
            app.developer?.toLowerCase() === developerName.toLowerCase() ||
            app.name.toLowerCase().includes(developerName.toLowerCase()) // Fallback search
        );
    }, [allApps, developerName]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '8rem' }}>
            <PageHeader
                title={developerName}
                icon={<User size={14} />}
                backText="Store"
                accentColor="#3b82f6"
            />

            <div style={{ padding: '0 1.25rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        padding: '0.4rem 1rem', 
                        borderRadius: '100px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Package size={14} /> {developerApps.length} Apps Published
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3, 4].map(i => <div key={i} className="glass" style={{ height: '80px', borderRadius: '24px', opacity: 0.1 }} />)}
                    </div>
                ) : developerApps.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {developerApps.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
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
                                    }}
                                >
                                    <div className="ios-squircle" style={{
                                        width: '60px',
                                        height: '60px',
                                        background: app.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        <img src={app.iconUrl || app.icon_url_external} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '2px', letterSpacing: '-0.3px' }}>{app.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{app.category}</span>
                                            <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: '800' }}>
                                                {app.rating} <Star size={12} fill="currentColor" stroke="none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '100px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: '900',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>GET</div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div style={{ 
                        padding: '4rem 2rem', 
                        textAlign: 'center', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '32px',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <Package size={48} style={{ margin: '0 auto 1.5rem auto', opacity: 0.2 }} />
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>No apps found</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            We couldn't find any public apps from this developer.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}


