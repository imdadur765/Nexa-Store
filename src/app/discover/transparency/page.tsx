"use client";
import { Eye, FileText, BarChart2, DollarSign } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

export default function TransparencyPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #10b981, #06b6d4)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Eye size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Transparency Center</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        We believe in radical transparency. Here's exactly how Nexa Store works, how we make decisions, and how we handle your data.
                    </p>
                </div>
                {[
                    { icon: <FileText size={22} />, color: "#3b82f6", title: "How Apps Get Listed", content: "Apps are submitted by developers through our publishing portal or discovered by our editorial team. Every submission is scanned, reviewed, and given a trust score. Apps scoring below our threshold are rejected with detailed feedback. There is no pay-to-list scheme — editorial placement is always on merit." },
                    { icon: <BarChart2 size={22} />, color: "#8b5cf6", title: "How Rankings Work", content: "App rankings on Nexa Store are algorithmic and based on: download velocity, user ratings, quality of metadata, recency of updates, and safety scores. Paid promotions (Nexa Turbo) can increase visibility but are always marked with a 'Promoted' badge and never affect organic search rankings." },
                    { icon: <DollarSign size={22} />, color: "#f59e0b", title: "How We Make Money", content: "Nexa Store is currently free for developers and users. In the future, we plan to sustain the platform through: (1) Nexa Turbo — optional paid priority listing for developers. (2) Nexa Ads — non-intrusive, clearly labelled in-store advertising. We will never sell user data. We will never insert ads into app APKs." },
                    { icon: <Eye size={22} />, color: "#ec4899", title: "Data We Collect", content: "We collect: anonymized download counts to help developers, search queries in aggregate (never tied to individuals), and account information you voluntarily provide. We do not collect: device fingerprints, location data, or browsing history outside of our platform. Full details are in our Privacy Policy." },
                ].map((section) => (
                    <div key={section.title} className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <div style={{ color: section.color }}>{section.icon}</div>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "900" }}>{section.title}</h2>
                        </div>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.95rem" }}>{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
