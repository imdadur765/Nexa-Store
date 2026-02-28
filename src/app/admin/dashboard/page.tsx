"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit2, Trash2, LogOut, Package, HardDrive, Smartphone, Users, RefreshCw, Zap, ShieldCheck, Layout, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState<any[]>([]);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
            } else {
                await fetchApps();
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const fetchApps = async () => {
        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching apps:', error);
            return;
        }
        if (data) setApps(data);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this app?')) return;
        setDeleting(id);
        const { error } = await supabase.from('apps').delete().eq('id', id);
        if (error) {
            alert('Error deleting app: ' + error.message);
        } else {
            setApps(prev => prev.filter(app => app.id !== id));
        }
        setDeleting(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    const handleHeroToggle = async (id: number, currentStatus: boolean) => {
        const { error } = await supabase
            .from('apps')
            .update({ is_hero: !currentStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating slider status: ' + error.message);
        } else {
            setApps(prev => prev.map(app =>
                app.id === id ? { ...app, is_hero: !currentStatus } : app
            ));
        }
    };

    const handleApprove = async (id: number) => {
        const { error } = await supabase
            .from('apps')
            .update({ status: 'approved' })
            .eq('id', id);

        if (error) {
            alert('Error approving app: ' + error.message);
        } else {
            setApps(prev => prev.map(app =>
                app.id === id ? { ...app, status: 'approved' } : app
            ));
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <RefreshCw size={32} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
            {/* Immersive Background Orbs */}
            <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: 0.15, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '250px', height: '250px', background: '#ec4899', opacity: 0.1, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
            {/* Header */}
            <header className="liquid-glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(50px) saturate(200%)',
                borderRadius: '0 0 24px 24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                        <Layout size={18} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Command Center</h1>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button onClick={fetchApps} className="ios-btn-haptic" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={handleLogout} className="ios-btn-haptic" style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={16} /> Exit
                    </button>
                </div>
            </header>

            <div style={{ padding: '1.25rem' }}>
                {/* ── Service Cards (Nexa Command Center) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>

                    {/* All Apps Card */}
                    <motion.div whileHover={{ y: -5 }} className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(20px)', borderRadius: '50%' }} />
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <Package size={22} color="var(--accent-primary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-1px' }}>{apps.length}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>Active Registry</p>
                        </div>
                        <Link href="/admin/manage/all" style={{ marginTop: 'auto', textDecoration: 'none' }}>
                            <button className="ios-btn-haptic" style={{ width: '100%', padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}>
                                Manage All
                            </button>
                        </Link>
                    </motion.div>

                    {/* Pending Review Card */}
                    <motion.div whileHover={{ y: -5 }} className="liquid-glass" style={{
                        padding: '1.5rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '1rem',
                        border: apps.filter(a => a.status === 'pending').length > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        background: apps.filter(a => a.status === 'pending').length > 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <ShieldCheck size={22} color="#f59e0b" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-1px' }}>{apps.filter(a => a.status === 'pending').length}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>Pending Audit</p>
                        </div>
                        <Link href="/admin/manage/pending" style={{ marginTop: 'auto', textDecoration: 'none' }}>
                            <button className="ios-btn-haptic" style={{
                                width: '100%', padding: '0.6rem', borderRadius: '12px',
                                background: apps.filter(a => a.status === 'pending').length > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                                border: 'none', color: apps.filter(a => a.status === 'pending').length > 0 ? 'black' : 'white',
                                fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer',
                                boxShadow: apps.filter(a => a.status === 'pending').length > 0 ? '0 8px 16px rgba(245, 158, 11, 0.3)' : 'none'
                            }}>
                                Open Queue
                            </button>
                        </Link>
                    </motion.div>

                    {/* Slider Control */}
                    <motion.div whileHover={{ y: -5 }} className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <Zap size={22} color="#f59e0b" fill="#f59e0b" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-1px' }}>{apps.filter(a => a.is_hero).length}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>Hero Slider</p>
                        </div>
                        <Link href="/admin/manage/hero" style={{ marginTop: 'auto', textDecoration: 'none' }}>
                            <button className="ios-btn-haptic" style={{ width: '100%', padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}>
                                Manage Slider
                            </button>
                        </Link>
                    </motion.div>

                    {/* Collections */}
                    <motion.div whileHover={{ y: -5 }} className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.05)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                            <Gem size={22} color="#fbbf24" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-1px' }}>{new Set(apps.flatMap(a => a.tags || []).filter(t => t.startsWith('row:'))).size}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>Curation Rows</p>
                        </div>
                        <Link href="/admin/manage/collections" style={{ marginTop: 'auto', textDecoration: 'none' }}>
                            <button className="ios-btn-haptic" style={{ width: '100%', padding: '0.6rem', borderRadius: '12px', background: '#fbbf24', border: 'none', color: 'black', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 16px rgba(251, 191, 36, 0.3)' }}>
                                Manage Rows
                            </button>
                        </Link>
                    </motion.div>

                </div>

                {/* ── Specialized Publishing Portals ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Publish New Content</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

                        {/* Add Game Portal */}
                        <Link href="/admin/add/game" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="ultra-glass"
                                style={{
                                    padding: '1.25rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)'
                                }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(139, 92, 246, 0.4)' }}>
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'white' }}>Publish Game</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>PC, Console, or Mobile</p>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Add Tool Portal */}
                        <Link href="/admin/add/tool" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="ultra-glass"
                                style={{
                                    padding: '1.25rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)'
                                }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)' }}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'white' }}>Publish Tool</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Utilities & System Scripts</p>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Add App Portal */}
                        <Link href="/admin/add/app" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="ultra-glass"
                                style={{
                                    padding: '1.25rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)'
                                }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.4)' }}>
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'white' }}>Publish App</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Social, Productivity, etc.</p>
                                </div>
                            </motion.div>
                        </Link>

                    </div>
                </div>

                {/* ── Recent Activity ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Recent Registry</h2>
                    <Link
                        href="/admin/manage/all"
                        style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '700' }}
                    >
                        View All Registry →
                    </Link>
                </div>

                {/* Simplified Recent Apps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {apps.slice(0, 5).map(app => (
                        <div key={app.id} className="ultra-glass" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '16px', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                            {app.icon_url ? (
                                <img src={app.icon_url} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Smartphone size={20} color="white" />
                                </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{app.name}</h3>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>{app.category} • v{app.version}</p>
                            </div>
                            <button onClick={() => router.push(`/admin/edit/${app.id}`)} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px', border: 'none', color: 'white' }}>
                                <Edit2 size={14} />
                            </button>
                        </div>
                    ))}
                    {apps.length > 5 && (
                        <Link href="/admin/manage/all" style={{ textAlign: 'center', textDecoration: 'none', padding: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700' }}>
                            View all {apps.length} apps →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
