"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const categories = ["All", "Tools", "Games", "Modules", "Rare", "Social", "Finance", "Productivity"];

interface CategoryChipsProps {
    activeCategory?: string;
    onCategoryChange?: (category: string) => void;
}

export default function CategoryChips({ activeCategory = "All", onCategoryChange }: CategoryChipsProps) {
    const { setAccentColor } = useTheme();

    const handleCategoryClick = (cat: string) => {
        if (onCategoryChange) onCategoryChange(cat);

        // Simple dynamic shifting for fun
        const hues = [210, 260, 40, 160, 340, 190, 10, 120];
        const randomHue = hues[Math.floor(Math.random() * hues.length)];
        setAccentColor(`linear-gradient(135deg, hsl(${randomHue}, 80%, 60%), hsl(${randomHue + 40}, 80%, 40%))`);
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            padding: '1rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }} className="no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={activeCategory === cat ? "active-chip btn-haptic" : "glass btn-haptic"}
                    style={{
                        padding: '0.8rem 2rem',
                        whiteSpace: 'nowrap',
                        fontSize: '1rem',
                        fontWeight: '800',
                        borderRadius: '100px',
                        border: activeCategory === cat ? 'none' : '1px solid var(--glass-border)',
                        transition: 'var(--transition-smooth)',
                        background: activeCategory === cat ? 'var(--dynamic-accent)' : 'var(--glass-bg)',
                        color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                        boxShadow: activeCategory === cat ? '0 10px 30px var(--dynamic-accent-glow)' : 'none',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
