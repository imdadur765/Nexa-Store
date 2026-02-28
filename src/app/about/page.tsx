"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/profile?tab=nexus");
    }, [router]);
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
