"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { AlertTriangle, Mail, Clock, FileText } from "lucide-react";

export default function DmcaPage() {
    const steps = [
        { n: "1", title: "Gather Your Information", desc: "Before filing, ensure you have: clear identification of the copyrighted work, the exact URL(s) of the infringing content on Nexa Store, your full legal name and contact information, and a statement of your good-faith belief that the use is not authorized." },
        { n: "2", title: "Send Your Notice", desc: 'Email your DMCA takedown notice to: dmca@nexastore.app with the subject line "DMCA Takedown Notice – [Your App Name]".' },
        { n: "3", title: "Response Time", desc: "We respond to all valid DMCA notices within 48 business hours. We will remove or disable access to the allegedly infringing content promptly upon receipt of a compliant notice." },
        { n: "4", title: "Counter-Notification", desc: "If you believe your content was removed in error, you may submit a DMCA counter-notification. We will forward it to the original complainant. If no legal action is filed within 10-14 business days, we may restore the content." },
    ];
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #ef4444, #f59e0b)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <AlertTriangle size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.75rem" }}>DMCA Policy</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto" }}>
                        Nexa Store respects intellectual property rights and expects all users and developers to do the same.
                    </p>
                </div>

                <div className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "24px", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem" }}>Our Commitment</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.95rem" }}>
                        Nexa Store complies with the Digital Millennium Copyright Act (DMCA). We respond promptly to valid notices of alleged copyright infringement and will remove or disable access to content we are notified is infringing. We also maintain a policy of terminating, in appropriate circumstances, accounts of repeat copyright infringers.
                    </p>
                </div>

                <h2 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "1.25rem" }}>Filing a Takedown Notice</h2>
                {steps.map((s) => (
                    <div key={s.n} className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px", marginBottom: "1rem", display: "flex", gap: "1.25rem" }}>
                        <div style={{ width: "36px", height: "36px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#ef4444", flexShrink: 0 }}>{s.n}</div>
                        <div>
                            <h3 style={{ fontWeight: "900", marginBottom: "0.5rem" }}>{s.title}</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.7" }}>{s.desc}</p>
                        </div>
                    </div>
                ))}

                <div className="liquid-glass" style={{ padding: "2rem", borderRadius: "24px", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "1rem" }}>Required Notice Contents</h2>
                    {[
                        "Your full legal name, physical address, telephone number, and email address.",
                        "A description of the copyrighted work you claim has been infringed.",
                        "The specific URL(s) on Nexa Store where the infringing content appears.",
                        "A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.",
                        "A statement, under penalty of perjury, that the above information is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner.",
                        "Your physical or electronic signature.",
                    ].map((req, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                            <FileText size={14} style={{ color: "#ef4444", flexShrink: 0, marginTop: "3px" }} />
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>{req}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px", textAlign: "center" }}>
                        <Mail size={24} style={{ color: "#ef4444", margin: "0 auto 0.75rem" }} />
                        <h3 style={{ fontWeight: "900", marginBottom: "0.25rem" }}>DMCA Agent</h3>
                        <a href="mailto:dmca@nexastore.app" style={{ color: "var(--accent-primary)", fontWeight: "700", fontSize: "0.85rem" }}>dmca@nexastore.app</a>
                    </div>
                    <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "20px", textAlign: "center" }}>
                        <Clock size={24} style={{ color: "#f59e0b", margin: "0 auto 0.75rem" }} />
                        <h3 style={{ fontWeight: "900", marginBottom: "0.25rem" }}>Response Time</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Within 48 business hours</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
