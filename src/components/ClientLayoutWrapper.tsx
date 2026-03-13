"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Github, Instagram, Send, Facebook } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import { AuthHint } from "@/components/AuthHint";
import { NexaLoadingScreen } from "@/components/NexaLoadingScreen";
import MidnightNebula from "./MidnightNebula";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        // Session Persistence: Only show loader once per session
        const hasLoaded = sessionStorage.getItem("nexa_loaded");
        if (hasLoaded) {
            setIsAppLoading(false);
        }
    }, []);

    const handleLoadingComplete = () => {
        setIsAppLoading(false);
        sessionStorage.setItem("nexa_loaded", "true");
    };

    const isHome = pathname === "/";
    const isSearch = pathname === "/search";
    const isSuggested = pathname === "/suggested";
    const isAppDetails = pathname?.startsWith("/app/");
    const isGames = pathname?.startsWith("/games");
    const isApps = pathname?.startsWith("/apps");
    const isAdmin = pathname?.startsWith("/admin");
    const isTools = pathname === "/tools";

    const isProfile = pathname === "/profile";
    const isLogin = pathname === "/login";
    const isPublish = pathname === "/publish";

    // Full-screen pages: no global navbar, no padding
    const isFullScreen = isAppDetails || isHome || isSearch || isSuggested || isAdmin || isGames || isApps || isTools || isProfile || isLogin || isPublish;

    return (
        <AuthProvider>
            <MidnightNebula />
            {isAppLoading && <NexaLoadingScreen onComplete={handleLoadingComplete} />}

            <AnimatePresence>
                {!isAppLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ width: '100%' }}
                    >
                        {!isFullScreen && <Navbar />}
                        <main style={{
                            paddingTop: '0',
                            paddingLeft: isFullScreen ? '0' : '1rem',
                            paddingRight: isFullScreen ? '0' : '1rem',
                            paddingBottom: isAppDetails || isAdmin ? '0' : '120px'
                        }}>
                            {children}
                        </main>
                        {!isAppDetails && !isAdmin && !isLogin && <MobileBottomNav />}
                        <footer className="desktop-only" style={{
                            marginTop: '4rem',
                            padding: '2rem 1rem',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            borderTop: '1px solid var(--glass-border)',
                            display: isAppDetails ? 'none' : 'block'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Github size={20} />
                                </a>
                                <a href="https://www.instagram.com/imxrah._/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#E1306C'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Instagram size={20} />
                                </a>
                                <a href="https://t.me/+QJ14XHv-HIM5MjA1" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0088cc'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Send size={20} />
                                </a>
                                <a href="https://www.facebook.com/imdadur.rahman.311493" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#1877F2'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <Facebook size={20} />
                                </a>
                            </div>
                            <p>&copy; 2026 Nexa Store. Built by Imdadur Rahman.</p>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthHint />
        </AuthProvider>
    );
}
