"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Zap, ShoppingBag, Flame, Download } from "lucide-react";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { isValidUrl } from "@/lib/utils";
import AppCard from "@/components/AppCard";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";

export default function TopChartsPage() {
    const router = useRouter();
    const { apps } = useApps();
    const [activeTab, setActiveTab] = useState("Top Free");
    const activeApps = apps.length > 0 ? apps : staticApps;

    const filteredApps = useMemo(() => {
        let baseApps = activeApps.filter(app => app.isTopChart || app.rating > 4.5);

        if (activeTab === "Top Rated") {
            return baseApps.sort((a, b) => b.rating - a.rating);
        }
        if (activeTab === "PC") {
            baseApps = baseApps.filter(app => app.platforms?.includes('Windows'));
        }
        if (activeTab === "Console") {
            baseApps = baseApps.filter(app => app.platforms?.includes('Xbox') || app.platforms?.includes('PS'));
        }

        return baseApps.sort((a, b) => (a.rank || 99) - (b.rank || 99));
    }, [activeApps, activeTab]);

    const tabs = ["Top Free", "Top Rated", "PC", "Console"];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '5rem' }}>
            <PageHeader
                title="Top Charts"
            />

            <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                border: '1px solid',
                                transition: 'all 0.2s',
                                position: 'relative',
                                background: 'transparent',
                                borderColor: activeTab === tab ? 'transparent' : 'rgba(255,255,255,0.1)',
                                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                                zIndex: 1
                            }}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activePageTab"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'var(--accent-primary)',
                                        borderRadius: '100px',
                                        zIndex: -1,
                                        border: 'none'
                                    }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '1.5rem 1.25rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1rem'
                }}>
                    {filteredApps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            style={{ position: 'relative' }}
                        >
                            {/* Rank Badge overlay */}
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                background: index < 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: '900',
                                zIndex: 10,
                                border: '2px solid var(--bg-primary)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                                {index + 1}
                            </div>

                            <AppCard app={app} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
