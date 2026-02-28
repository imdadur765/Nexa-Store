"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Layout,
    ArrowLeft,
    Rocket,
    Terminal,
    Image as ImageIcon,
    CheckCircle2,
    Monitor,
    Smartphone,
    Lock,
    ArrowRight,
    Upload,
    Loader2,
    ExternalLink,
    Wand2,
    Sparkles,
    Trash2,
    Plus,
    History
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type Step = 'identity' | 'technical' | 'assets' | 'review';

export default function PublishPage() {
    const [step, setStep] = useState<Step>('identity');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tools',
        isGame: false,
        version: '',
        minSdk: '24',
        changelog: '',
        downloadUrl: '',
        // Technical Info
        package_name: '',
        sha256: '',
        certificate_signature: '',
        min_android_version: '6.0+',
        permissions: '',
        languages: 'English',
        // External Assets
        icon_url_external: '',
        screenshot1_external: '',
        screenshot2_external: '',
        screenshot3_external: '',
        screenshot4_external: '',
        older_versions: [] as { version: string; date: string; url: string; android: string; type: string }[]
    });

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

    const steps = [
        { id: 'identity', label: 'Identity', icon: <Layout size={16} /> },
        { id: 'technical', label: 'Technical', icon: <Terminal size={16} /> },
        { id: 'assets', label: 'Assets', icon: <ImageIcon size={16} /> },
        { id: 'review', label: 'Review', icon: <CheckCircle2 size={16} /> }
    ] as const;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIconFile(e.target.files[0]);
            setIconPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setScreenshotFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setScreenshotPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('nexa-assets')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('nexa-assets').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const resolveExternalUrl = async (url: string, fieldName: keyof typeof formData) => {
        if (!url || !url.startsWith('http')) return;
        try {
            const res = await fetch(`/api/resolve-image?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.imageUrl) {
                setFormData(prev => ({ ...prev, [fieldName]: data.imageUrl }));
            }
        } catch (err) {
            console.error("Resolution failed", err);
        }
    };

    const addOlderVersion = () => {
        setFormData(prev => ({
            ...prev,
            older_versions: [
                ...prev.older_versions,
                { version: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), url: '', android: '6.0+', type: 'APK' }
            ]
        }));
    };

    const removeOlderVersion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            older_versions: prev.older_versions.filter((_, i) => i !== index)
        }));
    };

    const updateOlderVersion = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            older_versions: prev.older_versions.map((ver, i) => i === index ? { ...ver, [field]: value } : ver)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (!user) return;
        setLoading(true);
        try {
            let iconUrl = formData.icon_url_external;
            if (!iconUrl && iconFile) {
                iconUrl = await uploadImage(iconFile);
            }

            let screenshotUrls: string[] = [
                formData.screenshot1_external,
                formData.screenshot2_external,
                formData.screenshot3_external,
                formData.screenshot4_external
            ].filter(url => url.trim().length > 0);

            if (screenshotUrls.length === 0) {
                for (const file of screenshotFiles) {
                    const url = await uploadImage(file);
                    screenshotUrls.push(url);
                }
            }

            const { error } = await supabase
                .from('apps')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    version: formData.version,
                    developer: user.user_metadata?.name || user.email?.split('@')[0] || 'Nexa Expert',
                    icon_url: iconUrl,
                    screenshots: screenshotUrls,
                    whats_new: formData.changelog,
                    is_game: formData.isGame,
                    download_url: formData.downloadUrl,
                    status: 'pending',
                    older_versions: formData.older_versions,
                    age_rating: '4+',
                    package_size: 'Varies',
                    downloads: '0',
                    platforms: ['Android'],
                    rating: 5.0,
                    // Technical Info
                    package_name: formData.package_name,
                    sha256: formData.sha256,
                    certificate_signature: formData.certificate_signature,
                    min_android_version: formData.min_android_version,
                    permissions: formData.permissions ? formData.permissions.split(',').map(s => s.trim()) : [],
                    languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : ['English']
                }]);

            if (error) throw error;

            alert('🚀 Submission Successful! Your app is now live on Nexa Network.');
            router.push('/profile');
        } catch (err: any) {
            console.error('Submission error full object:', err);
            const errorMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
            alert('❌ Submission Failed: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            padding: '0.75rem',
            paddingBottom: '2rem',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            <PageHeader
                title="Publishing Portal"
                icon={<Rocket size={18} color="var(--accent-primary)" />}
            />

            {user ? (
                <>
                    {/* Progress Stepper */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        maxWidth: '600px',
                        margin: '0 auto 1.5rem',
                        position: 'relative'
                    }}>
                        {steps.map((s, idx) => {
                            const isActive = step === s.id;
                            const isCompleted = steps.findIndex(x => x.id === step) > idx;

                            return (
                                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: isActive ? 'var(--accent-primary)' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isActive || isCompleted ? 'white' : 'rgba(255,255,255,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}>
                                        {isCompleted ? <CheckCircle2 size={18} /> : s.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '0.6rem',
                                        fontWeight: '900',
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.3)',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {s.label.toUpperCase()}
                                    </span>
                                </div>
                            );
                        })}
                        {/* Connector Lines */}
                        <div style={{
                            position: 'absolute',
                            top: '30px',
                            left: '15%',
                            right: '15%',
                            height: '2px',
                            background: 'rgba(255,255,255,0.05)',
                            zIndex: 0
                        }} />
                    </div>

                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <AnimatePresence mode="wait">
                            {step === 'identity' && (
                                <motion.div
                                    key="identity"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="ultra-glass"
                                    style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.25rem' }}>Basic Identity</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Tell us about your masterpiece.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>APP NAME</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Nexa Optimizer"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>DESCRIPTION</label>
                                            <textarea
                                                placeholder="Describe your app..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none', minHeight: '80px', resize: 'none' }}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>CATEGORY</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                >
                                                    <option>Tools</option>
                                                    <option>Productivity</option>
                                                    <option>Games</option>
                                                    <option>Modules</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>TYPE</label>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button
                                                        onClick={() => setFormData({ ...formData, isGame: false })}
                                                        style={{ flex: 1, padding: '0.4rem', borderRadius: '10px', background: !formData.isGame ? 'rgba(57, 220, 132, 0.1)' : 'rgba(255,255,255,0.03)', border: !formData.isGame ? '1px solid #3ddc84' : '1px solid rgba(255,255,255,0.1)', color: !formData.isGame ? '#3ddc84' : 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: '900' }}
                                                    >
                                                        APP
                                                    </button>
                                                    <button
                                                        onClick={() => setFormData({ ...formData, isGame: true })}
                                                        style={{ flex: 1, padding: '0.4rem', borderRadius: '10px', background: formData.isGame ? 'rgba(57, 220, 132, 0.1)' : 'rgba(255,255,255,0.03)', border: formData.isGame ? '1px solid #3ddc84' : '1px solid rgba(255,255,255,0.1)', color: formData.isGame ? '#3ddc84' : 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: '900' }}
                                                    >
                                                        GAME
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep('technical')}
                                        disabled={!formData.name || !formData.description}
                                        style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', borderRadius: '16px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (!formData.name || !formData.description) ? 0.5 : 1 }}
                                    >
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 'technical' && (
                                <motion.div
                                    key="technical"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="ultra-glass"
                                    style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.25rem' }}>Technical Specs</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Hardware & versioning.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>VERSION</label>
                                                <input
                                                    type="text"
                                                    placeholder="1.0.0"
                                                    value={formData.version}
                                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>PACKAGE NAME</label>
                                                <input
                                                    type="text"
                                                    placeholder="com.example.app"
                                                    value={formData.package_name}
                                                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>MIN ANDROID</label>
                                                <input
                                                    type="text"
                                                    placeholder="6.0+"
                                                    value={formData.min_android_version}
                                                    onChange={(e) => setFormData({ ...formData, min_android_version: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>SHA256 HASH</label>
                                                <input
                                                    type="text"
                                                    placeholder="0123...89ab"
                                                    value={formData.sha256}
                                                    onChange={(e) => setFormData({ ...formData, sha256: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>CERTIFICATE SIG</label>
                                                <input
                                                    type="text"
                                                    placeholder="A1:B2..."
                                                    value={formData.certificate_signature}
                                                    onChange={(e) => setFormData({ ...formData, certificate_signature: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>LANGUAGES</label>
                                                <input
                                                    type="text"
                                                    placeholder="English, Spanish"
                                                    value={formData.languages}
                                                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                                    style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>PERMISSIONS (COMMA SEPARATED)</label>
                                            <input
                                                type="text"
                                                placeholder="Storage, Camera, Internet"
                                                value={formData.permissions}
                                                onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                                                style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>DOWNLOAD URL (e.g. GitHub Direct Link)</label>
                                            <input
                                                type="url"
                                                placeholder="https://github.com/.../release.apk"
                                                value={formData.downloadUrl}
                                                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                                                style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem', marginLeft: '0.4rem' }}>CHANGELOG</label>
                                            <textarea
                                                placeholder="Initial release..."
                                                value={formData.changelog}
                                                onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                                                style={{ width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', outline: 'none', minHeight: '80px', resize: 'none' }}
                                            />
                                        </div>

                                        {/* ── Older Versions (Management) ── */}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <History size={16} color="var(--accent-primary)" />
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Version History</span>
                                                </div>
                                                <button type="button" onClick={addOlderVersion}
                                                    style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '6px 12px', borderRadius: '10px', color: '#3b82f6', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Plus size={12} /> Add
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {formData.older_versions.map((ver, idx) => (
                                                    <div key={idx} style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', position: 'relative' }}>
                                                        <button type="button" onClick={() => removeOlderVersion(idx)}
                                                            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '4px', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <Trash2 size={12} color="#ef4444" />
                                                        </button>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                            <input type="text" value={ver.version} onChange={(e) => updateOlderVersion(idx, 'version', e.target.value)} placeholder="Tag (e.g. v0.9)"
                                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem', outline: 'none' }} />
                                                            <input type="text" value={ver.date} onChange={(e) => updateOlderVersion(idx, 'date', e.target.value)} placeholder="Date"
                                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem', outline: 'none' }} />
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                            <input type="text" value={ver.android} onChange={(e) => updateOlderVersion(idx, 'android', e.target.value)} placeholder="Min Android"
                                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem', outline: 'none' }} />
                                                            <input type="text" value={ver.type} onChange={(e) => updateOlderVersion(idx, 'type', e.target.value)} placeholder="Type (APK)"
                                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem', outline: 'none' }} />
                                                        </div>
                                                        <input type="url" value={ver.url} onChange={(e) => updateOlderVersion(idx, 'url', e.target.value)} placeholder="Download Link (GitHub release, etc.)"
                                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '10px', color: 'var(--accent-primary)', fontSize: '0.75rem', outline: 'none' }} />
                                                    </div>
                                                ))}
                                                {formData.older_versions.length === 0 && (
                                                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', padding: '1rem', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                                                        No older versions listed.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setStep('identity')}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.05)', fontWeight: '900' }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep('assets')}
                                            style={{ flex: 2, padding: '1rem', borderRadius: '16px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '900' }}
                                        >
                                            Next: Assets
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'assets' && (
                                <motion.div
                                    key="assets"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="ultra-glass"
                                    style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.25rem' }}>Assets</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Visual identity.</p>
                                    </div>

                                    {/* Icon Section */}
                                    <div style={{
                                        border: '1.5px dashed rgba(255,255,255,0.08)',
                                        borderRadius: '24px',
                                        padding: '1.25rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        background: 'rgba(255,255,255,0.01)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {formData.icon_url_external ? (
                                                <img src={formData.icon_url_external} alt="Icon Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=Error')} />
                                            ) : iconPreview ? (
                                                <img src={iconPreview} alt="Icon Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={28} color="rgba(255,255,255,0.15)" />
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '900' }}>App Icon</div>
                                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>512x512 PNG</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                            <label style={{ flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer' }}>
                                                Upload File
                                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                        <div style={{ width: '100%', marginTop: '0.25rem' }}>
                                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>OR DIRECT ICON URL (RESOLVABLE)</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="url"
                                                    placeholder="Paste Pinterest/Link here..."
                                                    value={formData.icon_url_external}
                                                    onChange={(e) => setFormData({ ...formData, icon_url_external: e.target.value })}
                                                    style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.8rem', outline: 'none' }}
                                                />
                                                {(formData.icon_url_external.includes('pinterest.com') || formData.icon_url_external.includes('pin.it')) && (
                                                    <button type="button" onClick={() => resolveExternalUrl(formData.icon_url_external, 'icon_url_external')}
                                                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Wand2 size={16} color="#3b82f6" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Screenshots Section */}
                                    <div style={{ border: '1.5px dashed rgba(255,255,255,0.08)', borderRadius: '24px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '900' }}>Visual Screenshots</div>
                                            <label style={{ padding: '0.4rem 0.8rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer' }}>
                                                Upload
                                                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>

                                        {screenshotPreviews.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                                                {screenshotPreviews.map((src, i) => (
                                                    <div key={i} style={{ minWidth: '80px', height: '140px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>OR: DIRECT SCREENSHOT URLS (4 SLOTS)</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                {[1, 2, 3, 4].map((num) => {
                                                    const fieldName = `screenshot${num}_external` as keyof typeof formData;
                                                    // @ts-ignore
                                                    const val = formData[fieldName];
                                                    return (
                                                        <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                            <div style={{ position: 'relative' }}>
                                                                <input
                                                                    type="text"
                                                                    name={fieldName}
                                                                    value={typeof val === 'string' ? val : ''}
                                                                    onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                                                                    placeholder={`URL ${num}`}
                                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem', paddingRight: '2rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem', outline: 'none' }}
                                                                />
                                                                {(val && typeof val === 'string' && (val.includes('pinterest.com') || val.includes('pin.it'))) && (
                                                                    <button type="button" onClick={() => resolveExternalUrl(val, fieldName)}
                                                                        style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                                        <Wand2 size={12} color="#3b82f6" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {typeof val === 'string' && val && (
                                                                <div style={{ width: '100%', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                                                    <img src={val} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80?text=Invalid')} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        border: '1.5px dashed rgba(255,255,255,0.08)',
                                        borderRadius: '24px',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: 'rgba(255,255,255,0.01)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', maxWidth: '100%', padding: '0.5rem' }} className="no-scrollbar">
                                            <label style={{ minWidth: '60px', height: '80px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <Upload size={20} color="rgba(255,255,255,0.2)" />
                                                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} style={{ display: 'none' }} />
                                            </label>
                                            {screenshotPreviews.map((src, idx) => (
                                                <div key={idx} style={{ minWidth: '60px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)' }}>SCREENSHOTS</div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setStep('technical')}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.05)', fontWeight: '900' }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep('review')}
                                            style={{ flex: 2, padding: '1rem', borderRadius: '16px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '900' }}
                                        >
                                            Final Review
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'review' && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="ultra-glass"
                                    style={{ padding: '2rem', borderRadius: '40px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 5, 5, 0.8))', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                >
                                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                            <CheckCircle2 size={28} color="#10b981" />
                                        </div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.25rem' }}>Ready!</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Review and submit.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                        {[
                                            { label: 'Name', value: formData.name },
                                            { label: 'Category', value: formData.category },
                                            { label: 'Version', value: formData.version || '1.0.0' },
                                            { label: 'Icon', value: formData.icon_url_external || (iconFile ? 'Uploaded File' : 'Not Set') },
                                            { label: 'Screenshots', value: (formData.screenshot1_external || formData.screenshot2_external || formData.screenshot3_external || formData.screenshot4_external) ? 'External URLs' : (screenshotFiles.length > 0 ? `${screenshotFiles.length} Files` : 'Not Set') },
                                            { label: 'Link', value: formData.downloadUrl ? 'Direct Asset' : 'Not Provided' },
                                        ].map(item => (
                                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)' }}>{item.label.toUpperCase()}</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={loading}
                                            onClick={() => setStep('assets')}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid rgba(255,255,255,0.05)', fontWeight: '900' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            disabled={loading}
                                            onClick={handleSubmit}
                                            style={{ flex: 2, padding: '1rem', borderRadius: '16px', background: '#10b981', color: 'white', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            {loading ? <Loader2 size={18} className="spin" /> : 'Publish Now'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
                    <AuthRequiredUI message="Want to publish your own tweaks? Join our developer circle." />
                </div>
            )
            }

            {/* Background Orbs */}
            <div style={{
                position: 'fixed', top: '-10%', left: '-10%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
                filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none'
            }} />

            <style jsx>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div >
    );
}

function AuthRequiredUI({ message }: { message: string }) {
    return (
        <div style={{
            padding: '3rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
            borderRadius: '28px', border: '1px dashed rgba(255,255,255,0.1)'
        }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Lock size={32} color="var(--accent-primary)" opacity={0.6} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Authentication Required</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{message}</p>
            <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'white', color: 'black', border: 'none', padding: '0.75rem 2rem', borderRadius: '100px', fontWeight: '900', fontSize: '0.9rem' }}>
                    Sign In
                </button>
            </Link>
        </div>
    );
}
