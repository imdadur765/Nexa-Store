"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { Radio, Target, Eye, BarChart2 } from "lucide-react";

export default function AdsPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Radio size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Nexa Ads</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        Non-intrusive, context-aware advertising that respects our users while delivering real results for your app.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[
                        { icon: <Target size={22} />, title: "Category Targeting", desc: "Show ads to users browsing apps in your category. Reach users with proven interest." },
                        { icon: <Eye size={22} />, title: "Search Ads", desc: "Appear at the top of search results when users search for keywords relevant to your app." },
                        { icon: <BarChart2 size={22} />, title: "Full Analytics", desc: "Track impressions, clicks, install conversions, and ROI in a real-time dashboard." },
                    ].map((feature) => (
                        <div key={feature.title} className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px" }}>
                            <div style={{ color: "var(--accent-primary)", marginBottom: "0.75rem" }}>{feature.icon}</div>
                            <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>{feature.title}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6" }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem" }}>Our Ad Promise</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }}>
                        Every ad on Nexa Store follows strict principles: ads are always clearly labelled as "Promoted". Ads are never disruptive pop-ups, auto-plays, or full-screen takeovers. We only accept ads for apps that have been reviewed and approved on our platform. We will never accept ads for gambling, adult content, or apps that conflict with our editorial policy.
                    </p>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
                        Ad revenue directly funds platform development, server costs, and our editorial team — keeping Nexa Store free for all users.
                    </p>
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>Coming Q2 2026</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Nexa Ads is currently in beta. Contact us to join our early advertiser program.</p>
                    <a href="mailto:ads@nexastore.app" className="btn-premium" style={{ display: "inline-flex", textDecoration: "none" }}>ads@nexastore.app</a>
                </div>
            </div>
        </div>
    );
}
