"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Zap, Sparkles, Trophy, Star, Shield, Flame, Rocket, ChevronRight, Camera, Play, MessageCircle, Music, X, Download, Palette, Cpu, Gem, Gamepad2, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import HamburgerDrawer from "@/components/HamburgerDrawer";
import AppCard from "@/components/AppCard";
import TopCharts from "@/components/TopCharts";
import { AppHero } from "@/components/AppHero";
import { GamingRow } from "@/components/games/GamingRow";
import { GamingGrid } from "@/components/games/GamingGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { useApps } from "@/hooks/useApps";
import { useAuth } from "@/context/AuthContext";
import { useNexaPoints } from "@/hooks/useNexaPoints";
import { getAvatarUrl } from "@/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("For you");
  const router = useRouter();
  const { apps: appsData, loading } = useApps();
  const { user } = useAuth();
  const { points: livePoints, getCurrentLevel } = useNexaPoints();

  // ── Animated Points Counter Logic ──
  const [points, setPoints] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const targetPoints = livePoints;
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple ease-out counter animation
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setPoints(Math.floor(easeProgress * targetPoints));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setPoints(targetPoints); // ensure exact final number
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  // Memoized filter operations — prevent recalculating on every render
  const consumerApps = useMemo(() =>
    appsData.filter(app => app.category !== "Modules" && app.category !== "Rare"),
    [appsData]
  );
  const moduleApps = useMemo(() =>
    appsData.filter(app => app.category === "Modules" || app.category === "Rare"),
    [appsData]
  );

  const allFiltered = useMemo(() =>
    appsData.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }),
    [appsData, searchQuery]
  );

  const rareFinds = useMemo(() => appsData.filter(app => app.tags?.includes('row:rare-find')), [appsData]);
  const editorsChoice = useMemo(() => appsData.filter(app => app.tags?.includes('row:editors-choice')), [appsData]);
  const securityApps = useMemo(() => appsData.filter(app => app.tags?.includes('row:security')), [appsData]);

  const discoveryApps = useMemo(() => allFiltered.slice(4), [allFiltered]);
  const featuredApps = useMemo(() => appsData.filter(a => a.isHero || a.trending).slice(0, 6), [appsData]);
  const hasResults = allFiltered.length > 0;

  const homeCategories = [
    { id: 'customization', label: 'Customization', icon: <Palette size={18} />, color: '#f472b6', desc: 'Theming & Layouts', span: 1, row: 1 },
    { id: 'system', label: 'System Tools', icon: <Cpu size={18} />, color: '#3ddc84', desc: 'Performance & Root', span: 1, row: 1 },
    { id: 'productivity', label: 'Productivity', icon: <Rocket size={18} />, color: '#60a5fa', desc: 'Work & Efficiency', span: 1, row: 1 },
    { id: 'rare', label: 'Rare Finds', icon: <Gem size={18} />, color: '#fbbf24', desc: 'Exclusive Modules', span: 1, row: 1 },
    { id: 'security', label: 'Security', icon: <Shield size={18} />, color: '#ef4444', desc: 'Privacy & Protection', span: 1, row: 1 },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={18} />, color: '#8b5cf6', desc: 'Tweak & Play', span: 1, row: 1 },
  ];

  return (
    <div style={{ paddingBottom: '8rem', maxWidth: '100%', margin: '0 auto', position: 'relative' }}>

      {/* Primary Integrated Header */}
      <header
        className="ultra-glass"
        style={{
          padding: '0.6rem 1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background: 'rgba(5, 5, 5, 0.4)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Image
                src="/platforms/nexa_logo_optimized.png"
                alt="Nexa Logo"
                width={34}
                height={34}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.4px' }}>Nexa Store</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            {/* Animated Points Counter */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
                padding: '0.35rem 0.8rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '900',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' }} />
              <span ref={counterRef} style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                {points.toLocaleString()}
              </span>
            </motion.div>

            {/* Premium Profile Ring with Level Badge (Auth Aware) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(user ? '/profile' : '/login')}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: user
                  ? 'linear-gradient(45deg, #10b981, #3b82f6)'
                  : 'linear-gradient(45deg, #f59e0b, #ef4444, #ec4899, #8b5cf6)',
                padding: '2px', // ring thickness
                boxShadow: user ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden'
                }}>
                  {user ? (
                    <img src={getAvatarUrl(user.email, user.user_metadata?.avatar_url)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)' }} />
                  )}
                </div>
              </div>

              {/* Level Badge Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: user
                  ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                  : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                color: 'white',
                fontSize: '0.55rem',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.8)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.5px'
              }}>
                {user ? `LV.${getCurrentLevel().level}` : 'GUEST'}
              </div>
            </motion.div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="liquid-glass ios-btn-haptic"
              aria-label="Open menu"
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '4px', cursor: 'pointer', background: 'none', flexShrink: 0,
              }}
            >
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'white', borderRadius: '2px', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'white', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
              <span style={{ display: 'block', width: '16px', height: '2px', background: 'white', borderRadius: '2px', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
            </button>
          </div>
        </div>

        <div
          className="search-pill-container"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '100px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            transition: 'var(--transition-smooth)',
            cursor: 'text'
          }}
          onClick={() => router.push('/search')}
        >
          <Search size={18} color="rgba(255,255,255,0.6)" />
          <div style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.2px' }}>
            Search for apps & games
          </div>
        </div>
      </header>
      <HamburgerDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* iOS 26 Glass Capsule Tab Bar */}
      <div style={{ padding: '0 1rem', position: 'sticky', top: '4.5rem', zIndex: 90, marginBottom: '2rem' }}>
        <div
          className="glass-capsule no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            padding: '0.4rem',
            borderRadius: '100px',
            width: 'fit-content',
            maxWidth: '100%',
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {["For you", "Top charts", "Other devices", "Kids"].map(tab => (
            <div
              key={tab}
              className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '100px',
                position: 'relative',
                background: 'transparent',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'fit-content',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="homeTab"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 0
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span style={{
                position: 'relative',
                zIndex: 1,
                fontSize: '0.85rem',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'color 0.3s ease'
              }}>
                {tab}
              </span>
            </div>
          ))}
        </div>
      </div>

      {hasResults ? (
        <div className="animate-fade-in">
          {(() => {
            switch (activeTab) {
              case "For you":
                return (
                  <>
                    {/* Premium Hero Carousel */}
                    <AppHero apps={featuredApps} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

                      {rareFinds.length > 0 && (
                        <GamingRow title="💎 Rare Finds" games={rareFinds} seeAllHref="/categories/rare" />
                      )}

                      {editorsChoice.length > 0 && (
                        <GamingRow title="✨ Editor's Choice" games={editorsChoice} seeAllHref="/suggested" />
                      )}

                      {/* Standardized Section: Suggested */}
                      <GamingRow title="Recommended for you" games={consumerApps.slice(0, 10)} seeAllHref="/suggested" />

                      {/* Home Bento Categories */}
                      <section id="explore-categories" style={{ padding: '0 0.5rem' }}>
                        <SectionHeader
                          title="Explore Categories"
                          marginTop="0"
                          marginBottom="1.5rem"
                        />

                        <div className="bento-grid" style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gridAutoRows: '95px',
                          gap: '0.75rem',
                        }}>
                          {homeCategories.map(cat => (
                            <motion.button
                              key={cat.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => router.push(`/categories/${cat.id}`)}
                              className="liquid-glass hw-accel"
                              style={{
                                gridColumn: `span ${cat.span}`,
                                gridRow: `span ${cat.row}`,
                                background: `linear-gradient(145deg, ${cat.color}20, rgba(255,255,255,0.02))`,
                                borderRadius: '22px',
                                border: `0.5px solid rgba(255, 255, 255, 0.12)`,
                                padding: '0.9rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                position: 'relative',
                                overflow: 'hidden',
                                textAlign: 'left',
                                cursor: 'pointer',
                                boxShadow: `0 4px 20px -5px rgba(0,0,0,0.5)`,
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                              }}
                            >
                              <div style={{
                                background: `${cat.color}25`,
                                padding: '0.5rem',
                                borderRadius: '12px',
                                color: cat.color,
                                boxShadow: `0 0 20px ${cat.color}33`,
                                zIndex: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {cat.icon}
                              </div>
                              <div style={{ zIndex: 2 }}>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: '900', color: 'white', lineHeight: '1', marginBottom: '0.15rem' }}>{cat.label}</h3>
                                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '0.2px' }}>{cat.desc}</p>
                              </div>

                              <div style={{
                                position: 'absolute',
                                bottom: '-20%',
                                right: '-10%',
                                width: '60%',
                                height: '60%',
                                background: `radial-gradient(circle, ${cat.color}15 0%, transparent 70%)`,
                                zIndex: 1,
                                pointerEvents: 'none'
                              }} />
                            </motion.button>
                          ))}
                        </div>
                      </section>

                      {/* Standardized Section: Root Workshop */}
                      <GamingRow title="Root Workshop" games={moduleApps} seeAllHref="/modules" />

                      {securityApps.length > 0 && (
                        <GamingRow title="🛡️ Security & Privacy" games={securityApps} seeAllHref="/tools" />
                      )}

                      {/* Standardized Section: Trending */}
                      <GamingRow title="Trending Powerhouses" games={consumerApps.filter(a => a.trending)} seeAllHref="/trending" />

                    </div>
                  </>
                );

              case "Top charts":
                return <TopCharts />;

              case "Other devices":
                return (
                  <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                      borderRadius: '24px',
                      padding: '2rem 1.5rem',
                      marginBottom: '2rem',
                      textAlign: 'center',
                      boxShadow: '0 10px 40px -10px rgba(168, 85, 247, 0.4)'
                    }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Cross-Device Freedom</h2>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto 1.5rem auto' }}>
                        Install your favorite apps on Watch, TV, and Car.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {['Watch', 'TV', 'Car'].map(d => (
                          <button key={d} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700' }}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <GamingRow title="Wear OS Essentials" games={consumerApps.filter(a => a.category === 'Tools').slice(0, 6)} seeAllHref="/tools" />
                    <div style={{ height: '2rem' }} />
                    <GamingRow title="Android TV Must-Haves" games={consumerApps.filter(a => a.category === 'Entertainment').slice(0, 6)} seeAllHref="/categories/entertainment" />
                  </div>
                );

              case "Kids":
                return (
                  <div style={{ padding: '0 1rem', marginTop: '1rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)',
                      borderRadius: '24px',
                      padding: '2rem 1.5rem',
                      marginBottom: '2rem',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 40px -10px rgba(250, 204, 21, 0.4)'
                    }}>
                      <Sparkles size={100} color="white" style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2 }} />
                      <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Teacher Approved</h2>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
                        Safe, fun, and educational apps for growing minds.
                      </p>
                    </div>

                    <GamingRow title="Ages 5 & Under" games={appsData.filter(a => a.ageRating === '4+' || a.category === 'Education').slice(0, 6)} seeAllHref="/categories/education" />
                    <div style={{ height: '2rem' }} />
                    <GamingRow title="Ages 6-8" games={appsData.filter(a => a.category === 'Games').slice(0, 6)} seeAllHref="/games" />
                  </div>
                );

              default:
                return null;
            }
          })()}

          {/* Endless Discovery Feed at the bottom - Now using Grid */}
          {activeTab === "For you" && (
            <section style={{ marginTop: '4rem' }}>
              <GamingGrid
                title="More to discover"
                games={discoveryApps}
                limit={12}
                seeAllHref="/discover"
              />
            </section>
          )}
        </div>
      ) : (
        <section style={{
          padding: '5rem 2rem',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '32px',
          border: '1px dashed var(--glass-border)',
          margin: '2rem 1.25rem'
        }}>
          <Rocket size={48} style={{ margin: '0 auto 1.5rem auto', opacity: 0.3 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No modules found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>We couldn't find any results for "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(""); setActiveTab("For you"); }}
            style={{ marginTop: '1.5rem', color: 'var(--accent-primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear all filters
          </button>
        </section>
      )}

      {/* Community / GitHub Banner - Compact TapTap style */}
      <section style={{
        marginTop: '6rem',
        padding: '3rem',
        borderRadius: '32px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: '0.1' }}></div>
        <Rocket size={40} color="var(--accent-primary)" style={{ margin: '0 auto 1.25rem auto' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.75rem' }}>Open Source & Secure.</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          Explore the community repositories on GitHub.
        </p>
        <a href="https://github.com/imdadur765/Nexa-Store" target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2.5rem' }}>
          Browse Repositories
        </a>
      </section>

      {/* Developer CTA Section */}
      <section style={{
        marginTop: '2rem',
        padding: '2.5rem 1.5rem',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <Terminal size={32} color="#8b5cf6" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Want to Publish?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', maxWidth: '400px' }}>
          Join our developer ecosystem and get your modules in front of thousands of power users.
        </p>
        <Link href="/publish" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '0.8rem 2rem',
            borderRadius: '100px',
            background: 'white',
            color: 'black',
            border: 'none',
            fontWeight: '900',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
          }}>
            Developer Portal
          </button>
        </Link>
      </section>

    </div>
  );
}
