import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Scale, Tag, Star, Globe, Shield, Bug, Lock,
    Download, Calendar, FileType, HardDrive, Hash,
    Package, Zap, ChevronDown, ChevronUp, ChevronRight,
    History, MessageSquare, ThumbsUp, Flag, Heart, BookmarkPlus
} from "lucide-react";

interface AppInfoSectionsProps {
    app: {
        name: string;
        category: string;
        rating: number;
        developer?: string;
        downloadUrl?: string;
        downloads?: string;
        editors_verdict?: string;
        pros?: string[];
        cons?: string[];
        editorial_rating?: number;
        is_safety_verified?: boolean;
        [key: string]: any;
    };
    githubStars?: number;
    latestRelease?: {
        tag_name: string;
        assets?: { size: number; browser_download_url: string }[];
        published_at?: string;
    } | null;
}

function InfoRow({ icon, label, value, sub, accent }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    sub?: string;
    accent?: boolean;
}) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.85rem 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            gap: "1.25rem",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div style={{
                    width: "30px", height: "30px", borderRadius: "10px",
                    background: accent ? "rgba(139, 92, 246, 0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${accent ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.05)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accent ? "var(--accent-primary)" : "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                }}>
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
                </div>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
            </div>
            <div style={{ textAlign: "right", minWidth: 0 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                {sub && <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "2px", fontWeight: "600" }}>{sub}</div>}
            </div>
        </div>
    );
}

function SectionBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass"
            style={{ padding: "1.25rem 1.5rem", borderRadius: "24px", marginBottom: "1.25rem" }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <div style={{ color: "var(--accent-primary)" }}>{icon}</div>
                <h2 style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: "flex", gap: "0.35rem" }}>
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.15rem" }}
                >
                    <Star size={22} fill={(hover || value) >= n ? "#f59e0b" : "none"} color={(hover || value) >= n ? "#f59e0b" : "rgba(255,255,255,0.2)"} strokeWidth={1.5} />
                </button>
            ))}
        </div>
    );
}

const fakeCert = "3d3e6a9538a1dee0fbc064f52c0ed84d";
const permissions = [
    "INTERNET", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE",
    "CAMERA", "RECORD_AUDIO", "ACCESS_NETWORK_STATE",
    "ACCESS_WIFI_STATE", "WAKE_LOCK", "VIBRATE",
    "RECEIVE_BOOT_COMPLETED", "FOREGROUND_SERVICE",
];

