"use client";

import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '1rem',
    borderRadius = '8px',
    className = '',
    style = {}
}) => {
    return (
        <div
            className={`skeleton-shimmer ${className}`}
            style={{
                width,
                height,
                borderRadius,
                background: 'rgba(255, 255, 255, 0.03)',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
        >
            <style jsx>{`
                .skeleton-shimmer::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.05) 50%,
                        transparent 100%
                    );
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
};
