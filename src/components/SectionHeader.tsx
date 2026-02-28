"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    seeAllHref?: string;
    marginTop?: string;
    marginBottom?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    seeAllHref,
    marginTop = "2rem",
    marginBottom = "1.5rem"
}) => {
    return (
        <div style={{ marginTop, marginBottom, padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {seeAllHref && (
                    <Link
                        href={seeAllHref}
                        className="ios-btn-haptic ultra-glass"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--accent-primary)',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            textDecoration: 'none',
                            background: 'rgba(0, 122, 255, 0.08)',
                            border: '1px solid rgba(0, 122, 255, 0.15)',
                            padding: '0.4rem 1rem',
                            borderRadius: '100px',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.1)',
                            transition: 'var(--transition-smooth)'
                        }}
                    >
                        See all <ChevronRight size={14} strokeWidth={3} />
                    </Link>
                )}
            </div>
            {!subtitle && <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginTop: '0.75rem', width: '100%' }} />}
        </div>
    );
};
