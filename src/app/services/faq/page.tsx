"use client";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

const faqs = [
    { q: "Is Nexa Store free to download and use?", a: "Yes, completely. Nexa Store is free for all users. We do not charge for downloading apps, browsing the catalog, or creating an account. We plan to sustain the platform through optional developer services in the future." },
    { q: "How do I report a malicious or fake app?", a: "Use the 'Report' button on any app's detail page, or email us at safety@nexastore.app. We take all reports seriously and investigate within 24 hours. Apps confirmed as malicious are immediately removed." },
    { q: "Why was my app submission rejected?", a: "Common reasons include: the APK link is broken or unsafe, the app description is insufficient, the app violates our content policy, or a duplicate already exists. You will always receive specific feedback by email explaining the rejection reason." },
    { q: "Are the apps on Nexa Store safe to install?", a: "We scan all APKs with multiple antivirus engines and manually review suspicious results. However, as with any Android APK from outside the Play Store, you install at your own risk. We strongly recommend enabling only from trusted sources when needed and re-disabling afterward." },
    { q: "Can I request an app to be added?", a: "Yes! Use the feedback channel on our Telegram community or the feedback form on the app detail page. Our editorial team reviews all requests. We cannot guarantee all requested apps will be listed." },
    { q: "How do I delete my account?", a: "Go to Profile → Settings → Delete Account. This will remove all your data from our servers permanently. This action cannot be undone." },
    { q: "I found a bug in the website, what should I do?", a: "Please report bugs via our GitHub repository (github.com/imdadur765/Nexa-Store) or email bugs@nexastore.app. If it's a security vulnerability, please email security@nexastore.app and do not disclose it publicly." },
    { q: "Does Nexa Store have an API?", a: "A public REST API is planned for Q3 2026. Once available, it will allow developers to query app listings, download counts, and version history programmatically. Watch the blog for announcements." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="liquid-glass" style={{ borderRadius: "18px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: "none", border: "none", color: "white", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
                <span style={{ fontWeight: "800", fontSize: "0.95rem", flex: 1 }}>{q}</span>
                {open ? <ChevronUp size={18} style={{ flexShrink: 0, color: "var(--accent-primary)" }} /> : <ChevronDown size={18} style={{ flexShrink: 0, color: "var(--text-muted)" }} />}
            </button>
            {open && <div style={{ padding: "0 1.5rem 1.25rem", color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}><br />{a}</div>}
        </div>
    );
}

export default function FaqPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <HelpCircle size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>FAQs & Support</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7" }}>Answers to the most common questions about Nexa Store.</p>
                </div>
                <div>{faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}</div>
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginTop: "2rem", textAlign: "center" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>Still need help?</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Our support team is available via Telegram and email.</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="https://t.me/+QJ14XHv-HIM5MjA1" target="_blank" className="btn-premium" style={{ textDecoration: "none" }}>Telegram Support</a>
                        <a href="mailto:support@nexastore.app" style={{ padding: "0.6rem 1.5rem", borderRadius: "100px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", textDecoration: "none", fontWeight: "700" }}>support@nexastore.app</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
