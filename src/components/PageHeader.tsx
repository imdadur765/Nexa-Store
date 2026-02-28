"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Search, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    icon?: React.ReactNode;
    showSearch?: boolean;
    searchHref?: string;
    searchPlaceholder?: string;
    showBackButton?: boolean;
    backText?: string;
    accentColor?: string;
    rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    icon,
    showSearch = false,
    searchHref = "/search",
    searchPlaceholder = "Search for apps & games",
    showBackButton = true,
    backText = "Store",
    accentColor = "var(--accent-primary)",
    rightElement
}) => {
    const router = useRouter();

    return (
        <div
            className="liquid-glass hw-accel"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(5, 5, 5, 0.7)',
                margin: '0 -0.75rem 2rem -0.75rem',
                padding: '1rem 0.75rem',
                borderRadius: '0 0 24px 24px'
            }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: showSearch ? '1rem' : '0'
            }}>
                {showBackButton ? (
                    <button
                        onClick={() => router.back()}
                        className="liquid-glass ios-btn-haptic"
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            color: 'white',
                            cursor: 'pointer',
                            background: 'none'
                        }}
                    >
                        <ArrowLeft size={16} />
                        <ShoppingBag size={18} /> {backText}
                    </button>
                ) : <div />}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {rightElement}
                    <div className="liquid-glass" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: 'white'
                    }}>
                        {icon} {title}
                    </div>
                </div>
            </div>

            {showSearch && (
                <Link
                    href={searchHref}
                    className="search-pill-container liquid-glass"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '100px',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                        transition: 'var(--transition-smooth)',
                        cursor: 'text',
                        textDecoration: 'none'
                    }}
                >
                    <Search size={18} color="rgba(255,255,255,0.6)" />
                    <div style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.2px' }}>
                        {searchPlaceholder}
                    </div>
                </Link>
            )}
        </div>
    );
};
