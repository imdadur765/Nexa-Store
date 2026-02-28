"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star, Zap, Download, ShoppingBag, Layout } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { appsData as staticApps } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import AppCard from "@/components/AppCard";

export default function SuggestedPage() {
    const router = useRouter();
    const { apps } = useApps();
    // Fallback to static if hook returns empty initially (though hook handles this internally)
    const activeApps = apps.length > 0 ? apps : staticApps;
    const suggestedApps = activeApps.filter(app => {
        const isActuallyGame = app.isGame || app.category.toLowerCase().includes('game');
        return !app.isTopChart && !isActuallyGame;
    }).slice(0, 20);

    return (
        <div className="no-scrollbar" style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '8rem' }}>
            {/* Standardized Page Header */}
            <PageHeader
                title="Suggested"
                icon={<Sparkles size={16} />}
                accentColor="var(--accent-primary)"
                backText="Store"
            />

            <div style={{ padding: '2rem 1.25rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1rem'
                }}>
                    {suggestedApps.map((app, index) => (
                        <div key={app.id}>
                            <AppCard app={app} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
