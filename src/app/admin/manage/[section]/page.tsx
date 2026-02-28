"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    ArrowLeft, Search, Filter, Plus, Smartphone,
    Edit2, Trash2, Zap, ShieldCheck, Star,
    TrendingUp, Layout, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageSection() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const section = params.section as string;

    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [deleting, setDeleting] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkLoading, setIsBulkLoading] = useState(false);

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
    }, [router, section]);

    const fetchData = async () => {
        setLoading(true);
        let query = supabase.from('apps').select('*');

        // Apply automatic filters based on section
        if (section === 'pending') {
            query = query.eq('status', 'pending');
        } else if (section === 'hero') {
            query = query.eq('is_hero', true);
        } else if (section === 'featured') {
            query = query.eq('is_featured', true);
        } else if (section === 'categories' && categoryFilter === 'all') {
            // Default to first available category if none selected
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (data) setApps(data);
        setLoading(false);
    };

    const filteredApps = useMemo(() => {
        return apps.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.developer?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [apps, searchQuery, statusFilter, categoryFilter]);

    const handleAction = async (id: number, field: string, value: any) => {
        const { error } = await supabase.from('apps').update({ [field]: value }).eq('id', id);
        if (!error) {
            setApps(prev => prev.map(app => app.id === id ? { ...app, [field]: value } : app));
        } else {
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This action is permanent.')) return;
        setDeleting(id);
        const { error } = await supabase.from('apps').delete().eq('id', id);
        if (!error) {
            setApps(prev => prev.filter(a => a.id !== id));
        }
        setDeleting(null);
    };

    const getTitle = () => {
        switch (section) {
            case 'pending': return 'Review Queue';
            case 'hero': return 'Slider Manager';
            case 'featured': return 'Featured Collection';
            case 'all': return 'Global Registry';
            default: return 'App Management';
        }
    };

    const toggleSelection = (id: number) => {
        setSelectedIds((prev: number[]) => prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]);
    };

    const handleBulkAction = async (field: string, value: any) => {
        if (selectedIds.length === 0) return;
        setIsBulkLoading(true);
        const { error } = await supabase.from('apps').update({ [field]: value }).in('id', selectedIds);
        if (!error) {
            setApps(prev => prev.map(app => selectedIds.includes(app.id) ? { ...app, [field]: value } : app));
            setSelectedIds([]);
        } else {
            alert("Bulk Error: " + error.message);
        }
        setIsBulkLoading(false);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} apps permanently?`)) return;
        setIsBulkLoading(true);
        const { error } = await supabase.from('apps').delete().in('id', selectedIds);
        if (!error) {
            setApps(prev => prev.filter(a => !selectedIds.includes(a.id)));
            setSelectedIds([]);
        }
        setIsBulkLoading(false);
    };

    const categories = Array.from(new Set(apps.map(a => a.category).filter(Boolean)));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem' }}>
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
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>{getTitle()}</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Nexa Command Center • {filteredApps.length} entries</p>
                </div>
                <Link href="/admin/add" style={{ textDecoration: 'none' }}>
                    <button className="play-btn" style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                        <Plus size={16} /> Add App
                    </button>
                </Link>
            </header>

            <div style={{ padding: '1rem' }}>
                {/* ── Filters & Search ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search by name or developer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                color: 'white', fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }} className="no-scrollbar">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: '0.8rem' }}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: '0.8rem' }}
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* ── Bulk Action Bar ── */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div
                            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                            style={{
                                position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem 1.5rem', borderRadius: '24px', zIndex: 1000,
                                display: 'flex', alignItems: 'center', gap: '1.5rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.8)', width: 'max-content'
                            }}
                        >
                            <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>
                                <span style={{ color: 'var(--accent-primary)' }}>{selectedIds.length}</span> Selected
                            </div>
                            <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleBulkAction('status', 'approved')} style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: '#10b981', color: 'black', border: 'none', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => handleBulkAction('status', 'rejected')} style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>Reject</button>
                                <button onClick={handleBulkDelete} style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                            <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '700', padding: '0 0.5rem' }}>Cancel</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Apps Grid/List ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <AnimatePresence>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <RefreshCw size={32} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : filteredApps.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <Layout size={48} opacity={0.1} style={{ marginBottom: '1rem' }} />
                                <p>No apps found in this section.</p>
                            </div>
                        ) : (
                            filteredApps.map((app) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={app.id}
                                    className="ultra-glass"
                                    style={{
                                        display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '20px', gap: '1rem',
                                        border: selectedIds.includes(app.id) ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.03)',
                                        background: selectedIds.includes(app.id) ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                                    }}
                                >
                                    <div
                                        onClick={() => toggleSelection(app.id)}
                                        style={{
                                            width: '20px', height: '20px', borderRadius: '6px',
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            background: selectedIds.includes(app.id) ? 'var(--accent-primary)' : 'transparent',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        {selectedIds.includes(app.id) && <CheckCircle2 size={14} color="black" />}
                                    </div>

                                    {app.icon_url ? (
                                        <img src={app.icon_url} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '48px', height: '48px', background: 'var(--accent-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={24} color="white" />
                                        </div>
                                    )}

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>{app.name}</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>by {app.developer || 'Nexa Expert'}</p>

                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                                            <div style={{
                                                padding: '2px 8px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '900',
                                                background: app.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' :
                                                    app.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: app.status === 'approved' ? '#10b981' :
                                                    app.status === 'pending' ? '#f59e0b' : '#ef4444'
                                            }}>
                                                {(app.status || 'pending').toUpperCase()}
                                            </div>
                                            <div style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                                                {app.category}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => handleAction(app.id, 'status', 'approved')}
                                                style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981' }}
                                                title="Approve"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleAction(app.id, 'is_hero', !app.is_hero)}
                                            style={{ padding: '0.6rem', borderRadius: '12px', background: app.is_hero ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)', border: 'none', color: app.is_hero ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}
                                            title="Toggle Slider"
                                        >
                                            <Zap size={18} fill={app.is_hero ? '#f59e0b' : 'none'} />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/edit/${app.id}`)}
                                            style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white' }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            disabled={deleting === app.id}
                                            style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
