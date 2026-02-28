"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { Code } from "lucide-react";

const sections = [
    { title: "1. Developer Agreement", content: "By submitting an application, game, or module ('App') to Nexa Store, you ('Developer') agree to be bound by these Terms. You confirm that you are the rightful owner of the App or have all necessary rights, licenses, and permissions to distribute it through our Platform." },
    { title: "2. Submission Requirements", content: "To submit an App, you must: (a) Provide accurate and complete metadata including app name, description, category, and screenshots; (b) Provide a stable, direct download link or GitHub Releases link to the APK; (c) Ensure the App does not contain malware, spyware, or any code designed to harm users; (d) Comply with all applicable laws and regulations; (e) Not submit Apps that infringe on third-party intellectual property rights." },
    { title: "3. Developer Responsibilities", content: "You are solely responsible for: (a) Maintaining the accuracy of your App's listing information; (b) Updating download links when new versions are released; (c) Responding to user feedback and reported bugs; (d) Ensuring the App continues to meet our content and security policies after publication; (e) Any legal claims arising from your App, including intellectual property disputes." },
    { title: "4. Content License", content: "By submitting an App to Nexa Store, you grant us a non-exclusive, worldwide, royalty-free license to: display your App's name, icon, screenshots, and description on the Platform; index your App in search engines for discoverability; and promote your App through our editorial channels if selected. This license does not transfer ownership of your App or its intellectual property." },
    { title: "5. Revenue & Pricing", content: "Listing an App on Nexa Store is currently free of charge. Basic analytics are provided at no cost. Premium features (Nexa Turbo) are available as optional paid subscriptions. Nexa Store does not take a revenue share on any transactions related to your App. You retain 100% of any revenue generated from your App through other channels." },
    { title: "6. Prohibited Apps", content: "We will reject or remove any App that: contains malware, ransomware, spyware, or other malicious code; harvests user data without clear disclosure; enables or facilitates illegal activities; infringes on copyrights, trademarks, or patents; contains adult or gambling content without appropriate age gating; or promotes hate speech, discrimination, or violence." },
    { title: "7. Removal Policy", content: "Nexa Store reserves the right to remove any App from the Platform at any time, with or without notice, if it violates these Terms or our content policies. We will make reasonable efforts to notify developers of removals by email. Developers may appeal removal decisions by contacting editorial@nexastore.app within 30 days." },
    { title: "8. Disclaimer", content: "NEXA STORE PROVIDES THE PLATFORM 'AS IS' WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE DOWNLOAD COUNTS, REVIEWS, OR PLACEMENT. WE ARE NOT RESPONSIBLE FOR ANY DAMAGES RESULTING FROM APP DISTRIBUTION THROUGH OUR PLATFORM." },
    { title: "9. Termination", content: "We may terminate a developer's access to the Platform at any time for violations of these Terms. Developers may terminate their participation at any time by requesting removal of their Apps through the Developer Hub or by emailing developers@nexastore.app." },
    { title: "10. Contact", content: "For developer-related inquiries, please contact: developers@nexastore.app" },
];

export default function TermsDevelopersPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Code size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.75rem" }}>Terms of Service for Developers</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Effective Date: February 1, 2026 · Last Updated: February 20, 2026</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {sections.map((s) => (
                        <div key={s.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "20px" }}>
                            <h2 style={{ fontSize: "1.05rem", fontWeight: "900", marginBottom: "0.75rem", color: "#8b5cf6" }}>{s.title}</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.875rem" }}>{s.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
