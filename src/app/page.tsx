"use client";

/**
 * Home Page — Performance-optimized for 100,000+ apps.
 *
 * OPTIMIZATION SUMMARY:
 * ─────────────────────────────────────────────────────
 * 1. ANIMATED COUNTER  → rAF runs once. useRef guard prevents restart on
 *                         unrelated re-renders (e.g. XP counter ticking).
 *
 * 2. ALL DERIVED DATA  → useMemo. Recalculates only when appsData changes.
 *
 * 3. EVENT HANDLERS    → useCallback. Children wrapped in React.memo don't
 *                         re-render when parent ticks.
 *
 * 4. FEED STABILITY  → Memoized ForYouTab.
 *
 * 5. STATIC RENDER   → No lazy loading or scroll batching for zero flicker.
 *
 * 6. TAB CONTENT       → useCallback-wrapped renderer. Only active tab
 *                         JSX is evaluated per render.
 *
 * 7. SUB-COMPONENTS    → Defined at MODULE level (not inside Home).
 *                         Prevents React treating them as new types each render
 *                         and fully unmounting/remounting them.
 *
 * 8. CLAIM BANNER      → Auto-dismisses after 4s. No persistent re-renders.
 *
 * 9. appsByCategory    → O(n) pre-map. O(1) lookups in render loop.
 *                         Without this: O(n*k) per render = disaster at scale.
 */

import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search, Sparkles, Trophy, Shield, Rocket,
  Palette, Cpu, Gem, Gamepad2, Terminal,
} from "lucide-react";
import { motion } from "framer-motion";
import HamburgerDrawer from "@/components/HamburgerDrawer";
import TopCharts from "@/components/TopCharts";
import { AppHero } from "@/components/AppHero";
import { GamingRow } from "@/components/games/GamingRow";
import { GamingGrid } from "@/components/games/GamingGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { AppEntry } from "@/data/apps";
import { useApps } from "@/hooks/useApps";
import { useAuth } from "@/context/AuthContext";
import { useNexaPoints } from "@/hooks/useNexaPoints";
import { getAvatarUrl } from "@/lib/utils";
import { RevalidatingIndicator } from "@/components/AppCacheProvider";
import { XPPill } from "@/components/XPPill";


// ─── Constants outside component ─────────────────────────────────────────────
// Defined here so they are never re-created on re-renders.
// Any array/object defined inside a component body is a new reference every
// render, which breaks React.memo and useMemo dependency checks.

const HOME_CATEGORIES = [
  { id: "customization", label: "Customization", icon: <Palette size={18} />, color: "#f472b6", desc: "Theming & Layouts" },
  { id: "system",        label: "System Tools",  icon: <Cpu      size={18} />, color: "#3ddc84", desc: "Performance & Speed" },
  { id: "productivity",  label: "Productivity",  icon: <Rocket   size={18} />, color: "#60a5fa", desc: "Work & Efficiency" },
  { id: "rare",          label: "Rare Finds",    icon: <Gem      size={18} />, color: "#fbbf24", desc: "Exclusive Picks" },
  { id: "security",      label: "Security",      icon: <Shield   size={18} />, color: "#ef4444", desc: "Privacy & Protection" },
  { id: "gaming",        label: "Gaming",        icon: <Gamepad2 size={18} />, color: "#8b5cf6", desc: "Games & Fun" },
] as const;

const TABS = ["For you", "Top charts", "Other devices", "Kids"] as const;
type Tab = typeof TABS[number];

const DIVIDER_STYLE = {
  margin: "0 1.25rem",
  height: "1px",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 80%, transparent)",
  marginBottom: "4.5rem",
} as const;

// ─── Extracted sub-components (module-level = stable identity) ────────────────

const Divider = memo(() => <div style={DIVIDER_STYLE} />);
Divider.displayName = "Divider";

