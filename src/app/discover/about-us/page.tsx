"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Users, Heart, Globe, Award } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

export default function AboutUsPage() {
    const router = useRouter();
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />

            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Info size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>About Nexa Store</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        We are the premier destination for premium, curated, and hard-to-find Android modifications — built by the community, for the community.
                    </p>
                </div>

                {/* Mission */}
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "900", marginBottom: "1rem" }}>🎯 Our Mission</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "1rem" }}>
                        Nexa Store was founded in 2024 with a singular vision: to create the most trustworthy, beautiful, and user-centric platform for Android power users. We believe that great software should not be locked behind paywalls or buried in sketchy forums. Every app, module, and game on our platform is hand-curated, verified for safety, and presented with full transparency.
                    </p>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "1rem", marginTop: "1rem" }}>
                        We serve a global community of Android enthusiasts — root users, modders, developers, and curious explorers — providing them with the tools they need to push their devices to the limit.
                    </p>
                </div>

                {/* Values Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { icon: <Heart size={24} />, title: "Community First", desc: "Every decision we make is guided by what's best for our users, not advertisers." },
                        { icon: <Globe size={24} />, title: "Open Source", desc: "Our platform is built with open-source tools. We believe in giving back." },
                        { icon: <Award size={24} />, title: "Quality Over Quantity", desc: "We curate relentlessly. Only the best makes it to Nexa." },
                        { icon: <Users size={24} />, title: "Transparency", desc: "We are open about our processes, policies, and how we select apps." },
                    ].map((v) => (
                        <div key={v.title} className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px" }}>
                            <div style={{ color: "var(--accent-primary)", marginBottom: "0.75rem" }}>{v.icon}</div>
                            <h3 style={{ fontWeight: "800", marginBottom: "0.5rem" }}>{v.title}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>{v.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Team */}
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "900", marginBottom: "1.5rem" }}>👥 The Team</h2>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", padding: "3px", flexShrink: 0 }}>
                            <img src="https://github.com/imdadur765.png" alt="Founder" style={{ width: "100%", height: "100%", borderRadius: "17px", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: "900", fontSize: "1.1rem" }}>Imdadur Rahman</h3>
                            <p style={{ color: "var(--accent-primary)", fontWeight: "700", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Founder & Lead Architect</p>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>Full-Stack & Flutter engineer with a passion for clean UI and open-source software. Imdadur built Nexa Store from the ground up to serve the Android modding community.</p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "900", marginBottom: "0.75rem" }}>📬 Get In Touch</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>We love hearing from our community. Reach out anytime.</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" className="btn-premium" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>GitHub Repository</a>
                        <a href="https://t.me/+QJ14XHv-HIM5MjA1" target="_blank" style={{ padding: "0.6rem 1.5rem", borderRadius: "100px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", textDecoration: "none", fontWeight: "700" }}>Telegram Community</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
