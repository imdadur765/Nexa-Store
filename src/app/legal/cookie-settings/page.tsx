"use client";
import { InfoPageHeader } from "@/components/InfoPageHeader";
import { Cookie } from "lucide-react";
import { useState } from "react";

function ToggleRow({ label, desc, forced, initial }: { label: string; desc: string; forced?: boolean; initial?: boolean }) {
    const [on, setOn] = useState(initial ?? false);
    const active = forced ? true : on;
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.25rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "800", marginBottom: "0.25rem" }}>{label} {forced && <span style={{ fontSize: "0.65rem", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "0.15rem 0.5rem", borderRadius: "100px", marginLeft: "0.5rem", fontWeight: "800" }}>REQUIRED</span>}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: "1.6" }}>{desc}</p>
            </div>
            <button
                onClick={() => !forced && setOn(!on)}
                disabled={forced}
                style={{
                    width: "44px", height: "24px", borderRadius: "12px", flexShrink: 0,
                    background: active ? "var(--accent-primary)" : "rgba(255,255,255,0.15)",
                    border: "none", cursor: forced ? "not-allowed" : "pointer",
                    position: "relative", transition: "background 0.3s",
                }}
            >
                <span style={{
                    position: "absolute", top: "2px",
                    left: active ? "22px" : "2px",
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "white", transition: "left 0.3s",
                }} />
            </button>
        </div>
    );
}

export default function CookieSettingsPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Cookie size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "0.75rem" }}>Cookie Settings</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.7" }}>We use only essential cookies. Here you can review what each cookie does.</p>
                </div>

                <div className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "24px", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontWeight: "900", marginBottom: "0.25rem" }}>Your Cookie Preferences</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>Toggle optional cookie categories below.</p>
                    <ToggleRow label="Essential Cookies" desc="Required for the platform to function. Includes session management and CSRF protection. These cannot be disabled." forced initial />
                    <ToggleRow label="Preference Cookies" desc="Remember your settings like dark/light mode and language preferences." initial />
                    <ToggleRow label="Analytics Cookies" desc="Help us understand how users interact with Nexa Store in aggregate. No individual tracking. We use server-side analytics only." />
                    <ToggleRow label="Marketing Cookies" desc="Used to show relevant promotions within Nexa Store. We do not share this data with external advertisers." />
                </div>

                <div className="liquid-glass" style={{ padding: "1.5rem", borderRadius: "24px", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontWeight: "900", marginBottom: "0.75rem" }}>What is a Cookie?</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.875rem" }}>Cookies are small text files stored on your device that help websites remember information about your visit. They help make your experience more consistent and personalized. Nexa Store uses only first-party cookies — we do not use third-party tracking cookies from advertisers or data brokers.</p>
                </div>

                <button className="btn-premium" style={{ width: "100%", padding: "1rem", fontSize: "1rem", border: "none", cursor: "pointer" }}>
                    Save Cookie Preferences
                </button>
            </div>
        </div>
    );
}
