"use client";
import { BookOpen, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

export default function EditorialPolicyPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #3b82f6, #06b6d4)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <BookOpen size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Editorial Policy</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        How we decide what gets listed on Nexa Store — our standards, criteria, and commitment to quality.
                    </p>
                </div>
                {[
                    { icon: <CheckCircle size={22} />, color: "#10b981", title: "Our Selection Criteria", content: "Every application submitted to Nexa Store undergoes a rigorous multi-stage review. Our editorial team evaluates apps on: (1) Functional quality — does it work as advertised? (2) Safety — is it free from malware, spyware, or harmful code? (3) Usefulness — does it provide genuine value to our users? (4) Originality — is it meaningfully distinct from existing listings? We do not list apps that are simple repackages of freely available APKs without added value." },
                    { icon: <Shield size={22} />, color: "#8b5cf6", title: "Safety & Security Standards", content: "All APKs submitted to Nexa Store are scanned using multiple antivirus engines via our automated pipeline. Any app flagging as potentially harmful is immediately quarantined pending manual review. Apps requiring excessive permissions beyond their stated function are flagged and developers are asked to justify each permission. We reserve the right to remove any app at any time if post-publication security issues are discovered." },
                    { icon: <AlertCircle size={22} />, color: "#f59e0b", title: "Prohibited Content", content: "We do not host: (1) Apps that infringe on intellectual property rights without legal basis. (2) Apps designed to harm, spy on, or deceive users. (3) Gambling apps that target minors. (4) Apps promoting illegal activities or hate speech. (5) Full commercial game copies distributed without a valid license from the IP holder." },
                    { icon: <BookOpen size={22} />, color: "#ec4899", title: "Editorial Independence", content: "Nexa Store's editorial team operates independently of our business team. Paid promotions (Nexa Turbo, Nexa Ads) do not influence editorial ratings, rankings, or selection decisions. Promoted apps are clearly labelled as such. Our curated picks and 'Editor's Choice' badges are awarded purely on merit by our editorial team." },
                ].map((section) => (
                    <div key={section.title} className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <div style={{ color: section.color }}>{section.icon}</div>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "900" }}>{section.title}</h2>
                        </div>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.95rem" }}>{section.content}</p>
                    </div>
                ))}
                <div className="liquid-glass" style={{ padding: "1.5rem 2rem", borderRadius: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    Last updated: February 2026 · For appeals & questions: <a href="mailto:editorial@nexastore.app" style={{ color: "var(--accent-primary)" }}>editorial@nexastore.app</a>
                </div>
            </div>
        </div>
    );
}
