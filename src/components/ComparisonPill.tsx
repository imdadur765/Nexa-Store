"use client";

import React from 'react';
import { useComparison } from '@/context/ComparisonContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const ComparisonPill = () => {
    const { comparisonQueue, removeFromCompare, clearCompare } = useComparison();

    if (comparisonQueue.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="ios-container shadow-premium"
                style={{
                    position: 'fixed',
                    bottom: '90px', // Above mobile nav
                    left: '1.25rem',
                    right: '1.25rem',
                    zIndex: 2000,
                    background: 'rgba(15, 15, 15, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ position: 'relative', display: 'flex' }}>
                        {comparisonQueue.map((app, i) => (
                            <motion.div
                                key={app.id}
                                layout
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(15, 15, 15, 1)',
                                    marginLeft: i === 0 ? 0 : '-12px',
                                    zIndex: 10 - i,
                                    background: 'var(--bg-secondary)'
                                }}
                            >
                                <img src={app.iconUrl || app.icon_url_external} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCompare(app.id); }}
                                    style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '14px',
                                        height: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '8px',
                                        zIndex: 20
                                    }}
                                >
                                    <X size={8} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>
                            {comparisonQueue.length === 1 ? 'Select another tool' : 'Ready for battle'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {comparisonQueue.map(a => a.name).join(' vs ')}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link 
                        href={`/compare?a=${comparisonQueue[0]?.id}${comparisonQueue[1] ? `&b=${comparisonQueue[1].id}` : ''}`}
                        className="ios-btn-haptic"
                        style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            opacity: comparisonQueue.length < 2 ? 0.6 : 1,
                            pointerEvents: comparisonQueue.length < 2 ? 'none' : 'auto'
                        }}
                    >
                        {comparisonQueue.length < 2 ? 'Compare' : 'Go Battle'}
                        <ChevronRight size={14} />
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
