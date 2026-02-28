"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

export default function PublishPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #007AFF, #5856D6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <UploadCloud size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Publish Your App</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        Share your Android creation with thousands of power users. Listing on Nexa Store is free, transparent, and community-driven.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[{ v: "Free", l: "To List" }, { v: "48h", l: "Review Time" }, { v: "500+", l: "Active Devs" }].map(s => (
                        <div key={s.l} className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px", textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--accent-primary)" }}>{s.v}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: "700", fontSize: "0.85rem" }}>{s.l}</div>
                        </div>
                    ))}
                </div>

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1.25rem" }}>📋 How to Publish</h2>
                    {[
                        { step: "1", title: "Create an Account", desc: "Sign up or log into Nexa Store. Navigate to Profile → Developer Hub." },
                        { step: "2", title: "Fill App Details", desc: "Provide your app name, description, category, screenshots, and APK download link (direct or GitHub release)." },
                        { step: "3", title: "Submit for Review", desc: "Our team will review your submission within 48 hours. You'll receive email feedback either way." },
                        { step: "4", title: "Go Live", desc: "Once approved, your app is immediately listed and visible to all Nexa Store users." },
                    ].map((s) => (
                        <div key={s.step} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", alignItems: "flex-start" }}>
                            <div style={{ width: "32px", height: "32px", background: "var(--accent-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", flexShrink: 0, fontSize: "0.85rem" }}>{s.step}</div>
                            <div><div style={{ fontWeight: "800", marginBottom: "0.25rem" }}>{s.title}</div><p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>{s.desc}</p></div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px" }}>
                        <h3 style={{ fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={18} color="#10b981" /> We Accept</h3>
                        {["Open-source apps", "Modded apps (legal use)", "Magisk/LSPosed Modules", "Indie games", "System tools & tweaks"].map(i => (
                            <p key={i} style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.4rem" }}>✓ {i}</p>
                        ))}
                    </div>
                    <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px" }}>
                        <h3 style={{ fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><AlertCircle size={18} color="#ef4444" /> We Don't Accept</h3>
                        {["Malware / spyware", "Pirated commercial apps", "Apps requiring payment", "Gambling / adult content", "Copyright violations"].map(i => (
                            <p key={i} style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "0.4rem" }}>✗ {i}</p>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <a href="/profile?tab=developer" className="btn-premium" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
                        <UploadCloud size={18} /> Open Developer Hub
                    </a>
                </div>
            </div>
        </div>
    );
}
