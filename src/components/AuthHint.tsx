"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export function AuthHint() {
    const { user, loading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Show the hint only if:
        // 1. Not loading
        // 2. Not logged in
        // 3. Not already on the login page
        // 4. User hasn't dismissed it in this session (handled by local state)
        if (!loading && !user && pathname !== "/login") {
            const timer = setTimeout(() => setIsVisible(true), 2500); // delay before showing
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [user, loading, pathname]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{
                        position: 'fixed',
                        bottom: '90px', // above the mobile bottom nav
                        left: '0',
                        right: '0',
                        margin: '0 auto',
                        width: 'fit-content',
                        zIndex: 999, // below the very top level stuff, but above content
                        padding: '0 1rem'
                    }}
                >
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '100px',
                        padding: '0.5rem 0.5rem 0.5rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 122, 255, 0.15)'
                    }}>

                        {/* Interactive Link Area */}
                        <Link href="/login" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                            }}>
                                <Sparkles size={14} color="white" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2 }}>
                                    Unlock Nexa Points ✨
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: '500' }}>
                                    Login to save favorites
                                </span>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: '0.25rem'
                            }}>
                                <ChevronRight size={14} color="white" />
                            </div>
                        </Link>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

                        {/* Dismiss Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'background 0.2s, color 0.2s'
                            }}
                            className="hover:bg-white/10 hover:text-white"
                            aria-label="Dismiss auth hint"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
