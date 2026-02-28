"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import {
    ShieldCheck,
    Lock,
    CheckCircle2,
    Search,
    Zap,
    Smartphone,
    Terminal,
    ArrowLeft,
    ShieldAlert,
    Fingerprint,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
            {/* Immersive Background Background */}
            <div style={{ position: 'absolute', top: '5%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '-10%', width: '350px', height: '350px', background: '#3ddc84', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <PageHeader
                title="Safety Center"
                icon={<ShieldCheck size={18} />}
                accentColor="#3ddc84"
                backText="Store"
            />

            <div style={{ padding: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="liquid-glass"
                    style={{
                        padding: '2rem',
                        borderRadius: '32px',
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                        border: '1px solid rgba(61, 220, 132, 0.2)',
                        background: 'linear-gradient(135deg, rgba(61, 220, 132, 0.05), transparent)'
                    }}
                >
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(61, 220, 132, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 32px rgba(61, 220, 132, 0.2)' }}>
                        <ShieldCheck size={32} color="#3ddc84" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Trusted. Verified. Secure.</h1>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                        At Nexa Store, our primary mission is to ensure that every app you download is 100% safe.
                        We employ a multi-layered verification process to protect your data and device.
                    </p>
                </motion.div>

                {/* Verification Pillars - Bento Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>

                    {/* SHA256 Pillar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="liquid-glass"
                        style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Fingerprint size={20} color="var(--accent-primary)" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>SHA256 Integrity</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            We calculate the unique SHA256 checksum of every APK. This digital fingerprint ensures that the app you download hasn't been tampered with or modified.
                        </p>
                    </motion.div>

                    {/* Signature Pillar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="liquid-glass"
                        style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={20} color="#a855f7" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Signature Audit</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            We verify the developer's digital signature against official records. This guarantees that updates come from the same trusted developer, preventing spoofing.
                        </p>
                    </motion.div>

                    {/* Scan Pillar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="liquid-glass"
                        style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Search size={20} color="#ef4444" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Heuristic Scans</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Automated scans check for malware, spyware, and suspicious behavior patterns. We use industry-standard engines to audit every line of metadata.
                        </p>
                    </motion.div>

                    {/* Community Pillar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="liquid-glass"
                        style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={20} color="#fbbf24" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Open Transparency</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            We prioritize open-source apps. For GitHub-sourced content, you can audit the source code directly via the link provided on the app details page.
                        </p>
                    </motion.div>
                </div>

                {/* Seal of Trust */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '100px', background: 'rgba(61, 220, 132, 0.1)', border: '1px solid rgba(61, 220, 132, 0.2)', color: '#3ddc84', fontSize: '0.9rem', fontWeight: '800' }}>
                        <ShieldCheck size={18} /> Nexa Safety Verified
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last Updated: March 2026 • Security Protocol v4.2
                    </p>
                </div>
            </div>
        </div>
    );
}
