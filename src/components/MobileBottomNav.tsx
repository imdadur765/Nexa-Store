"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, LayoutGrid, Wrench, User, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    const updateVisibility = useCallback(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
        ticking.current = false;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                requestAnimationFrame(updateVisibility);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [updateVisibility]);

    const navItems = [
        { icon: <Gamepad2 size={24} />, label: "Games", path: "/games" },
        { icon: <LayoutGrid size={24} />, label: "Apps", path: "/apps" },
        { icon: <Home size={28} />, label: "Home", path: "/" },
        { icon: <Wrench size={24} />, label: "Tools", path: "/tools" },
        { icon: <User size={24} />, label: "Profile", path: "/profile" },
    ];

    const getIndicatorIndex = () => {
        const index = navItems.findIndex(item => item.path === pathname);
        return index !== -1 ? index : 2;
    };

    const activeIndex = getIndicatorIndex();

    return (
        <div
            className="mobile-only liquid-glass floating-pill-nav hw-accel"
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                left: '50%',
                transform: isVisible ? 'translateX(-50%)' : 'translateX(-50%) translateY(120%)',
                width: 'calc(100% - 2rem)',
                maxWidth: '400px',
                height: '72px',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 0.75rem',
                borderRadius: '36px',
                boxShadow: isVisible ? '0 30px 60px -12px rgba(0, 0, 0, 0.8)' : 'none',
                pointerEvents: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                opacity: isVisible ? 1 : 0,
                overflow: 'visible'
            }}
        >
            {/* Inner Glow Orbs */}
            <div style={{ position: 'absolute', top: '-10px', left: '20%', width: '50px', height: '50px', background: 'var(--accent-primary)', opacity: 0.1, filter: 'blur(20px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10px', right: '20%', width: '50px', height: '50px', background: '#ec4899', opacity: 0.08, filter: 'blur(20px)', borderRadius: '50%' }} />
            {/* Sliding Active Indicator */}
            <div className="nav-indicator-pill" style={{
                width: '32px',
                left: `calc(${(activeIndex * 20) + 10}% - 16px)`,
                backgroundColor: activeIndex === 2 ? 'white' : 'var(--accent-primary)',
                boxShadow: activeIndex === 2 ? '0 0 15px white' : '0 0 15px var(--accent-primary)'
            }} />

            {navItems.map((item, index) => {
                const isActive = pathname === item.path;
                const isCenter = index === 2;

                return (
                    <Link
                        key={item.label}
                        href={item.path}
                        className={`nav-item haptic-scale ${isActive ? 'active' : ''}`}
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                            width: isCenter ? '60px' : '44px',
                            height: isCenter ? '60px' : '44px',
                            background: isCenter ? 'var(--accent-primary)' : 'transparent',
                            borderRadius: '50%',
                            marginTop: isCenter ? '-34px' : '0',
                            boxShadow: isCenter ? (isActive ? '0 0 30px rgba(59, 130, 246, 0.9)' : '0 15px 32px -10px rgba(59, 130, 246, 0.6)') : 'none',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <div style={{
                            transform: isActive || isCenter ? 'scale(1.05)' : 'scale(1)',
                            color: isCenter ? 'white' : 'inherit'
                        }}>
                            {item.icon}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
