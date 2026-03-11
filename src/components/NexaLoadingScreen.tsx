"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NexaLoadingScreenProps {
  onComplete?: () => void;
}

// ── Static orbs (pure CSS, zero JS after mount) ───────────────────────────────
const StaticOrb = ({ size, x, y, color, opacity = 0.2 }: {
  size: number; x: number; y: number; color: string; opacity?: number;
}) => (
  <div
    style={{
      position: "absolute",
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      filter: `blur(${size * 0.35}px)`,
      left: `${x}%`, top: `${y}%`,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      opacity,
      willChange: "transform",
    }}
  />
);

// ── Rotating ring (pure CSS keyframes) ────────────────────────────────────────
const RotatingRing = ({ size, duration, reverse = false, color = "rgba(0,122,255,0.2)", borderWidth = "1px" }: {
  size: number; duration: number; reverse?: boolean; color?: string; borderWidth?: string;
}) => (
  <div
    style={{
      position: "absolute",
      width: size, height: size,
      borderRadius: "50%",
      border: `${borderWidth} solid ${color}`,
      borderTopColor: "#007aff",
      borderBottomColor: "#007aff80",
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      animation: `${reverse ? "spinCCW" : "spinCW"} ${duration}s linear infinite`,
      willChange: "transform",
      pointerEvents: "none",
      boxShadow: "0 0 20px rgba(0,122,255,0.1)",
    }}
  />
);

// ── Glass card (optimized blur) ───────────────────────────────────────────────
const GlassCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "rgba(10,10,15,0.4)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderRadius: "40px",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
      padding: "36px 32px",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "28px",
    }}
  >
    {children}
  </div>
);

// ── Logo with rings and "STORE" tagline ───────────────────────────────────────
const NexaStoreLogo = () => (
  <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Outer decorative rings */}
    <RotatingRing size={160} duration={24} color="rgba(0,122,255,0.1)" borderWidth="1.5px" />
    <RotatingRing size={130} duration={16} reverse={true} color="rgba(0,122,255,0.2)" borderWidth="1px" />
    <RotatingRing size={100} duration={10} color="rgba(0,122,255,0.3)" borderWidth="0.5px" />
    
    {/* Core glow */}
    <div
      style={{
        position: "absolute",
        width: "80px", height: "80px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, #007aff, transparent 80%)",
        filter: "blur(18px)",
        opacity: 0.5,
      }}
    />
    
    {/* Text container */}
    <div style={{ textAlign: "center", zIndex: 2 }}>
      <span
        style={{
          fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif",
          fontSize: "1.7rem",
          fontWeight: 700,
          color: "rgba(255, 255, 255, 0.74)",
          textShadow: "0 0 30px #007aff, 0 0 60px rgba(0,122,255,0.3)",
          letterSpacing: "0.08em",
          lineHeight: 1,
          display: "block",
        }}
      >
        NEXA
      </span>
      <span
        style={{
          fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.5)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          display: "block",
          marginTop: "4px",
        }}
      >
        STORE
      </span>
    </div>
  </div>
);

// ── Individual progress bar item (CHHOTA KIYA) ─────────────────────────────────
const ProgressItem = ({ label, progress, isActive }: { label: string; progress: number; isActive: boolean }) => (
  <div style={{ width: "180px", marginBottom: "8px" }}> {/* Pehle 240px tha, ab 180px */}
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      marginBottom: "3px", 
      fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif", 
      fontSize: "0.65rem", /* Thoda chhota font */
      color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" 
    }}>
      <span>{label}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div style={{ 
      width: "100%", 
      height: "2.5px", /* Thoda patla (3px se 2.5px) */
      background: "rgba(255,255,255,0.03)", 
      borderRadius: "6px", 
      overflow: "hidden", 
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" 
    }}>
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, #007aff, #60a5fa, #007aff)",
          borderRadius: "6px",
          boxShadow: "0 0 10px #007aff",
          willChange: "width",
        }}
      />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export const NexaLoadingScreen = ({ onComplete }: NexaLoadingScreenProps) => {
  const [phase, setPhase] = useState<"intro" | "loading" | "exit" | "done">("intro");
  const [activeBarIndex, setActiveBarIndex] = useState(0);
  const [barProgress, setBarProgress] = useState([0, 0, 0, 0, 0]);

  const barLabels = [
    "System Core",
    "Asset Library",
    "Security Protocol", 
    "User Interface",
    "Ready to Launch"
  ];

  // ── Keyframes inject for ring rotation ───────────────────────────────────────
  useEffect(() => {
    // Check if keyframes already exist
    if (!document.getElementById("nexa-ring-keyframes")) {
      const style = document.createElement("style");
      style.id = "nexa-ring-keyframes";
      style.innerHTML = `
        @keyframes spinCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spinCCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById("nexa-ring-keyframes");
      if (style) document.head.removeChild(style);
    };
  }, []);

  // ── Loading sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setPhase("loading"), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;

    let currentBar = 0;
    const barDuration = 500; // ms per bar

    const fillBar = () => {
      if (currentBar < barLabels.length) {
        setActiveBarIndex(currentBar);
        
        const barStart = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - barStart;
          const progress = Math.min(100, (elapsed / barDuration) * 100);
          
          setBarProgress(prev => {
            const newProgress = [...prev];
            newProgress[currentBar] = progress;
            return newProgress;
          });

          if (progress >= 100) {
            clearInterval(interval);
            currentBar++;
            if (currentBar < barLabels.length) {
              fillBar();
            } else {
              // All bars complete
              setTimeout(() => {
                setPhase("exit");
                setTimeout(() => {
                  setPhase("done");
                  onComplete?.();
                }, 600);
              }, 200);
            }
          }
        }, 16);
      }
    };

    const start = setTimeout(fillBar, 200);
    return () => clearTimeout(start);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="nexa-store-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            overflow: "hidden",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {/* Ambient blue glow overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 50%, #007aff10 0%, transparent 80%)",
              pointerEvents: "none",
            }}
          />

          {/* Static ambient orbs */}
          <StaticOrb size={350} x={15} y={25} color="radial-gradient(circle, #007aff15, transparent)" opacity={0.15} />
          <StaticOrb size={300} x={85} y={75} color="radial-gradient(circle, #60a5fa10, transparent)" opacity={0.1} />
          <StaticOrb size={250} x={45} y={15} color="radial-gradient(circle, #007aff10, transparent)" opacity={0.1} />

          {/* Main glass card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 10 }}
          >
            <GlassCard>
              <NexaStoreLogo />

              {/* Multiple Progress Bars - ab chhoti width mein */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px" }}>
                {barLabels.map((label, index) => (
                  <ProgressItem 
                    key={index}
                    label={label}
                    progress={barProgress[index]}
                    isActive={index === activeBarIndex}
                  />
                ))}
              </div>

              {/* Status message */}
              <div style={{ 
                marginTop: "12px", 
                fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif", 
                fontSize: "0.65rem", 
                color: "rgba(255,255,255,0.4)", 
                letterSpacing: "0.1em" 
              }}>
                {activeBarIndex === barLabels.length - 1 ? "Launching..." : "Initializing..."}
              </div>
            </GlassCard>
          </motion.div>

          {/* Footer branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              position: "absolute",
              bottom: "1.8rem",
              fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
              fontSize: "0.55rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            ✦ nexastore.com ✦
          </motion.div>

          {/* Safe area indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "0.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "3px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "99px",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NexaLoadingScreen;