"use client";
import { Newspaper, Calendar } from "lucide-react";
import { InfoPageHeader } from "@/components/InfoPageHeader";

const posts = [
    { date: "Feb 20, 2026", title: "Nexa Store 2.0: Liquid Glass & Premium UI Overhaul", category: "Product Update", excerpt: "We've completely redesigned the Nexa Store experience with a stunning iOS 26-inspired Liquid Glass aesthetic, smooth Framer Motion animations, and a premium new profile hub." },
    { date: "Feb 10, 2026", title: "Introducing the Developer Hub: Publish Your Apps on Nexa", category: "Developer News", excerpt: "Starting today, verified developers can submit their Android apps, games, and modules directly through our publishing portal." },
    { date: "Jan 28, 2026", title: "Our Curation Philosophy: Why Less Is More", category: "Editorial", excerpt: "With thousands of APK sites out there, why do users choose Nexa? We believe it's because we say NO to more things than we say YES to." },
    { date: "Jan 15, 2026", title: "Security Report: How We Scan Every APK Before It Goes Live", category: "Security", excerpt: "Every single APK submitted to Nexa Store goes through a multi-layer security pipeline. Here's a behind-the-scenes look at how we keep our users safe." },
    { date: "Jan 01, 2026", title: "Welcome to Nexa Store: Our Origin Story", category: "About", excerpt: "Why did we build yet another Android app store? Because we felt the existing options were either too chaotic or too corporate." },
];

export default function BlogPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "5rem" }}>
            <InfoPageHeader />
            <div style={{ padding: "2.5rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Newspaper size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: "900", letterSpacing: "-1px", marginBottom: "1rem" }}>Nexa Blog</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7" }}>Updates, announcements, and deep-dives from the Nexa Store team.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {posts.map((post) => (
                        <div key={post.title} className="liquid-glass" style={{ padding: "1.75rem", borderRadius: "24px", cursor: "pointer", transition: "transform 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                <span style={{ fontSize: "0.72rem", fontWeight: "800", padding: "0.25rem 0.75rem", borderRadius: "100px", background: "rgba(0,122,255,0.15)", color: "var(--accent-primary)", border: "1px solid rgba(0,122,255,0.25)" }}>{post.category}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                    <Calendar size={12} /> {post.date}
                                </div>
                            </div>
                            <h2 style={{ fontSize: "1.15rem", fontWeight: "900", marginBottom: "0.75rem", lineHeight: "1.4" }}>{post.title}</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.7" }}>{post.excerpt}</p>
                            <div style={{ marginTop: "1rem", color: "var(--accent-primary)", fontWeight: "700", fontSize: "0.85rem" }}>Read more →</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
