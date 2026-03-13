"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MidnightNebula() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -2,
            background: '#05050a',
            overflow: 'hidden',
            pointerEvents: 'none'
        }}>
            {/* Base Gradient Layer */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 120%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
                opacity: 0.6
            }} />

            {/* Floating Orbs */}
            <NebulaOrb color="rgba(59, 130, 246, 0.15)" size="40vw" top="-10%" left="-10%" delay={0} duration={25} />
            <NebulaOrb color="rgba(139, 92, 246, 0.12)" size="35vw" bottom="10%" right="-5%" delay={5} duration={30} />
            <NebulaOrb color="rgba(236, 72, 153, 0.08)" size="25vw" top="30%" left="60%" delay={10} duration={20} />
            <NebulaOrb color="rgba(16, 185, 129, 0.05)" size="30vw" bottom="-5%" left="20%" delay={2} duration={35} />

            {/* Subtle Noise Texture Overlay (Optional but premium) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.015,
                mixBlendMode: 'overlay'
            }} />
        </div>
    );
}

function NebulaOrb({ color, size, top, left, right, bottom, delay, duration }: any) {
    return (
        <motion.div
            animate={{
                x: [0, 40, -40, 0],
                y: [0, -40, 40, 0],
                scale: [1, 1.1, 0.9, 1],
                opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            style={{
                position: 'absolute',
                top, left, right, bottom,
                width: size,
                height: size,
                borderRadius: '50%',
                background: color,
                filter: 'blur(100px)',
                zIndex: -1
            }}
        />
    );
}
