"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LazyRowProps {
    children: React.ReactNode;
    height?: string;
    rootMargin?: string;
}

export default function LazyRow({ children, height = '300px', rootMargin = '300px' }: LazyRowProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Once visible, keep it rendered
                }
            },
            { rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={containerRef} style={{ minHeight: isVisible ? 'auto' : height }}>
            {isVisible ? children : (
                <div style={{ 
                    width: '100%', 
                    height, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    padding: '0 1.25rem'
                }}>
                   {/* Minimal skeleton to preserve space */}
                   <div style={{ height: '30px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                   <div style={{ height: '200px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }} />
                </div>
            )}
        </div>
    );
}