interface TabPillProps { label: string; isActive: boolean; onClick: () => void; }
const TabPill = memo(({ label, isActive, onClick }: TabPillProps) => (
  <div
    className={`tab-pill ${isActive ? "active" : ""}`}
    style={{
      padding: "0.6rem 1.25rem", borderRadius: "100px",
      position: "relative", background: "transparent",
      border: "1px solid transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      minWidth: "fit-content", cursor: "pointer",
    }}
    onClick={onClick}
  >
    {isActive && (
      <motion.div
        layoutId="homeTab"
        style={{
          position: "absolute", inset: 0,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "100px",
          border: "1px solid rgba(255, 255, 255, 0.1)", zIndex: 0,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span style={{
      position: "relative", zIndex: 1,
      fontSize: "0.85rem", fontWeight: "700", whiteSpace: "nowrap",
      color: isActive ? "white" : "rgba(255,255,255,0.5)",
      transition: "color 0.3s ease",
    }}>{label}</span>
  </div>
));
TabPill.displayName = "TabPill";

interface CategoryCardProps { cat: typeof HOME_CATEGORIES[number]; onClick: () => void; }
const CategoryCard = memo(({ cat, onClick }: CategoryCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="liquid-glass hw-accel"
    style={{
      background: `linear-gradient(145deg, ${cat.color}20, rgba(255,255,255,0.02))`,
      borderRadius: "22px", border: "0.5px solid rgba(255, 255, 255, 0.12)",
      padding: "0.9rem", display: "flex", flexDirection: "column",
      justifyContent: "space-between", alignItems: "flex-start",
      position: "relative", overflow: "hidden", textAlign: "left",
      cursor: "pointer", boxShadow: "0 4px 20px -5px rgba(0,0,0,0.5)",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    }}
  >
    <div style={{ background: `${cat.color}25`, padding: "0.5rem", borderRadius: "12px", color: cat.color, boxShadow: `0 0 20px ${cat.color}33`, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {cat.icon}
    </div>
    <div style={{ zIndex: 2 }}>
      <h3 style={{ fontSize: "0.85rem", fontWeight: "900", color: "white", lineHeight: "1", marginBottom: "0.15rem" }}>{cat.label}</h3>
      <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontWeight: "600", letterSpacing: "0.2px" }}>{cat.desc}</p>
    </div>
    <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60%", height: "60%", background: `radial-gradient(circle, ${cat.color}15 0%, transparent 70%)`, zIndex: 1, pointerEvents: "none" }} />
  </motion.button>
));
CategoryCard.displayName = "CategoryCard";

interface ForYouTabProps {
  featuredApps: AppEntry[];
  rareFinds: AppEntry[];
  editorsChoice: AppEntry[];
  consumerApps: AppEntry[];
  moduleApps: AppEntry[];
  uniqueCategories: string[];
  appsByCategory: Record<string, AppEntry[]>;
  discoveryApps: AppEntry[];
  onCategoryClick: (id: string) => void;
}

const ForYouTab = memo(function ForYouTab({
  featuredApps,
  rareFinds,
  editorsChoice,
  consumerApps,
  moduleApps,
  uniqueCategories,
  appsByCategory,
  discoveryApps,
  onCategoryClick,
}: ForYouTabProps) {
  return (
    <>
      <AppHero apps={featuredApps} />

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {rareFinds.length > 0 && (
          <div className="cv-auto">
            <GamingRow title="💎 Rare Finds" games={rareFinds.slice(0, 18)} seeAllHref="/categories/rare" />
            <Divider />
          </div>
        )}

        {editorsChoice.length > 0 && (
          <div className="cv-auto">
            <GamingRow title="✨ Editor's Choice" games={editorsChoice.slice(0, 18)} seeAllHref="/suggested" />
            <Divider />
          </div>
        )}

        <div className="cv-auto">
          <GamingRow title="Recommended for you" games={consumerApps.slice(0, 12)} seeAllHref="/suggested" />
          <Divider />
        </div>

        {/* Bento categories */}
        <section id="explore-categories" style={{ padding: "0 0.5rem" }}>
          <SectionHeader title="Explore Categories" marginTop="0" marginBottom="1.5rem" />
          <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridAutoRows: "95px", gap: "0.75rem" }}>
            {HOME_CATEGORIES.map(cat => (
              <CategoryCard key={cat.id} cat={cat} onClick={() => onCategoryClick(cat.id)} />
            ))}
          </div>
        </section>

        <div style={{ margin: "4.5rem 1.25rem", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 80%, transparent)" }} />

        {moduleApps.length > 0 && (
          <div className="cv-auto">
            <GamingRow title="Featured Apps" games={moduleApps.slice(0, 24)} seeAllHref="/modules" />
            <div style={{ margin: "0 1.25rem 4.5rem", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 80%, transparent)" }} />
          </div>
        )}

        {/* Dynamic category feed */}
        {uniqueCategories.map(cat => {
          const games = appsByCategory[cat];
          if (!games?.length) return null;
          return (
            <div key={cat} className="cv-auto">
              <GamingRow title={`Discover ${cat}`} games={games.slice(0, 18)} seeAllHref={`/categories/${cat.toLowerCase()}`} />
              <div style={{ margin: "0 1.25rem 2.5rem", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 80%, transparent)" }} />
            </div>
          );
        })}

        <div className="cv-auto">
          <GamingRow title="Trending Powerhouses" games={consumerApps.filter(a => a.trending).slice(0, 18)} seeAllHref="/trending" />
        </div>
      </div>

      <section style={{ marginTop: "4rem" }}>
        <GamingGrid title="More to discover" games={discoveryApps} limit={12} seeAllHref="/discover" />
      </section>
    </>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { apps: appsData, revalidating } = useApps();
  const { user } = useAuth();
  const { points: livePoints, getCurrentLevel, claimDailyReward, canClaimDaily, isUpdating } = useNexaPoints();

  // UI state
  const [searchQuery, setSearchQuery]     = useState("");
  const [activeTab, setActiveTab]         = useState<Tab>("For you");
  const [menuOpen, setMenuOpen]           = useState(false);
  const [claimStatus, setClaimStatus]     = useState<{ success?: boolean; message?: string } | null>(null);


  // Auto-dismiss claim banner
  useEffect(() => {
    if (!claimStatus) return;
    const id = setTimeout(() => setClaimStatus(null), 4000);
    return () => clearTimeout(id);
  }, [claimStatus]);

  // ── Memoized derived data ─────────────────────────────────────────────────

  const consumerApps = useMemo(
    () => appsData.filter(a => a.category !== "Modules" && a.category !== "Rare"),
    [appsData]
  );
  const moduleApps   = useMemo(
    () => appsData.filter(a => a.category === "Modules" || a.category === "Rare"),
    [appsData]
  );
  const featuredApps = useMemo(
    () => appsData.filter(a => a.isHero || a.trending).slice(0, 6),
    [appsData]
  );
  const rareFinds    = useMemo(() => appsData.filter(a => a.tags?.includes("row:rare-find")),    [appsData]);
  const editorsChoice= useMemo(() => appsData.filter(a => a.tags?.includes("row:editors-choice")),[appsData]);

  const toolsApps         = useMemo(() => consumerApps.filter(a => a.category === "Tools").slice(0, 6), [consumerApps]);
  const entertainmentApps = useMemo(() => consumerApps.filter(a => a.category === "Entertainment").slice(0, 6), [consumerApps]);
  const kidsApps          = useMemo(() => appsData.filter(a => a.ageRating === "4+" || a.category === "Education").slice(0, 6), [appsData]);
  const kidsGames         = useMemo(() => appsData.filter(a => a.category === "Games").slice(0, 6), [appsData]);

  const allFiltered  = useMemo(() => {
    if (!searchQuery.trim()) return appsData;
    const q = searchQuery.toLowerCase();
    return appsData.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }, [appsData, searchQuery]);

  const discoveryApps = useMemo(() => allFiltered.slice(4), [allFiltered]);
  const hasResults    = allFiltered.length > 0;

  const uniqueCategories = useMemo(() => {
    const cats = new Set(consumerApps.map(a => a.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [consumerApps]);

  // Pre-map: O(n) once → O(1) per category row render
  // Without this: .filter() runs per category per render = O(n × categories)
  const appsByCategory = useMemo(() => {
    const map: Record<string, typeof consumerApps> = {};
    for (const cat of uniqueCategories) {
      map[cat] = consumerApps.filter(a => a.category === cat);
    }
    return map;
  }, [uniqueCategories, consumerApps]);

  // Level info — cheap call, but stable via memo so children don't re-render
  const levelInfo = useMemo(() => getCurrentLevel(), [getCurrentLevel, livePoints]);

  // ── Stable callbacks ──────────────────────────────────────────────────────

  const handleToggleMenu  = useCallback(() => setMenuOpen(p => !p), []);
  const handleCloseMenu   = useCallback(() => setMenuOpen(false), []);
  const handleGoToProfile = useCallback(() => router.push("/profile"), [router]);
  const handleGoToSearch  = useCallback(() => router.push("/search"), [router]);
  const handleAuthRoute   = useCallback(() => router.push(user ? "/profile" : "/login"), [router, user]);
  const handleClearSearch = useCallback(() => { setSearchQuery(""); setActiveTab("For you"); }, []);
  const handleClaimReward = useCallback(async () => {
    const result = await claimDailyReward();
    setClaimStatus(result);
  }, [claimDailyReward]);

  const handleCategoryClick = useCallback((id: string) => {
    router.push(`/categories/${id}`);
  }, [router]);

  // ── Tab content ───────────────────────────────────────────────────────────
  // useCallback: only re-creates when these specific deps change,
  // not on every render cycle.
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "For you": return (
        <ForYouTab
          featuredApps={featuredApps}
          rareFinds={rareFinds}
          editorsChoice={editorsChoice}
          consumerApps={consumerApps}
          moduleApps={moduleApps}
          uniqueCategories={uniqueCategories}
          appsByCategory={appsByCategory}
          discoveryApps={discoveryApps}
          onCategoryClick={handleCategoryClick}
        />
      );

      case "Top charts": return <TopCharts />;

      case "Other devices": return (
        <div style={{ padding: "0 1rem", marginTop: "1rem" }}>
          <div style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", borderRadius: "24px", padding: "2rem 1.5rem", marginBottom: "2rem", textAlign: "center", boxShadow: "0 10px 40px -10px rgba(168, 85, 247, 0.4)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>Cross-Device Freedom</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", maxWidth: "300px", margin: "0 auto 1.5rem auto" }}>Install your favorite apps on Watch, TV, and Car.</p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              {["Watch", "TV", "Car"].map(d => (
                <button key={d} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.5rem 1rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "700" }}>{d}</button>
              ))}
            </div>
          </div>
          <GamingRow title="Wear OS Essentials"    games={toolsApps}         seeAllHref="/tools" />
          <div style={{ height: "2rem" }} />
          <GamingRow title="Android TV Must-Haves" games={entertainmentApps} seeAllHref="/categories/entertainment" />
        </div>
      );

      case "Kids": return (
        <div style={{ padding: "0 1rem", marginTop: "1rem" }}>
          <div style={{ background: "linear-gradient(135deg, #facc15 0%, #f97316 100%)", borderRadius: "24px", padding: "2rem 1.5rem", marginBottom: "2rem", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 10px 40px -10px rgba(250, 204, 21, 0.4)" }}>
            <Sparkles size={100} color="white" style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.2 }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "0.5rem" }}>Teacher Approved</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", maxWidth: "300px", margin: "0 auto" }}>Safe, fun, and educational apps for growing minds.</p>
          </div>
          <GamingRow title="Ages 5 & Under" games={kidsApps} seeAllHref="/categories/education" />
          <div style={{ height: "2rem" }} />
          <GamingRow title="Ages 6–8" games={kidsGames} seeAllHref="/games" />
        </div>
      );

      default: return null;
    }
  }, [activeTab, featuredApps, rareFinds, editorsChoice, consumerApps, moduleApps, uniqueCategories, appsByCategory, discoveryApps, handleCategoryClick, appsData, toolsApps, entertainmentApps, kidsApps, kidsGames]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: "8rem", maxWidth: "100%", margin: "0 auto", position: "relative" }}>
      <RevalidatingIndicator isRevalidating={revalidating} />


      {/* Header - Optimized blur and complexity */}
      <header className="liquid-glass" style={{ 
        padding: "0.6rem 1.25rem", 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        display: "flex", 
        flexDirection: "column", 
        gap: "0.6rem", 
        borderRadius: "0 0 24px 24px",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Image src="/platforms/nexa_logo_optimized.png" alt="Nexa Logo" width={34} height={34} style={{ objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "900", letterSpacing: "-0.4px" }}>Nexa Store</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <XPPill points={livePoints} onClick={handleGoToProfile} />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAuthRoute} style={{ position: "relative", cursor: "pointer" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: user ? "linear-gradient(45deg, #10b981, #3b82f6)" : "linear-gradient(45deg, #f59e0b, #ef4444, #ec4899, #8b5cf6)", padding: "2px", boxShadow: user ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "0 4px 12px rgba(239, 68, 68, 0.3)" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  {user
                    ? <img src={getAvatarUrl(user.email, user.user_metadata?.avatar_url)} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg, #333, #111)" }} />
                  }
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", background: user ? "linear-gradient(90deg, #3b82f6, #8b5cf6)" : "linear-gradient(90deg, #ef4444, #f59e0b)", color: "white", fontSize: "0.55rem", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.8)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)", whiteSpace: "nowrap", letterSpacing: "0.5px" }}>
                {user ? `LV.${levelInfo.level}` : "GUEST"}
              </div>
            </motion.div>

            <button onClick={handleToggleMenu} className="liquid-glass ios-btn-haptic" aria-label="Open menu" style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer", background: "none", flexShrink: 0 }}>
              <span style={{ display: "block", width: "16px", height: "2px", background: "white", borderRadius: "2px", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
              <span style={{ display: "block", width: "16px", height: "2px", background: "white", borderRadius: "2px", opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
              <span style={{ display: "block", width: "16px", height: "2px", background: "white", borderRadius: "2px", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
            </button>
          </div>
        </div>

        <div className="search-pill-container liquid-glass" style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1.25rem", borderRadius: "100px", transition: "var(--transition-smooth)", cursor: "text" }} onClick={handleGoToSearch}>
          <Search size={18} color="rgba(255,255,255,0.6)" />
          <div style={{ flex: 1, color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", fontWeight: "500", letterSpacing: "0.2px" }}>Search for apps &amp; games</div>
        </div>

        {user && canClaimDaily() && !claimStatus?.success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass pulse-soft" style={{ margin: "0.5rem 1.25rem", padding: "0.75rem 1rem", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><Trophy size={16} color="#3b82f6" /></div>
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "white" }}>Daily Reward Ready!</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>Earn 50 XP for visiting today.</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isUpdating} onClick={handleClaimReward} style={{ background: "var(--accent-primary)", color: "white", border: "none", padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)" }}>
              {isUpdating ? "..." : "CLAIM"}
            </motion.button>
          </motion.div>
        )}

        {claimStatus && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ margin: "0.5rem 1.25rem", padding: "0.6rem 1rem", borderRadius: "12px", textAlign: "center", fontSize: "0.8rem", fontWeight: "900", background: claimStatus.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: claimStatus.success ? "#10b981" : "#ef4444", border: `1px solid ${claimStatus.success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}` }}>
            {claimStatus.message}
          </motion.div>
        )}
      </header>

      <HamburgerDrawer isOpen={menuOpen} onClose={handleCloseMenu} />

      {/* Tab bar */}
      <div style={{ padding: "0 1rem", position: "sticky", top: "5.5rem", marginTop: "1rem", zIndex: 90, marginBottom: "2rem" }}>
        <div className="liquid-glass no-scrollbar" style={{ display: "flex", gap: "0.4rem", overflowX: "auto", padding: "0.4rem", borderRadius: "100px", width: "fit-content", maxWidth: "100%", margin: "0 auto", position: "relative" }}>
          {TABS.map(tab => (
            <TabPill key={tab} label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </div>
      </div>

      {/* Content */}
      {hasResults ? (
        <div className="animate-fade-in">
          {renderTabContent()}
          {activeTab === "For you" && (
            <section style={{ marginTop: "4rem" }}>
              <GamingGrid title="More to discover" games={discoveryApps} limit={12} seeAllHref="/discover" />
            </section>
          )}
        </div>
      ) : (
        <section style={{ padding: "5rem 2rem", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "32px", border: "1px dashed var(--glass-border)", margin: "2rem 1.25rem" }}>
          <Rocket size={48} style={{ margin: "0 auto 1.5rem auto", opacity: 0.3 }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800" }}>No apps found</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>We couldn&apos;t find any results for &quot;{searchQuery}&quot;.</p>
          <button onClick={handleClearSearch} style={{ marginTop: "1.5rem", color: "var(--accent-primary)", fontWeight: "700", background: "none", border: "none", cursor: "pointer" }}>Clear all filters</button>
        </section>
      )}

      {/* Community banner */}
      <section style={{ marginTop: "6rem", padding: "3rem", borderRadius: "32px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", background: "var(--accent-primary)", filter: "blur(150px)", opacity: "0.1" }} />
        <Rocket size={40} color="var(--accent-primary)" style={{ margin: "0 auto 1.25rem auto" }} />
        <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "0.75rem" }}>Open Source &amp; Secure.</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto 1.5rem auto" }}>Explore the community repositories on GitHub.</p>
        <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2.5rem" }}>Browse Repositories</a>
      </section>

      {/* Dev CTA */}
      <section style={{ marginTop: "2rem", padding: "2.5rem 1.5rem", borderRadius: "32px", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))", border: "1px solid rgba(59, 130, 246, 0.1)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <Terminal size={32} color="#8b5cf6" />
        <h2 style={{ fontSize: "1.5rem", fontWeight: "900" }}>Want to Publish?</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", maxWidth: "400px" }}>Join our developer ecosystem and reach thousands of users with your apps and creations.</p>
        <Link href="/publish" style={{ textDecoration: "none" }}>
          <button style={{ padding: "0.8rem 2rem", borderRadius: "100px", background: "white", color: "black", border: "none", fontWeight: "900", fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>Developer Portal</button>
        </Link>
      </section>

    </div>
  );
}