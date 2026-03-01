"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApps } from "@/hooks/useApps";
import { PageHeader } from "@/components/PageHeader";
import {
    GitCompare, X, Plus, ChevronRight, Shield,
    Zap, Star, Terminal, Sparkles, ArrowLeftRight, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Move ComparisonRow outside to fix "Cannot create components during render"
const ComparisonRow = ({ label, valA, valB, winner }: { label: string, valA: React.ReactNode, valB: React.ReactNode, winner?: 'a' | 'b' | null }) => (
    <div
        className="ultra-glass hw-accel"
        style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            marginBottom: '1rem',
            borderRadius: '16px',
            overflow: 'hidden'
        }}
    >
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%) translateY(-50%)', background: 'rgba(15, 15, 15, 0.9)', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.5)', zIndex: 10, border: '1px solid rgba(255,255,255,0.15)', top: '50%', backdropFilter: 'blur(10px)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
            {label}
        </div>
        <div style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            position: 'relative',
            background: winner === 'a' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent)' : 'transparent',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ color: winner === 'a' ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: '800', fontSize: '0.95rem', transform: winner === 'a' ? 'scale(1.05)' : 'scale(1)' }}>{valA}</div>
            {winner === 'a' && <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'var(--accent-primary)', color: 'white', fontSize: '0.5rem', fontWeight: '900', padding: '2px 6px', borderRadius: '4px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>BEST</div>}
        </div>
        <div style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            position: 'relative',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            background: winner === 'b' ? 'linear-gradient(225deg, rgba(59, 130, 246, 0.08), transparent)' : 'transparent',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ color: winner === 'b' ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: '800', fontSize: '0.95rem', transform: winner === 'b' ? 'scale(1.05)' : 'scale(1)' }}>{valB}</div>
            {winner === 'b' && <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--accent-primary)', color: 'white', fontSize: '0.5rem', fontWeight: '900', padding: '2px 6px', borderRadius: '4px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>BEST</div>}
        </div>
    </div>
);

function ComparisonContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { apps, loading } = useApps();

    const idA = searchParams.get("a");
    const idB = searchParams.get("b");

    const appA = useMemo(() => apps.find(a => a.id.toString() === idA), [apps, idA]);
    const appB = useMemo(() => apps.find(a => a.id.toString() === idB), [apps, idB]);

    const [isSelectingB, setIsSelectingB] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const availableForB = useMemo(() => {
        return apps.filter(a => a.id.toString() !== idA && (!searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [apps, idA, searchQuery]);

    const getWinner = (valA: number, valB: number) => {
        if (valA > valB) return 'a';
        if (valB > valA) return 'b';
        return null;
    };

    const parseDownloads = (d: string | undefined) => {
        if (!d) return 0;
        const val = parseFloat(d.replace(/[^0-9.]/g, ''));
        if (d.toLowerCase().includes('b')) return val * 1000000000;
        if (d.toLowerCase().includes('m')) return val * 1000000;
        if (d.toLowerCase().includes('k')) return val * 1000;
        return val;
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="ios-btn-haptic" style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', paddingBottom: '7rem', position: 'relative', overflow: 'hidden' }}>
            {/* iOS 26 Background Orbs */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '250px', height: '250px', background: '#ec4899', opacity: 0.08, filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <PageHeader
                title="Performance Battle"
                icon={<ArrowLeftRight size={18} />}
                accentColor="var(--accent-primary)"
                backText="Store"
            />

            <div style={{ padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
                {/* Comparison Header Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                    {/* App A */}
                    <div className="ultra-glass hw-accel shadow-premium" style={{ padding: '2rem 1rem', borderRadius: '28px', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                        {appA ? (
                            <>
                                <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 1.25rem' }}>
                                    <img src={appA.iconUrl} alt={appA.name} style={{ width: '100%', height: '100%', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.5)' }} />
                                    {appA.is_safety_verified && (
                                        <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#3ddc84', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0a0a', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                                            <Shield size={12} color="white" fill="white" />
                                        </div>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px' }}>{appA.name}</h3>
                                <div className="ultra-glass" style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: '800', marginTop: '0.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>{appA.category}</div>
                            </>
                        ) : (
                            <div style={{ opacity: 0.3, fontWeight: '800' }}>APP ALPHA</div>
                        )}
                    </div>

                    {/* App B */}
                    <motion.div
                        className="ultra-glass hw-accel shadow-premium"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsSelectingB(true)}
                        style={{ padding: '2rem 1rem', borderRadius: '28px', textAlign: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', background: appB ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)' }}
                    >
                        {appB ? (
                            <div style={{ width: '100%', position: 'relative' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); router.push(`/compare?a=${idA}`); }}
                                    className="ios-btn-haptic"
                                    style={{ position: 'absolute', top: '-1.25rem', right: '-0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={14} />
                                </button>
                                <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 1.25rem' }}>
                                    <img src={appB.iconUrl} alt={appB.name} style={{ width: '100%', height: '100%', borderRadius: '18px', boxShadow: '0 12px 24px rgba(0,0,0,0.5)' }} />
                                    {appB.is_safety_verified && (
                                        <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#3ddc84', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0a0a', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                                            <Shield size={12} color="white" fill="white" />
                                        </div>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px' }}>{appB.name}</h3>
                                <div className="ultra-glass" style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: '800', marginTop: '0.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>{appB.category}</div>
                            </div>
                        ) : (
                            <>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    <Plus color="var(--accent-primary)" size={28} />
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-primary)', opacity: 0.6 }}>ADD TARGET</div>
                            </>
                        )}
                    </motion.div>
                </div>

                <AnimatePresence>
                    {appA && appB && (
                        <motion.div
                            key="battle-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
                        >
                            {/* Nexa Intelligence Section */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                                    <Zap size={20} color="#f59e0b" fill="#f59e0b" />
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                                        Nexa Editorial DNA
                                    </h2>
                                </div>
                                <div>
                                    <ComparisonRow
                                        label="Expert Rating"
                                        valA={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Star size={16} fill="#fbbf24" color="#fbbf24" /> {appA.editorial_rating || '4.0'}</div>}
                                        valB={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Star size={16} fill="#fbbf24" color="#fbbf24" /> {appB.editorial_rating || '4.0'}</div>}
                                        winner={getWinner(appA.editorial_rating || 4, appB.editorial_rating || 4)}
                                    />
                                    <ComparisonRow
                                        label="Verdict"
                                        valA={<div style={{ fontSize: '0.75rem', lineHeight: '1.4', opacity: 0.8 }}>{appA.editors_verdict || 'Highly recommended dynamic experience.'}</div>}
                                        valB={<div style={{ fontSize: '0.75rem', lineHeight: '1.4', opacity: 0.8 }}>{appB.editors_verdict || 'Solid performance with core features.'}</div>}
                                    />
                                </div>
                            </section>

                            {/* Public Metrics */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                                    <Sparkles size={20} color="#3b82f6" />
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                                        World Momentum
                                    </h2>
                                </div>
                                <div>
                                    <ComparisonRow
                                        label="User Score"
                                        valA={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>{appA.rating} <Star size={14} fill="rgba(255,255,255,0.2)" color="rgba(255,255,255,0.2)" /></div>}
                                        valB={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>{appB.rating} <Star size={14} fill="rgba(255,255,255,0.2)" color="rgba(255,255,255,0.2)" /></div>}
                                        winner={getWinner(appA.rating, appB.rating)}
                                    />
                                    <ComparisonRow
                                        label="Popularity"
                                        valA={appA.downloads}
                                        valB={appB.downloads}
                                        winner={getWinner(parseDownloads(appA.downloads), parseDownloads(appB.downloads))}
                                    />
                                </div>
                            </section>

                            {/* Technical Core */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                                    <Terminal size={20} color="#3ddc84" />
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                                        Technical Core
                                    </h2>
                                </div>
                                <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                    <ComparisonRow
                                        label="ID"
                                        valA={<span style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'monospace' }}>{appA.package_name || 'com.nexa.app'}</span>}
                                        valB={<span style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'monospace' }}>{appB.package_name || 'com.nexa.target'}</span>}
                                    />
                                    <ComparisonRow
                                        label="Root Access"
                                        valA={appA.tags?.includes('root') ? <Zap size={16} color="#ef4444" style={{ margin: '0 auto' }} /> : 'NO'}
                                        valB={appB.tags?.includes('root') ? <Zap size={16} color="#ef4444" style={{ margin: '0 auto' }} /> : 'NO'}
                                    />
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!appA || !appB ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '5rem 2rem' }}
                    >
                        <div className="ultra-glass" style={{ width: '80px', height: '80px', borderRadius: '30px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <GitCompare size={40} style={{ opacity: 0.1 }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Battle Arena Empty</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '280px', margin: '0 auto', lineHeight: '1.5' }}>
                            Initiate a specs comparison by adding a second target from the library.
                        </p>
                    </motion.div>
                ) : null}
            </div>

            {/* Selection Drawer */}
            <AnimatePresence>
                {isSelectingB && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSelectingB(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1001, backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80vh', background: '#0a0a0a', zIndex: 1002, borderRadius: '32px 32px 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Select App</h2>
                                <button onClick={() => setIsSelectingB(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', padding: '8px' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="search-pill-container ultra-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Search size={18} color="rgba(255,255,255,0.4)" />
                                <input
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ background: 'none', border: 'none', color: 'white', outline: 'none', flex: 1, fontSize: '0.9rem' }}
                                />
                            </div>

                            <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {availableForB.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            router.push(`/compare?a=${idA}&b=${app.id}`);
                                            setIsSelectingB(false);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', textAlign: 'left', color: 'inherit' }}
                                    >
                                        <img src={(app.iconUrl || app.icon_url_external)} alt={app.name} style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{app.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{app.category}</div>
                                        </div>
                                        <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>}>
            <ComparisonContent />
        </Suspense>
    );
}
