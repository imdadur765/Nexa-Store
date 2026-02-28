"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
    accentColor: string;
    ambientColor: string;
    setAccentColor: (color: string) => void;
    setAmbientColor: (color: string) => void;
    setTheme: (accent: string, ambient?: string) => void;
    resetAccent: () => void;
};

const defaultAccent = 'linear-gradient(135deg, #007AFF, #5856D6)';
const defaultAmbient = 'rgba(0, 122, 255, 0.15)';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState(defaultAccent);
    const [ambientColor, setAmbientColor] = useState(defaultAmbient);

    useEffect(() => {
        document.documentElement.style.setProperty('--dynamic-accent', accentColor);
        document.documentElement.style.setProperty('--dynamic-ambient-aura', ambientColor);

        // Extract a glow color
        if (accentColor.includes('#')) {
            const hex = accentColor.match(/#[a-fA-F0-9]{6}/)?.[0] || '#007AFF';
            document.documentElement.style.setProperty('--dynamic-accent-glow', `${hex}80`);
        } else {
            document.documentElement.style.setProperty('--dynamic-accent-glow', 'rgba(0, 122, 255, 0.4)');
        }
    }, [accentColor, ambientColor]);

    const setTheme = (accent: string, ambient?: string) => {
        setAccentColor(accent);
        if (ambient) setAmbientColor(ambient);
        else {
            // Auto-calculate ambient from accent hex if possible
            const hex = accent.match(/#[a-fA-F0-9]{6}/)?.[0];
            if (hex) setAmbientColor(`${hex}26`); // ~15% opacity hex
        }
    };

    const resetAccent = () => {
        setAccentColor(defaultAccent);
        setAmbientColor(defaultAmbient);
    };

    return (
        <ThemeContext.Provider value={{
            accentColor,
            ambientColor,
            setAccentColor,
            setAmbientColor,
            setTheme,
            resetAccent
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
