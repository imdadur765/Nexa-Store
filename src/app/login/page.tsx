"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, Github, AlertCircle, Chrome } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/");
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Auto login or show success message
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'github' | 'discord' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'var(--bg-primary)',
            overflow: 'hidden',
            padding: '0.75rem' // Standard portal padding
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'fixed', // Fixed to stay during scroll
                top: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            <PageHeader
                title="Portal Access"
                icon={<Lock size={16} color="var(--accent-primary)" />}
            />

            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        padding: '1rem 2rem 2rem',
                        zIndex: 10
                    }}
                >
                    {/* Logo Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '0.75rem',
                                overflow: 'hidden'
                            }}
                        >
                            <Image
                                src="/platforms/nexa_logo_optimized.png"
                                alt="Nexa Logo"
                                width={70}
                                height={70}
                                style={{ objectFit: 'contain' }}
                            />
                        </motion.div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
                            Nexa Store
                        </h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', textAlign: 'center' }}>
                            {isLogin ? "Welcome back! Login to sync." : "Join the ultimate repository."}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="ultra-glass" style={{
                        padding: '1.25rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
                        background: 'rgba(10, 10, 10, 0.6)'
                    }}>

                        {/* Mode Toggle */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '4px',
                            borderRadius: '100px',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <button
                                onClick={() => setIsLogin(true)}
                                style={{
                                    flex: 1, padding: '0.6rem', borderRadius: '100px', border: 'none',
                                    background: isLogin ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: isLogin ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                style={{
                                    flex: 1, padding: '0.6rem', borderRadius: '100px', border: 'none',
                                    background: !isLogin ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: !isLogin ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >
                                Register
                            </button>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px',
                                    color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.5rem',
                                    display: 'flex', gap: '0.5rem', alignItems: 'center'
                                }}>
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem',
                                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '14px', color: 'white', fontSize: '0.95rem',
                                        outline: 'none', transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 122, 255, 0.5)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem',
                                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '14px', color: 'white', fontSize: '0.95rem',
                                        outline: 'none', transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(0, 122, 255, 0.5)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                style={{
                                    width: '100%', padding: '1rem', background: 'var(--accent-primary)',
                                    color: 'white', border: 'none', borderRadius: '14px',
                                    fontSize: '1rem', fontWeight: '700', cursor: loading ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    marginTop: '0.5rem', boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                                {!loading && <ArrowRight size={18} />}
                            </motion.button>
                        </form>

                        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOAuth('github')}
                            style={{
                                width: '100%', padding: '0.9rem', background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px',
                                fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                transition: 'all 0.2s', marginBottom: '0.75rem'
                            }}
                        >
                            <Github size={20} /> Continue with GitHub
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOAuth('google')}
                            style={{
                                width: '100%', padding: '0.9rem', background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px',
                                fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Chrome size={20} /> Continue with Google
                        </motion.button>
                    </div>

                    {/* Nexa Points Teaser */}
                    <div style={{
                        marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem'
                    }}>
                        <Sparkles size={14} color="#f59e0b" />
                        <span>Login now to unlock Nexa Points & save favorites</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
