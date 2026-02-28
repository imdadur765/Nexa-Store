"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { TrendingUp, BarChart, Users, Zap } from "lucide-react";

export default function PromotePage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <TrendingUp size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Promote Your App</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        Reach thousands of engaged Android power users. Our promotion tools are built for developers, by developers.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[
                        { icon: <Users size={24} />, title: "Nexa Turbo", desc: "Priority listing, homepage featuring, and dashboard analytics. Ideal for serious launches.", color: "#007AFF" },
                        { icon: <BarChart size={24} />, title: "Nexa Ads", desc: "Targeted in-store banners shown to users actively searching your category.", color: "#8b5cf6" },
                        { icon: <Zap size={24} />, title: "Editor's Pick", desc: "Apply for manual editorial review. If selected, your app gets featured prominently.", color: "#f59e0b" },
                    ].map((tier) => (
                        <div key={tier.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "24px" }}>
                            <div style={{ color: tier.color, marginBottom: "0.75rem" }}>{tier.icon}</div>
                            <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>{tier.title}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6" }}>{tier.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem" }}>Why Promote on Nexa?</h2>
                    {[
                        "Our users are highly engaged Android enthusiasts with purchase intent — not casual browsers.",
                        "Promotions are always clearly labelled. We don't hide ads inside organic results.",
                        "We only accept promotions for apps that have been reviewed and approved by our editorial team.",
                        "Analytics dashboard shows you real impressions, click-through rates, and install conversions.",
                    ].map((point, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                            <div style={{ width: "20px", height: "20px", background: "rgba(0,122,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.7rem", fontWeight: "900", color: "var(--accent-primary)", marginTop: "2px" }}>{i + 1}</div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.7" }}>{point}</p>
                        </div>
                    ))}
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>Ready to Grow?</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Promotion plans are launching Q2 2026. Join the waitlist to be notified first.</p>
                    <a href="mailto:promote@nexastore.app" className="btn-premium" style={{ display: "inline-flex", textDecoration: "none" }}>promote@nexastore.app</a>
                </div>
            </div>
        </div>
    );
}
