"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { ScrollText } from "lucide-react";

const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing or using Nexa Store ('the Platform'), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions of this agreement, you may not access or use the Platform. These Terms apply to all visitors, users, and others who access or use the Service." },
    { title: "2. Use of the Platform", content: "Nexa Store grants you a personal, non-exclusive, non-transferable, limited license to access and use the Platform for personal, non-commercial purposes, subject to these Terms. You agree not to use the Platform to: (a) violate any applicable laws or regulations; (b) transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or obscene; (c) impersonate any person or entity; (d) collect or harvest any personally identifiable information from the Platform; (e) use the Platform for any commercial solicitation purpose without our explicit written consent." },
    { title: "3. App Downloads", content: "Nexa Store provides links to third-party applications, games, and modules ('Apps'). By downloading an App, you acknowledge that: (a) You are downloading a third-party application and not a product created by Nexa Store; (b) You install all Apps at your sole risk; (c) Nexa Store is not responsible for any damage to your device caused by Apps downloaded from the Platform; (d) You must comply with the original developer's terms of service for each App you download." },
    { title: "4. Intellectual Property", content: "The Nexa Store platform, including its design, logo, text, and all interface elements, is the intellectual property of Nexa Store and its creators and is protected by applicable copyright laws. You may not reproduce, modify, copy, sell, or redistribute any content from Nexa Store without explicit written permission. App content and copyrights remain with their respective developers." },
    { title: "5. Account Responsibility", content: "If you create an account on Nexa Store, you are responsible for: (a) Maintaining the confidentiality of your account credentials; (b) All activities that occur under your account; (c) Notifying us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms." },
    { title: "6. Disclaimer of Warranties", content: "THE PLATFORM IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEXA STORE DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES." },
    { title: "7. Limitation of Liability", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXA STORE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, RESULTING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM." },
    { title: "8. Modifications to Terms", content: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Continued use of the Platform after any changes constitutes your acceptance of the new Terms. We will make reasonable efforts to notify users of significant changes via email or prominent notice on the Platform." },
    { title: "9. Governing Law", content: "These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these Terms shall be resolved through binding arbitration or the appropriate courts of the relevant jurisdiction." },
    { title: "10. Contact", content: "If you have questions about these Terms of Service, please contact us at: legal@nexastore.app" },
];

export default function TermsUsersPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <ScrollText size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.75rem" }}>Terms of Service for Users</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Effective Date: February 1, 2026 · Last Updated: February 20, 2026</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {sections.map((s) => (
                        <div key={s.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "20px" }}>
                            <h2 style={{ fontSize: "1.05rem", fontWeight: "900", marginBottom: "0.75rem", color: "var(--accent-primary)" }}>{s.title}</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.875rem" }}>{s.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