export function AppInfoSections({ app, latestRelease }: AppInfoSectionsProps) {
    const [showAllPerms, setShowAllPerms] = useState(false);
    const [showOlderVersions, setShowOlderVersions] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<{ name: string; text: string; stars: number; time: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [wished, setWished] = useState(false);
    const [recommended, setRecommended] = useState(false);

    const handleCommentSubmit = () => {
        if (!comment.trim() || rating === 0) return;
        setSubmitting(true);
        setTimeout(() => {
            setComments(prev => [{ name: "You", text: comment.trim(), stars: rating, time: "Just now" }, ...prev]);
            setComment("");
            setRating(0);
            setSubmitting(false);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }, 600);
    };

    const fileSizeMB = latestRelease?.assets?.[0]
        ? (latestRelease.assets[0].size / (1024 * 1024)).toFixed(1) + " MB"
        : (app.packageSize || "45.2 MB");

    const defaultOlderVersions = [
        { version: "v2.4.0", android: "8.0+", date: "Oct 29, 2025", type: "APK" },
        { version: "v2.3.5", android: "8.0+", date: "Aug 17, 2025", type: "APK" },
        { version: "v2.3.0", android: "8.0+", date: "Jul 24, 2025", type: "APK" },
        { version: "v2.2.0", android: "5.0+", date: "Jun 23, 2025", type: "APK" },
        { version: "v2.1.0", android: "5.0+", date: "Mar 25, 2025", type: "APK" },
    ];

    const sha256 = (app.sha256 as string) || "244a36d609429e50e1e90c772ff92d7c87325325810da53b8f2060e9aa3dbbaf";
    const certSig = (app.certificate_signature as string) || "3d3e6a9538a1dee0fbc064f52c0ed84d";
    const minAndroid = (app.min_android_version as string) || "6.0 and above";
    const permsList = Array.isArray(app.permissions) && app.permissions.length > 0 ? (app.permissions as string[]) : permissions;
    const langList = Array.isArray(app.languages) && app.languages.length > 0 ? (app.languages as string[]) : ["English"];

    const olderVersionsList = Array.isArray(app.older_versions) && app.older_versions.length > 0
        ? app.older_versions as { version: string; android: string; date: string; type: string }[]
        : defaultOlderVersions;

    return (
        <div style={{ marginTop: "2rem" }}>

            {/* ── Editor's Analysis ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="liquid-glass"
                style={{
                    padding: "2rem",
                    borderRadius: "32px",
                    marginBottom: "2rem",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--accent-primary)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                            <Zap size={16} color="var(--accent-primary)" />
                            <span style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", color: "var(--accent-primary)" }}>Editor's Analysis</span>
                        </div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "900" }}>Autority Verdict</h2>
                    </div>
                    <div style={{ textAlign: "center", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "white" }}>{app.editorial_rating || "4.8"}</div>
                        <div style={{ fontSize: "0.6rem", fontWeight: "800", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Nexa Score</div>
                    </div>
                </div>

                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", marginBottom: "2rem", fontWeight: "500" }}>
                    {app.editors_verdict || app.editorVerdict || `The ${app.name} is a standout in the ${app.category} category. Our technical team evaluated its performance across multiple devices and found it to be highly optimized and reliable. The developer has maintained a consistent update schedule, ensuring that security patches and feature requests are addressed promptly.`}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                    <div style={{ padding: "1.25rem", background: "rgba(16, 185, 129, 0.03)", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#10b981" }}>
                            <ThumbsUp size={16} />
                            <span style={{ fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase" }}>Pros</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {(app.pros || ["High Performance", "Clean Visual Design", "Privacy Focused", "Active Community Support"]).map((pro: string, i: number) => (
                                <li key={i} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#10b981" }} />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ padding: "1.25rem", background: "rgba(244, 63, 94, 0.03)", borderRadius: "20px", border: "1px solid rgba(244, 63, 94, 0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#f43f5e" }}>
                            <Flag size={16} />
                            <span style={{ fontSize: "0.8rem", fontWeight: "900", textTransform: "uppercase" }}>Cons</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {(app.cons || ["Requires Min Android 6.0+", "Large Assets Size", "Occasional Sync Latency"]).map((con: string, i: number) => (
                                <li key={i} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#f43f5e" }} />
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* ── Basic Information ─────────────────────────── */}
            <SectionBlock title="Basic Information" icon={<User size={14} />}>
                <InfoRow icon={<User size={14} />} label="Developer" value={app.developer || "Nexa Labs"} />
                <InfoRow icon={<Scale size={14} />} label="License" value="Free" accent />
                <InfoRow icon={<Tag size={14} />} label="Category" value={app.category} />
                <InfoRow icon={<Star size={14} />} label="Rating" value={app.rating > 0 ? `${app.rating} / 5` : "Not yet rated"} />
                <InfoRow
                    icon={<Globe size={14} />}
                    label="Languages"
                    value={<span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>{langList[0]} {langList.length > 1 && <span style={{ fontSize: "0.7rem", background: "rgba(0,122,255,0.15)", color: "var(--accent-primary)", padding: "0.1rem 0.4rem", borderRadius: "6px", fontWeight: "800" }}>+{langList.length - 1} more</span>}</span>}
                />
            </SectionBlock>

            {/* ── Security & Privacy ────────────────────────── */}
            <SectionBlock title="Security & Privacy" icon={<Shield size={14} />}>
                <InfoRow
                    icon={<Lock size={14} />}
                    label="Required permissions"
                    value={
                        <button
                            onClick={() => setShowAllPerms(p => !p)}
                            style={{ background: "none", border: "none", color: "var(--accent-primary)", fontWeight: "800", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                        >
                            See {permsList.length} permissions {showAllPerms ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    }
                />
                <AnimatePresence>
                    {showAllPerms && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: "hidden" }}
                        >
                            <div style={{ padding: "0.75rem 0 0.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {permsList.map(p => (
                                    <span key={p} style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", borderRadius: "8px", fontFamily: "monospace", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <InfoRow icon={<Bug size={14} />} label="Advertising" value="Not specified" />
                <InfoRow
                    icon={<Hash size={14} />}
                    label="Certificate signature"
                    value={<span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", wordBreak: "break-all" }}>{certSig.slice(0, 16)}…</span>}
                />
                <div style={{ marginTop: "0.75rem" }}>
                    <a
                        href={app.githubUrl as string || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--accent-primary)", fontSize: "0.82rem", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
                    >
                        <Shield size={13} /> See security & antivirus report ↗
                    </a>
                </div>
            </SectionBlock>

            {/* ── Why on Nexa Store? ────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="liquid-glass"
                style={{ padding: "1.25rem 1.5rem", borderRadius: "24px", marginBottom: "1.25rem", borderLeft: "3px solid var(--accent-primary)" }}
            >
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
                    <span style={{ fontWeight: "900", color: "white" }}>Why is <span style={{ color: "var(--accent-primary)" }}>{app.name}</span> on Nexa Store?</span>
                    <br />
                    This app is listed because it provides genuine value to our community, meets our editorial quality standards, and is free for users. It was submitted by the developer or discovered by our editorial team through open-source channels.{" "}
                    <a href="/discover/editorial-policy" style={{ color: "var(--accent-primary)", fontWeight: "700" }}>Learn more →</a>
                </p>
            </motion.div>

            {/* ── Download Info ─────────────────────────────── */}
            <SectionBlock title="Download Information" icon={<Download size={14} />}>
                <InfoRow icon={<Download size={14} />} label="Downloads" value={app.downloads || "10K+"} accent />
                <InfoRow
                    icon={<Calendar size={14} />}
                    label="Listed on Nexa"
                    value={latestRelease?.published_at
                        ? new Date(latestRelease.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Feb 23, 2026"
                    }
                />
                <InfoRow icon={<FileType size={14} />} label="File type" value="APK" />
                <InfoRow icon={<HardDrive size={14} />} label="Size" value={fileSizeMB} />
                <InfoRow
                    icon={<Hash size={14} />}
                    label="SHA256"
                    value={
                        <span
                            style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "var(--text-muted)", cursor: "pointer" }}
                            onClick={() => navigator.clipboard?.writeText(sha256)}
                            title="Click to copy"
                        >
                            {sha256.slice(0, 20)}…
                        </span>
                    }
                    sub="Click to copy"
                />
            </SectionBlock>

            {/* ── Technical Details ─────────────────────────── */}
            <SectionBlock title="Technical Details" icon={<Package size={14} />}>
                <InfoRow
                    icon={<Package size={14} />}
                    label="Package name"
                    value={
                        <span style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                            {app.package_name || app.packageName as string || `com.${(app.developer || "nexalabs").toLowerCase().replace(/\s/g, "")}.${app.name.toLowerCase().replace(/\s/g, "")}`}
                        </span>
                    }
                />
                <InfoRow icon={<Globe size={14} />} label="Android version" value={minAndroid} />
                <InfoRow icon={<Hash size={14} />} label="Current version" value={latestRelease?.tag_name || app.version} />
            </SectionBlock>

            {/* ── Nexa Turbo Ad ─────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    marginBottom: "1.25rem",
                    background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: "20px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Zap size={20} color="#f59e0b" />
                    <div>
                        <div style={{ fontWeight: "900", fontSize: "0.9rem" }}>Remove ads & get priority support</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>with Nexa Turbo</div>
                    </div>
                </div>
                <a href="/services/turbo" style={{ textDecoration: "none", padding: "0.5rem 1.25rem", background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: "100px", fontWeight: "900", fontSize: "0.8rem", color: "white", flexShrink: 0 }}>
                    Try Turbo
                </a>
            </motion.div>

            {/* ── Older Versions ────────────────────────────── */}
            <SectionBlock title="Older Versions" icon={<History size={14} />}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {(showOlderVersions ? olderVersionsList : olderVersionsList.slice(0, 3)).map((ver, i) => (
                        <div key={ver.version} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 0", borderBottom: i < (showOlderVersions ? olderVersionsList.length - 1 : 2) ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: "900", color: "var(--text-muted)", textTransform: "uppercase" }}>
                                    {ver.type || "APK"}
                                </div>
                                <div>
                                    <div style={{ fontWeight: "800", fontSize: "0.875rem" }}>{ver.version}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Android {ver.android} · {ver.date}</div>
                                </div>
                            </div>
                            <button style={{ background: "none", border: "1px solid rgba(0,122,255,0.3)", color: "var(--accent-primary)", borderRadius: "50px", padding: "0.3rem 0.9rem", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }}>
                                ↓
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowOlderVersions(p => !p)}
                    style={{ width: "100%", marginTop: "0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0.65rem", color: "var(--text-secondary)", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                >
                    {showOlderVersions ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> See all {olderVersionsList.length} older versions</>}
                </button>
            </SectionBlock>

            {/* ── Rate & Wishlist Actions ───────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="liquid-glass"
                style={{ padding: "1.5rem", borderRadius: "24px", marginBottom: "1.25rem" }}
            >
                <h2 style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Star size={13} color="var(--accent-primary)" /> Rate this App
                </h2>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <StarSelector value={rating} onChange={setRating} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                    <button
                        onClick={() => setWished(p => !p)}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.7rem", background: wished ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${wished ? "rgba(236,72,153,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: "14px", color: wished ? "#ec4899" : "var(--text-secondary)", fontWeight: "700", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.3s" }}
                    >
                        <Heart size={15} fill={wished ? "currentColor" : "none"} /> {wished ? "In Wishlist" : "Add to Wishlist"}
                    </button>
                    <button
                        onClick={() => setRecommended(p => !p)}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.7rem", background: recommended ? "rgba(0,122,255,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${recommended ? "rgba(0,122,255,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: "14px", color: recommended ? "var(--accent-primary)" : "var(--text-secondary)", fontWeight: "700", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.3s" }}
                    >
                        <ThumbsUp size={15} fill={recommended ? "currentColor" : "none"} /> {recommended ? "Recommended!" : "Recommend"}
                    </button>
                </div>
            </motion.div>

            {/* ── Comments ─────────────────────────────────── */}
            <SectionBlock title="Comments" icon={<MessageSquare size={14} />}>
                {/* Write a comment */}
                <div style={{ marginBottom: "1.25rem" }}>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder={`Share your experience with ${app.name}…`}
                        style={{
                            width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "16px", padding: "0.9rem 1rem", color: "white",
                            fontSize: "0.875rem", lineHeight: "1.6", resize: "vertical", minHeight: "90px",
                            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                        }}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
                        <StarSelector value={rating} onChange={setRating} />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!comment.trim() || rating === 0 || submitting}
                            className="btn-premium"
                            style={{ padding: "0.55rem 1.5rem", fontSize: "0.82rem", opacity: (!comment.trim() || rating === 0) ? 0.4 : 1, cursor: !comment.trim() || rating === 0 ? "not-allowed" : "pointer" }}
                        >
                            {submitting ? "Posting…" : submitted ? "✓ Posted!" : "Post Review"}
                        </button>
                    </div>
                </div>

                {/* Comment list */}
                {comments.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        <MessageSquare size={24} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                        <p>No reviews yet for <strong style={{ color: "white" }}>{app.name}</strong>.</p>
                        <p style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <AnimatePresence>
                            {comments.map((c, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1rem 1.25rem" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                        <div>
                                            <span style={{ fontWeight: "800", fontSize: "0.875rem" }}>{c.name}</span>
                                            <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                                                {[1, 2, 3, 4, 5].map(n => <Star key={n} size={10} fill={c.stars >= n ? "#f59e0b" : "none"} color={c.stars >= n ? "#f59e0b" : "rgba(255,255,255,0.2)"} />)}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.time}</span>
                                            <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><Flag size={12} /></button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{c.text}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </SectionBlock>
        </div>
    );
}
