"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { ShieldCheck } from "lucide-react";

const sections = [
    { title: "1. Information We Collect", content: "We collect information you provide directly to us when creating an account (email address, username, password hash), when submitting an app for review (app metadata, developer contact info), and when contacting support. We also collect anonymized, aggregate usage data: total page views per app listing (no individual tracking), search terms in aggregate, and general geographic region of traffic (country-level only, via server logs)." },
    { title: "2. Information We Do NOT Collect", content: "Nexa Store is committed to minimal data collection. We do NOT collect: precise geolocation, device fingerprints or IMEI numbers, full browsing history, the specific APKs you download tied to your account, or any information from third-party data brokers. We do not track you across websites." },
    { title: "3. How We Use Your Information", content: "We use the information we collect to: operate and improve the Platform, process app submissions, respond to your support inquiries, send transactional emails (e.g., submission approval/rejection notifications), and enforce our Terms of Service. We do not use your information for targeted advertising, sell your data to third parties, or share your personal information with advertisers." },
    { title: "4. Cookies", content: "We use minimal, essential cookies to: maintain your login session (session cookie), remember your theme preference, and protect against CSRF attacks. We do not use third-party advertising cookies, tracking pixels, or analytics that identify you individually. You can configure your browser to refuse cookies, but some features of the Platform may not function properly." },
    { title: "5. Data Retention", content: "We retain your account data for as long as your account is active. Download statistics are aggregated and anonymized within 30 days. Server logs are purged after 90 days. If you delete your account, your personal data is permanently deleted within 30 days. Aggregate statistical data may be retained indefinitely." },
    { title: "6. Data Security", content: "We implement industry-standard security measures including: encrypted HTTPS connections for all traffic, bcrypt password hashing (we never store plain-text passwords), and row-level security on our Supabase database. In the event of a data breach that affects your personal information, we will notify you within 72 hours of becoming aware." },
    { title: "7. Third-Party Services", content: "We use Supabase for our database and authentication (their Privacy Policy applies to data processing they perform). We use Vercel for hosting (their Privacy Policy applies to server-level data). We do not use Google Analytics, Facebook Pixel, or other third-party tracking services." },
    { title: "8. Your Rights", content: "You have the right to: access the personal data we hold about you (contact privacy@nexastore.app), correct inaccurate data, delete your account and associated data at any time, and object to how we process your data. To exercise any of these rights, email us at privacy@nexastore.app." },
    { title: "9. Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a prominent notice on the Platform and, where appropriate, sending an email notification. Your continued use of the Platform after changes constitutes acceptance of the updated policy." },
    { title: "10. Contact", content: "If you have questions about this Privacy & Cookies Policy, please contact our Data Privacy team at: privacy@nexastore.app" },
];

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <ShieldCheck size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.75rem" }}>Privacy & Cookies Policy</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Effective Date: February 1, 2026 · Last Updated: February 20, 2026</p>
                </div>

                <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "1.5rem", borderLeft: "3px solid #10b981" }}>
                    <p style={{ color: "var(--text-secondary)", fontWeight: "700", fontSize: "0.95rem", lineHeight: "1.7" }}>
                        TL;DR: We collect very little data, we never sell it, and we never track you across the web. Your privacy is a core value at Nexa Store, not an afterthought.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {sections.map((s) => (
                        <div key={s.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "20px" }}>
                            <h2 style={{ fontSize: "1.05rem", fontWeight: "900", marginBottom: "0.75rem", color: "#10b981" }}>{s.title}</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.875rem" }}>{s.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
