"use client";
import { Megaphone, Download } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

export default function PressPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #f59e0b, #ec4899)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Megaphone size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Brand & Press Resources</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        Everything journalists, bloggers, and content creators need to cover Nexa Store accurately.
                    </p>
                </div>
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem" }}>📰 Press Contact</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }}>For press inquiries, interview requests, or media coverage assistance, please contact our communications team directly.</p>
                    <a href="mailto:press@nexastore.app" style={{ color: "var(--accent-primary)", fontWeight: "700", fontSize: "1.1rem" }}>press@nexastore.app</a>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>We typically respond within 24-48 hours.</p>
                </div>
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1.5rem" }}>🎨 Brand Guidelines</h2>
                    {[
                        { rule: "Name", detail: 'Always write "Nexa Store" — two words, both capitalised. Never "NexaStore", "nexa store", or "NEXA STORE".' },
                        { rule: "Logo Usage", detail: "Do not alter the Nexa Store logo's colors, proportions, or add effects. Use the provided logo files as-is." },
                        { rule: "Colors", detail: "Primary: #007AFF (Nexa Blue). Accent: #8B5CF6 (Nexa Purple). Background: #050508 (Nexa Dark)." },
                        { rule: "Tagline", detail: '"The Premium Android App Store" is our official tagline. You may use it in conjunction with our logo.' },
                    ].map((item) => (
                        <div key={item.rule} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ fontWeight: "800", color: "var(--accent-primary)", minWidth: "100px", flexShrink: 0, fontSize: "0.85rem" }}>{item.rule}</span>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>{item.detail}</p>
                        </div>
                    ))}
                </div>
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem" }}>📦 Media Kit</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Download our official logos, screenshots, and product descriptions in a single package.</p>
                    <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" className="btn-premium" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <Download size={16} /> Download Media Kit (GitHub)
                    </a>
                </div>
            </div>
        </div>
    );
}
