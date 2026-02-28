"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface InfoPageHeaderProps {
    /** If provided, Back goes here. Otherwise history.back() or fallback to '/' */
    fallbackHref?: string;
}

export function InfoPageHeader({ fallbackHref = "/" }: InfoPageHeaderProps) {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // If there's history to go back to, flag it
        setCanGoBack(window.history.length > 1);
    }, []);

    const handleBack = () => {
        if (canGoBack) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <header
            className="liquid-glass hw-accel"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                padding: "1rem 1.25rem",
                borderRadius: "0 0 24px 24px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "space-between",
            }}
        >
            <button
                onClick={handleBack}
                className="liquid-glass ios-btn-haptic"
                style={{
                    padding: "0.55rem 1.1rem",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    color: "white",
                    background: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
            >
                <ArrowLeft size={15} />
                Back
            </button>

            <button
                onClick={() => router.push("/")}
                className="liquid-glass ios-btn-haptic"
                style={{
                    padding: "0.55rem 1.1rem",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    background: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
            >
                <Home size={14} />
                Home
            </button>
        </header>
    );
}
