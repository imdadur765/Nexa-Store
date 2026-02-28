"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    Settings,
    Heart,
    Shield,
    Sparkles,
    User as UserIcon,
    ChevronRight,
    Terminal,
    UploadCloud,
    Activity,
    Rocket,
    Github,
    Instagram,
    Send,
    Facebook,
    Code2,
    Cpu,
    Target,
    Zap,
    Download,
    ArrowLeft,
    ShoppingBag
} from "lucide-react";
import { useApps } from "@/hooks/useApps";
import { useSavedApps } from "@/hooks/useSavedApps";
import { useNexaPoints } from "@/hooks/useNexaPoints";
import AppCard from "@/components/AppCard";
import { getAvatarUrl } from "@/lib/utils";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

type TabType = "nexus" | "library" | "developer" | "settings";

function ProfileContent() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default to 'nexus' (About) for everyone, or check URL
    const initialTab = (searchParams.get('tab') as TabType) || "nexus";
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const { apps: allApps } = useApps();
    const { savedAppIds } = useSavedApps();
    const { points, getCurrentLevel, nextLevel, claimDailyReward, canClaimDaily, isUpdating } = useNexaPoints();

    const [devApps, setDevApps] = useState<any[]>([]);
    const [devAppsLoading, setDevAppsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        async function fetchDeveloperApps() {
            setDevAppsLoading(true);
            const developerName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Nexa Expert";

            const { data, error } = await supabase
                .from('apps')
                .select('*')
                .eq('developer', developerName)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setDevApps(data);
            }
            setDevAppsLoading(false);
        }

        fetchDeveloperApps();
    }, [user]);

    // Actual saved library data
    const savedApps = useMemo(() => {
        if (!user || allApps.length === 0) return [];
        return allApps.filter(app => savedAppIds.includes(app.id));
    }, [allApps, savedAppIds, user]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const username = user?.user_metadata?.name || user?.email?.split('@')[0] || "Guest Explorer";
    const avatarUrl = user ? getAvatarUrl(user.email, user.user_metadata?.avatar_url) : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
    const userLevel = getCurrentLevel();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>

            <PageHeader
                title="Profile Hub"
                icon={<UserIcon size={20} color="var(--accent-primary)" />}
                rightElement={user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={12} color="#f59e0b" />
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#f59e0b' }}>{points}</span>
                    </div>
                )}
            />

            {/* ── Ultra-Premium Background Orbs ── */}
            <div style={{
                position: 'fixed', top: '-10%', left: '-10%', width: '500px', height: '500px',
                background: activeTab === 'nexus' ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
                filter: 'blur(80px)', zIndex: 0, transition: 'background 0.5s ease', pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 10, padding: '1rem 1.25rem 0' }}>

                {/* ── Dynamic Avatar Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}
                >
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: user ? 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' : 'linear-gradient(135deg, #333, #111)',
                            padding: '3px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>

                        {/* Level Badge Overlay */}
                        <div style={{
                            position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
                            background: user ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : '#333',
                            color: 'white', fontSize: '0.65rem', fontWeight: '900', padding: '3px 12px',
                            borderRadius: '100px', border: '2px solid var(--bg-primary)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.5px'
                        }}>
                            {user ? `LV. ${userLevel.level} ${userLevel.name.toUpperCase()}` : 'GUEST'}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 }}>{username}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{user ? user.email : "Sign in to sync your library"}</p>
                    </div>

                    {!user && (
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'var(--accent-primary)', color: 'white', border: 'none',
                                    padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem',
                                    fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                <Rocket size={14} /> Join Now
                            </motion.button>
                        </Link>
                    )}
                </motion.div>

                {/* ── Segmented Control ── */}
                <div style={{
                    display: 'flex', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.35rem',
                    borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    {(['nexus', 'library', 'developer', 'settings'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                position: 'relative',
                                flex: 1, padding: '0.7rem 0.2rem', borderRadius: '12px', border: 'none',
                                background: 'transparent',
                                color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.4)',
                                fontWeight: activeTab === tab ? '900' : '700', fontSize: '0.75rem',
                                cursor: 'pointer', transition: 'color 0.2s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                zIndex: 1
                            }}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="active-profile-tab"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(255,255,255,0.12)',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
                                        zIndex: -1
                                    }}
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                            )}
                            {tab === 'nexus' && <Target size={14} />}
                            {tab === 'library' && <Heart size={14} />}
                            {tab === 'developer' && <Terminal size={14} />}
                            {tab === 'settings' && <Settings size={14} />}
                            <span className="desktop-only">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                        </button>
                    ))}
                </div>

                {/* ── Hub Content ── */}
                <AnimatePresence mode="wait">

                    {/* NEXUS (About/Vision) */}
                    {activeTab === "nexus" && (
                        <motion.div
                            key="nexus"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div className="liquid-glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={20} /> The Nexa Mission
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    Nexa Store is a community-driven paradise for power users. We provide verified modules, root tools, and premium modifications that actually unlock your device's potential. Zero bloat, maximum performance.
                                </p>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.25rem' }}>Lead Architect</h3>
                                <div className="liquid-glass" style={{
                                    padding: '1.25rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center'
                                }}>
                                    <div style={{ width: '84px', height: '84px', flexShrink: 0, borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)', padding: '3px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                                        <img src="https://github.com/imdadur765.png" alt="Dev" style={{ width: '100%', height: '100%', borderRadius: '21px', background: 'var(--bg-primary)', objectFit: 'cover', objectPosition: 'center' }} />
                                    </div>
                                    <div style={{ flex: '1 1 150px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Imdadur Rahman</h4>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)' }}>Full-Stack & Flutter Engineer</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                                        <a href="https://github.com/imdadur765" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                            <Github size={16} />
                                        </a>
                                        <a href="https://www.instagram.com/imxrah._/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(225,48,108,0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                            <Instagram size={16} />
                                        </a>
                                        <a href="https://t.me/+QJ14XHv-HIM5MjA1" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,136,204,0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                            <Send size={16} />
                                        </a>
                                        <a href="https://www.facebook.com/imdadur.rahman.311493" target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(24,119,242,0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                            <Facebook size={16} />
                                        </a>
                                    </div>
                                </div>

                                <div className="liquid-glass" style={{
                                    marginTop: '1rem', padding: '1.25rem', borderRadius: '24px',
                                    background: 'rgba(239, 68, 68, 0.04)', border: '1px dashed rgba(239, 68, 68, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <Code2 size={18} color="#ef4444" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#ef4444' }}>Dev Philosophy</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', fontStyle: 'italic' }}>
                                        "As a Flutter developer, I build real code, not drag-and-drop templates. Nexa Store is a statement against mediocre software builders. Proper engineering only."
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                                    <Zap size={20} color="#facc15" style={{ marginBottom: '0.5rem' }} />
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>Performance</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Rust-grade efficiency</div>
                                </div>
                                <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                                    <Cpu size={20} color="#3ecf8e" style={{ marginBottom: '0.5rem' }} />
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>Open Base</div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Powered by Cloud</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* LIBRARY / LOGIN PROTECTED */}
                    {activeTab === "library" && (
                        <motion.div key="library" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            {!user ? (
                                <AuthRequiredUI message="Your collection is waiting for you in the cloud." />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Points Card */}
                                    <div className="liquid-glass" style={{
                                        padding: '1.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.15))',
                                        border: '1px solid rgba(245, 158, 11, 0.2)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Sparkles size={18} color="#f59e0b" />
                                                <span style={{ fontWeight: '900', fontSize: '1rem' }}>Nexa XP</span>
                                            </div>
                                            <div style={{ textAlign: 'right', fontWeight: '900', color: '#f59e0b', fontSize: '1.2rem' }}>
                                                {points} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>/ {nextLevel.min}</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <motion.div animate={{ width: `${Math.min(100, (points / nextLevel.min) * 100)}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
                                        </div>
                                        {canClaimDaily() && (
                                            <button
                                                onClick={() => claimDailyReward().then(r => alert(r.message))}
                                                disabled={isUpdating}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'white', color: '#000', border: 'none', fontWeight: '900', fontSize: '0.85rem' }}
                                            >
                                                {isUpdating ? 'Claming...' : 'Claim Daily Reward'}
                                            </button>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '900' }}>Saved Modules</h3>
                                    {savedApps.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {savedApps.map(app => <AppCard key={app.id} app={app} />)}
                                        </div>
                                    ) : (
                                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>Your library is empty. Save some apps to get started!</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* DEVELOPER / LOGIN PROTECTED */}
                    {activeTab === "developer" && (
                        <motion.div key="developer" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            {!user ? (
                                <AuthRequiredUI message="Want to publish your own tweaks? Join our developer circle." />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            <Activity size={20} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#10b981', letterSpacing: '0.5px' }}>YOUR APPS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{devApps.length}</div>
                                        </div>
                                        <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                            <Rocket size={20} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '0.5px' }}>LIVE STATUS</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{devApps.filter(a => a.status === 'approved').length}</div>
                                        </div>
                                    </div>

                                    <Link href="/publish" style={{ textDecoration: 'none' }}>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                            <UploadCloud size={20} /> Publish New Release
                                        </motion.button>
                                    </Link>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900' }}>Managed Releases</h3>
                                        {devAppsLoading && <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {devApps.length > 0 ? (
                                            devApps.map(app => (
                                                <div key={app.id} className="liquid-glass" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '20px', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    {app.icon_url ? (
                                                        <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '14px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Terminal size={24} color="white" />
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.2rem' }}>{app.name}</h4>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>v{app.version}</span>
                                                            <div style={{
                                                                padding: '2px 8px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '900',
                                                                background: app.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' :
                                                                    app.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                color: app.status === 'approved' ? '#10b981' :
                                                                    app.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                                textTransform: 'uppercase', letterSpacing: '0.5px'
                                                            }}>
                                                                {app.status || 'PENDING'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                                                </div>
                                            ))
                                        ) : !devAppsLoading && (
                                            <div className="liquid-glass" style={{ padding: '3rem 1.5rem', textAlign: 'center', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                <Code2 size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>You haven't published anything yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* SETTINGS / LOGIN PROTECTED */}
                    {activeTab === "settings" && (
                        <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            {!user ? (
                                <AuthRequiredUI message="Sign in to manage your Nexus account settings." />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div className="liquid-glass" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} color="#3b82f6" /></div>
                                            <div><div style={{ fontSize: '0.95rem', fontWeight: '800' }}>Privacy & Security</div><div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Sessions & Keys</div></div>
                                        </div>
                                        <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        style={{ marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <LogOut size={18} /> Sign Out Securely
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

function AuthRequiredUI({ message }: { message: string }) {
    return (
        <div style={{
            padding: '3rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
            borderRadius: '28px', border: '1px dashed rgba(255,255,255,0.1)'
        }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Shield size={32} color="var(--accent-primary)" opacity={0.6} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Access Locked</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{message}</p>
            <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', color: 'black', border: 'none', padding: '0.75rem 2rem', borderRadius: '100px', fontWeight: '900', fontSize: '0.9rem' }}>
                    Sign In
                </button>
            </Link>
        </div>
    );
}

// Wrapper for Suspense handling
export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}

