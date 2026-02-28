"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { useApps } from "@/hooks/useApps";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Info,
    BookOpen,
    Eye,
    Megaphone,
    Briefcase,
    Newspaper,
    Users,
    UploadCloud,
    TrendingUp,
    Radio,
    Zap,
    HelpCircle,
    ScrollText,
    ShieldCheck,
    Cookie,
    Code,
    AlertTriangle,
    ChevronRight,
    Download,
    Star,
    Github,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HamburgerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const discoverLinks = [
    { href: "/discover/about-us", label: "About Us", icon: <Info size={18} />, desc: "Our mission & story" },
    { href: "/discover/editorial-policy", label: "Editorial Policy", icon: <BookOpen size={18} />, desc: "How we curate apps" },
    { href: "/discover/transparency", label: "Transparency Center", icon: <Eye size={18} />, desc: "Open & honest practices" },
    { href: "/discover/press", label: "Brand & Press Resources", icon: <Megaphone size={18} />, desc: "Logos, media kit & more" },
    { href: "/discover/blog", label: "Corporate Blog", icon: <Newspaper size={18} />, desc: "Latest from Nexa HQ" },
    { href: "/discover/careers", label: "Careers", icon: <Briefcase size={18} />, desc: "Join our team" },
];

const serviceLinks = [
    { href: "/services/publish", label: "Publish Your App", icon: <UploadCloud size={18} />, desc: "List your creation on Nexa" },
    { href: "/services/promote", label: "Promote Your App", icon: <TrendingUp size={18} />, desc: "Reach millions of users" },
    { href: "/services/ads", label: "Nexa Ads", icon: <Radio size={18} />, desc: "Targeted in-store advertising" },
    { href: "/services/turbo", label: "Nexa Turbo", icon: <Zap size={18} />, desc: "Priority listing & analytics" },
    { href: "/services/faq", label: "FAQs & Support", icon: <HelpCircle size={18} />, desc: "Get help fast" },
];

const legalLinks = [
    { href: "/legal/terms-users", label: "Terms of Service (Users)", icon: <ScrollText size={18} />, desc: "Your rights & obligations" },
    { href: "/legal/privacy", label: "Privacy & Cookies Policy", icon: <ShieldCheck size={18} />, desc: "How we handle your data" },
    { href: "/legal/cookie-settings", label: "Cookie Settings", icon: <Cookie size={18} />, desc: "Manage your preferences" },
    { href: "/legal/terms-developers", label: "Terms of Service (Devs)", icon: <Code size={18} />, desc: "Publisher agreement" },
    { href: "/legal/dmca", label: "DMCA", icon: <AlertTriangle size={18} />, desc: "Copyright infringement policy" },
];

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", marginTop: "0.25rem" }}>
            <div style={{ color: "var(--accent-primary)", display: "flex" }}>{icon}</div>
            <span style={{ fontSize: "0.65rem", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                {label}
            </span>
        </div>
    );
}

function DrawerLink({ href, label, icon, desc, onClose }: { href: string; label: string; icon: React.ReactNode; desc: string; onClose: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClose}
            style={{ textDecoration: "none", display: "block" }}
        >
            <motion.div
                whileHover={{ x: 4, background: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "14px",
                    transition: "background 0.2s",
                    cursor: "pointer",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--accent-primary)", flexShrink: 0
                    }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "white" }}>{label}</div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{desc}</div>
                    </div>
                </div>
                <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
            </motion.div>
        </Link>
    );
}

export default function HamburgerDrawer({ isOpen, onClose }: HamburgerDrawerProps) {
    const { apps } = useApps();
    const [githubStars, setGithubStars] = useState<number | null>(null);

    // Fetch real GitHub stars
    useEffect(() => {
        fetch("https://api.github.com/repos/imdadur765/Nexa-Store")
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.stargazers_count !== undefined) {
                    setGithubStars(data.stargazers_count);
                }
            })
            .catch(() => { }); // silently fail
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        style={{
                            position: "fixed", inset: 0, zIndex: 990,
                            background: "rgba(0,0,0,0.65)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    />

                    {/* Drawer Panel */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                        className="liquid-glass"
                        style={{
                            position: "fixed",
                            top: 0, right: 0, bottom: 0,
                            width: "min(340px, 90vw)",
                            zIndex: 1000,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "24px 0 0 24px",
                            borderRight: "none",
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "1.5rem 1.25rem 1rem",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            position: "sticky", top: 0,
                            background: "rgba(5,5,5,0.6)",
                            backdropFilter: "blur(20px)",
                            zIndex: 5,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                <div style={{
                                    width: "28px", height: "28px",
                                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                                    borderRadius: "7px",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <Download size={14} color="white" />
                                </div>
                                <span style={{ fontWeight: "900", fontSize: "1rem", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Nexa Store
                                </span>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "50%",
                                    width: "36px", height: "36px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", color: "white",
                                }}
                            >
                                <X size={16} />
                            </motion.button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "1.25rem", flex: 1 }}>

                            {/* Quick Stats — Live Data */}
                            <div style={{
                                display: "grid", gridTemplateColumns: "1fr 1fr",
                                gap: "0.5rem", marginBottom: "1.75rem"
                            }}>
                                {[
                                    { label: "Apps Listed", value: apps.length > 0 ? `${apps.length}+` : "...", icon: <Download size={14} /> },
                                    { label: "GitHub Stars", value: githubStars !== null ? String(githubStars) : "...", icon: <Star size={14} /> },
                                    { label: "Community", value: "Active", icon: <Users size={14} /> },
                                    { label: "Open Source", value: "100%", icon: <Github size={14} /> },
                                ].map((stat) => (
                                    <a
                                        key={stat.label}
                                        href={stat.label === "GitHub Stars" ? "https://github.com/imdadur765/Nexa-Store/stargazers" : stat.label === "Community" ? "https://t.me/+QJ14XHv-HIM5MjA1" : stat.label === "Open Source" ? "https://github.com/imdadur765/Nexa-Store" : undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div style={{
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "14px",
                                            padding: "0.75rem",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "background 0.2s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                                        >
                                            <div style={{ color: "var(--accent-primary)", display: "flex", justifyContent: "center", marginBottom: "4px" }}>{stat.icon}</div>
                                            <div style={{ fontSize: "1rem", fontWeight: "900", color: "white" }}>{stat.value}</div>
                                            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>{stat.label}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* DISCOVER US */}
                            <SectionTitle icon={<Info size={13} />} label="Discover Us" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", marginBottom: "1.5rem" }}>
                                {discoverLinks.map((l) => (
                                    <DrawerLink key={l.href} {...l} onClose={onClose} />
                                ))}
                            </div>

                            {/* OUR SERVICES */}
                            <SectionTitle icon={<Zap size={13} />} label="Our Services" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", marginBottom: "1.5rem" }}>
                                {serviceLinks.map((l) => (
                                    <DrawerLink key={l.href} {...l} onClose={onClose} />
                                ))}
                            </div>

                            {/* LEGAL */}
                            <SectionTitle icon={<ScrollText size={13} />} label="Legal" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", marginBottom: "1.5rem" }}>
                                {legalLinks.map((l) => (
                                    <DrawerLink key={l.href} {...l} onClose={onClose} />
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: "1rem 1.25rem",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.3)",
                            textAlign: "center",
                        }}>
                            © 2026 Nexa Store · Made with ❤️ by Imdadur Rahman
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
