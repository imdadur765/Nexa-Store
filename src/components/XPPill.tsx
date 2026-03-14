"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface XPPillProps {
  points: number;
  onClick: () => void;
}

export const XPPill = memo(({ points: livePoints, onClick }: XPPillProps) => {
  const [displayPoints, setDisplayPoints] = useState(livePoints);
  const animRaf = useRef<number | null>(null);
  const prevTarget = useRef(livePoints);

  useEffect(() => {
    if (prevTarget.current === livePoints) return;
    prevTarget.current = livePoints;
    
    if (animRaf.current) cancelAnimationFrame(animRaf.current);

    const from = displayPoints;
    const to = livePoints;
    const duration = 2000;
    let t0: number | null = null;

    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplayPoints(Math.floor(from + ease * (to - from)));
      
      if (p < 1) {
        animRaf.current = requestAnimationFrame(tick);
      } else {
        setDisplayPoints(to);
        animRaf.current = null;
      }
    };

    animRaf.current = requestAnimationFrame(tick);
    return () => {
      if (animRaf.current) cancelAnimationFrame(animRaf.current);
    };
  }, [livePoints, displayPoints]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))",
        padding: "0.35rem 0.8rem",
        borderRadius: "100px",
        fontSize: "0.8rem",
        fontWeight: "900",
        color: "#f59e0b",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        boxShadow: "0 0 10px rgba(245, 158, 11, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        cursor: "pointer",
      }}
    >
      <Sparkles
        size={14}
        color="#f59e0b"
        style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.5))" }}
      />
      <span style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.5px" }}>
        {displayPoints.toLocaleString()} XP
      </span>
    </motion.div>
  );
});

XPPill.displayName = "XPPill";
