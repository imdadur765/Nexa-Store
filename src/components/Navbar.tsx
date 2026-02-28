"use client";

import Link from "next/link";
import { Search, Download, Github } from "lucide-react";
import { useState } from "react";
import HamburgerDrawer from './HamburgerDrawer'; // Assuming HamburgerDrawer is in the same directory

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="liquid-glass" style={{
                position: 'sticky',
                top: '0',
                margin: '0',
                padding: '2.5rem 1.5rem 0.75rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                borderRadius: '0 0 32px 32px',
                borderTop: 'none',
                overflow: 'hidden'
            }}>
                {/* Immersive Background Orbs (iOS 26) */}
                <div style={{ position: 'absolute', top: '-20px', left: '10%', width: '120px', height: '120px', background: 'var(--accent-primary)', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20px', right: '15%', width: '100px', height: '100px', background: '#ec4899', opacity: 0.1, filter: 'blur(35px)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Download size={20} color="white" />
                        </div>
                        <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Nexa Store
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }} className="desktop-only">
                        <Link href="/apps" style={{ color: 'var(--text-secondary)' }}>Apps</Link>
                        <Link href="/modules" style={{ color: 'var(--text-secondary)' }}>Modules</Link>
                        <Link href="/rare" style={{ color: 'var(--text-secondary)' }}>Rare</Link>
                        <Link href="/about" style={{ display: 'none' }}>Hidden</Link>
                        <Link href="/profile?tab=nexus" style={{ color: 'var(--text-secondary)' }}>About</Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)'
                    }} className="desktop-only">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search premium apps..."
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                outline: 'none',
                                width: '150px'
                            }}
                        />
                    </div>

                    <Link href="https://github.com/imdadur765/Nexa-Store" target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Github size={18} />
                        <span className="desktop-only">Github</span>
                    </Link>

                    {/* Morphing Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="liquid-glass ios-btn-haptic"
                        aria-label="Open menu"
                        style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            gap: '5px', cursor: 'pointer', background: 'none',
                        }}
                    >
                        <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px', transform: isMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
                        <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px', opacity: isMenuOpen ? 0 : 1, transition: 'all 0.3s' }} />
                        <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px', transform: isMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
                    </button>
                </div>
            </nav>
            <HamburgerDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
