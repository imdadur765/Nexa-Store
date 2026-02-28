"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { Zap, BarChart, Upload, Star, Shield } from "lucide-react";

export default function TurboPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Zap size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.5rem" }}>Nexa <span style={{ color: "#f59e0b" }}>Turbo</span></h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        The ultimate toolkit for serious developers who want the best possible presence on Nexa Store.
                    </p>
                </div>

                {/* Feature cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[
                        { icon: <Star size={22} />, title: "Priority Review", desc: "Your app submissions are reviewed in under 6 hours instead of 48 hours.", color: "#f59e0b" },
                        { icon: <Upload size={22} />, title: "Homepage Feature", desc: "Get featured in the hero carousel on the Nexa Store homepage for 7 days.", color: "#3b82f6" },
                        { icon: <BarChart size={22} />, title: "Analytics Dashboard", desc: "Full download stats, user ratings, country breakdowns, and version performance.", color: "#10b981" },
                        { icon: <Shield size={22} />, title: "Verified Badge", desc: "A prominent verified developer badge across all your app listings.", color: "#8b5cf6" },
                    ].map((f) => (
                        <div key={f.title} className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px" }}>
                            <div style={{ color: f.color, marginBottom: "0.75rem" }}>{f.icon}</div>
                            <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>{f.title}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6" }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "0.5rem" }}>Pricing</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Simple, transparent pricing. No hidden fees.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {[{ plan: "Monthly", price: "$9", period: "/ month", note: "Cancel anytime" }, { plan: "Annual", price: "$79", period: "/ year", note: "Save 27% · Best value" }].map(p => (
                            <div key={p.plan} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "1.5rem" }}>
                                <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>{p.plan}</div>
                                <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#f59e0b" }}>{p.price}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: "0.5rem" }}>{p.period}</div>
                                <div style={{ color: "var(--accent-primary)", fontSize: "0.75rem", fontWeight: "700" }}>{p.note}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>Coming Soon</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Nexa Turbo launches Q2 2026. Early signups get 3 months free at launch.</p>
                    <a href="mailto:turbo@nexastore.app" className="btn-premium" style={{ display: "inline-flex", textDecoration: "none" }}>Get Early Access</a>
                </div>
            </div>
        </div>
    );
}
