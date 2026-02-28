"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    ArrowLeft, Search, Filter, Users,
    Smartphone, Download, Package, ExternalLink,
    ShieldAlert, ChevronRight, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface DeveloperStats {
    name: string;
    totalApps: number;
    totalDownloads: number;
    lastActive: string;
    apps: any[];
}

export default function DeveloperRegistry() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [developers, setDevelopers] = useState<DeveloperStats[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                fetchData();
            }
        };
        checkAuth();
    }, [router]);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            // Aggregate developers
            const devMap = new Map<string, DeveloperStats>();

            data.forEach(app => {
                const devName = app.developer || "Unknown Developer";
                const stats = devMap.get(devName) || {
                    name: devName,
                    totalApps: 0,
                    totalDownloads: 0,
                    lastActive: app.created_at,
                    apps: [] as any[]
                };

                stats.totalApps += 1;
                // Parse downloads string (e.g., "50K+" -> 50000)
                const dlCount = parseInt(app.downloads?.replace(/[^0-9]/g, '') || "0");
                stats.totalDownloads += dlCount;
                stats.apps.push(app);

                if (new Date(app.created_at) > new Date(stats.lastActive)) {
                    stats.lastActive = app.created_at;
                }

                devMap.set(devName, stats);
            });

            setDevelopers(Array.from(devMap.values()).sort((a, b) => b.totalApps - a.totalApps));
        }
        setLoading(false);
    };

    const filteredDevs = useMemo(() => {
        return developers.filter(dev =>
            dev.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [developers, searchQuery]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '2rem' }}>
            {/* Header */}
            <header className="ultra-glass" style={{
                position: 'sticky', top: 0, zIndex: 100, padding: '1rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>👥 Developer Registry</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Nexa Governance • {filteredDevs.length} total creators</p>
                </div>
            </header>

            <div style={{ padding: '1rem' }}>
                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search developers by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '16px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                            color: 'white', fontSize: '0.9rem'
                        }}
                    />
                </div>

                {/* Registry List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <RefreshCw size={32} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : filteredDevs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <Users size={48} opacity={0.1} style={{ marginBottom: '1rem' }} />
                            <p>No developers found.</p>
                        </div>
                    ) : (
                        filteredDevs.map((dev) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={dev.name}
                                className="ultra-glass"
                                style={{
                                    padding: '1.25rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)',
                                    display: 'flex', flexDirection: 'column', gap: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                        {dev.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{dev.name}</h3>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Last active: {new Date(dev.lastActive).toLocaleDateString()}</p>
                                    </div>
                                    <Link href={`/admin/manage/all?q=${encodeURIComponent(dev.name)}`} style={{ textDecoration: 'none' }}>
                                        <button style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            View Apps <ChevronRight size={14} />
                                        </button>
                                    </Link>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                            <Package size={14} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase' }}>Total Apps</span>
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '900' }}>{dev.totalApps}</div>
                                    </div>
                                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                            <Download size={14} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase' }}>Impressions</span>
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '900' }}>{dev.totalDownloads.toLocaleString()}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
