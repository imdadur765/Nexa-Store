"use client";
import { Briefcase, MapPin, Clock, ExternalLink } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

const openRoles = [
    { title: "Senior React / Next.js Developer", type: "Full-Time", location: "Remote · Bangladesh", team: "Engineering", desc: "We're looking for a passionate front-end engineer to help build the next generation of the Nexa Store platform." },
    { title: "Flutter Mobile Developer", type: "Full-Time", location: "Remote · Worldwide", team: "Mobile", desc: "Help us build the official Nexa Store Android app using Flutter. You'll own features end-to-end from design to shipping." },
    { title: "APK Security Analyst", type: "Part-Time / Contract", location: "Remote", team: "Security", desc: "Review and analyze submitted APKs for security risks. Background in reverse engineering and malware analysis required." },
    { title: "Community Manager", type: "Part-Time", location: "Remote", team: "Growth", desc: "Manage and grow our Telegram and Discord communities. Passionate about Android and great at communication." },
];

export default function CareersPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #14b8a6, #3b82f6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Briefcase size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Join Nexa</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        We're a small, passionate team building the future of Android app distribution. Remote-first, async-friendly, and deeply committed to open-source values.
                    </p>
                </div>
                <div className="liquid-glass" style={{ padding: "1.5rem 2rem", borderRadius: "24px", marginBottom: "2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center" }}>
                    {[{ v: "100%", l: "Remote" }, { v: "4", l: "Open Roles" }, { v: "Flexible", l: "Hours" }].map(i => (
                        <div key={i.l}><div style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--accent-primary)" }}>{i.v}</div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700" }}>{i.l}</div></div>
                    ))}
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "1.25rem" }}>Open Roles</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    {openRoles.map((role) => (
                        <div key={role.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "900" }}>{role.title}</h3>
                                    <span style={{ fontSize: "0.72rem", fontWeight: "800", color: "var(--accent-primary)", background: "rgba(0,122,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>{role.team}</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.78rem" }}><Clock size={12} />{role.type}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.78rem" }}><MapPin size={12} />{role.location}</div>
                                </div>
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1rem" }}>{role.desc}</p>
                            <a href="mailto:careers@nexastore.app" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--accent-primary)", fontWeight: "700", fontSize: "0.85rem", textDecoration: "none" }}>Apply Now <ExternalLink size={12} /></a>
                        </div>
                    ))}
                </div>
                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", textAlign: "center" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>Don't see your role?</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>Send us your profile anyway. We're always open to finding great people.</p>
                    <a href="mailto:careers@nexastore.app" className="btn-premium" style={{ display: "inline-flex", textDecoration: "none" }}>careers@nexastore.app</a>
                </div>
            </div>
        </div>
    );
}
