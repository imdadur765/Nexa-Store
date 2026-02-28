"use client";

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Upload, Save, Image as ImageIcon,
    Smartphone, Star, Trash2, Flame, CheckCircle2, Zap,
    Gamepad2, Trophy, Monitor, Laptop, Plus, Sparkles, Layout, Cpu, Terminal, Github, Code, History, ShieldCheck, Send, Wand2
} from 'lucide-react';
import { motion } from 'framer-motion';

// Helper for robust tag checking
const hasTag = (tags: string[], tag: string) => {
    return tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase());
};

// Helper to safely parse screenshots
const safeParseScreenshots = (data: any): string[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            if (data.startsWith('{') && data.endsWith('}')) {
                const parsed = data
                    .slice(1, -1)
                    .split(',')
                    .map(s => s.trim().replace(/^"|"$/g, ''))
                    .filter(s => s.length > 0);
                return parsed;
            }
            return [];
        }
    }
    return [];
};

export default function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tools',
        version: '',
        is_featured: false,
        download_url: '',
        developer: '',
        rating: '4.5',
        age_rating: '4+',
        package_size: '',
        github_url: '',
        trending: false,
        is_editor_choice: false,
        whats_new: '',
        is_game: false,
        platforms: 'Android',
        accent_color: '#3b82f6',
        hero_image: '',
        downloads: '0',
        is_hero: false,
        priority: '0',
        status: 'approved',
        tags: [] as string[],
        // Technical Info
        package_name: '',
        sha256: '',
        certificate_signature: '',
        min_android_version: '6.0+',
        permissions: '',
        languages: 'English',
        older_versions: [] as { version: string; date: string; url: string; android: string; type: string }[],
        // Editorial Analysis (Phase 25)
        editors_verdict: '',
        pros: '',
        cons: '',
        editorial_rating: '4.5',
        is_safety_verified: true,
        // External URLs
        icon_url_external: '',
        screenshot1_external: '',
        screenshot2_external: '',
        screenshot3_external: '',
        screenshot4_external: ''
    });
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Android']);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [currentIconUrl, setCurrentIconUrl] = useState('');
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

    useEffect(() => {
        const checkAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.push('/admin'); return; }

            const { data, error } = await supabase
                .from('apps')
                .select('*')
                .eq('id', parseInt(id))
                .single();

            const appData = data as any;

            if (error || !appData) {
                alert('App not found!');
                router.push('/admin/dashboard');
                return;
            }

            setFormData({
                name: appData.name || '',
                description: appData.description || '',
                category: appData.category || 'Tools',
                version: appData.version || '',
                is_featured: appData.is_featured || false,
                download_url: appData.download_url || '',
                developer: appData.developer || '',
                rating: appData.rating?.toString() || '4.5',
                age_rating: appData.age_rating || '4+',
                package_size: appData.package_size || '',
                github_url: appData.github_url || '',
                trending: appData.trending || false,
                is_editor_choice: appData.is_editor_choice || false,
                whats_new: appData.whats_new || '',
                is_game: appData.is_game || false,
                platforms: Array.isArray(appData.platforms) ? appData.platforms.join(', ') : (appData.platforms || 'Android'),
                accent_color: appData.accent_color || '#3b82f6',
                hero_image: appData.hero_image || '',
                downloads: appData.downloads || '0',
                is_hero: appData.is_hero || false,
                priority: appData.priority?.toString() || '0',
                status: appData.status || 'approved',
                tags: appData.tags || [],
                // Technical Info
                package_name: appData.package_name || '',
                sha256: appData.sha256 || '',
                certificate_signature: appData.certificate_signature || '',
                min_android_version: appData.min_android_version || '6.0+',
                permissions: Array.isArray(appData.permissions) ? appData.permissions.join(', ') : (appData.permissions || ''),
                languages: Array.isArray(appData.languages) ? appData.languages.join(', ') : (appData.languages || 'English'),
                icon_url_external: appData.icon_url_external || '',
                screenshot1_external: Array.isArray(appData.screenshots) ? (appData.screenshots[0] || '') : '',
                screenshot2_external: Array.isArray(appData.screenshots) ? (appData.screenshots[1] || '') : '',
                screenshot3_external: appData.screenshot3_external || (Array.isArray(appData.screenshots) ? (appData.screenshots[2] || '') : ''),
                screenshot4_external: appData.screenshot4_external || (Array.isArray(appData.screenshots) ? (appData.screenshots[3] || '') : ''),
                older_versions: appData.older_versions || [],
                editors_verdict: appData.editors_verdict || '',
                pros: Array.isArray(appData.pros) ? appData.pros.join(', ') : '',
                cons: Array.isArray(appData.cons) ? appData.cons.join(', ') : '',
                editorial_rating: appData.editorial_rating?.toString() || '4.5',
                is_safety_verified: appData.is_safety_verified ?? true
            });
            setSelectedPlatforms(Array.isArray(appData.platforms) ? appData.platforms : (appData.platforms ? appData.platforms.split(',').map((p: string) => p.trim()) : ['Android']));
            setCurrentIconUrl(appData.icon_url || '');
            setExistingScreenshots(safeParseScreenshots(appData.screenshots));
            setLoading(false);
        };
        checkAndFetch();
    }, [id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: !(prev as any)[field] }));
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIconFile(e.target.files[0]);
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

    const removeNewScreenshot = (index: number) => {
        setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
        setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingScreenshot = (index: number) => {
        setExistingScreenshots(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImage = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('nexa-assets')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Storage error:', uploadError);
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data } = supabase.storage.from('nexa-assets').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (err: any) {
            console.error('Upload catch block:', err);
            throw err;
        }
    };

    const resolveExternalUrl = async (url: string, fieldName: keyof typeof formData) => {
        if (!url || !url.startsWith('http')) return;
        try {
            const res = await fetch(`/api/resolve-image?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.imageUrl) {
                setFormData(prev => ({ ...prev, [fieldName]: data.imageUrl }));
            } else if (data.error) {
                alert(data.error);
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
        e.preventDefault();
        setSaving(true);
        try {
            let iconUrl = currentIconUrl;
            if (iconFile) {
                try {
                    iconUrl = await uploadImage(iconFile);
                } catch (uploadErr: any) {
                    console.warn('Image upload failed:', uploadErr.message);
                }
            }

            const uploadedScreenshots = [];
            for (const file of screenshotFiles) {
                const url = await uploadImage(file);
                uploadedScreenshots.push(url);
            }

            const finalScreenshots = [...existingScreenshots, ...uploadedScreenshots];

            const { error } = await supabase
                .from('apps')
                .update({
                    ...formData,
                    rating: parseFloat(formData.rating) || 4.5,
                    editorial_rating: parseFloat(formData.editorial_rating) || 4.5,
                    icon_url: iconUrl,
                    screenshots: finalScreenshots,
                    platforms: selectedPlatforms,
                    priority: parseInt(formData.priority) || 0,
                    permissions: formData.permissions ? formData.permissions.split(',').map((s: string) => s.trim()) : [],
                    languages: formData.languages ? formData.languages.split(',').map((s: string) => s.trim()) : ['English'],
                    pros: formData.pros ? formData.pros.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
                    cons: formData.cons ? formData.cons.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
                    is_safety_verified: formData.is_safety_verified,
                    editors_verdict: formData.editors_verdict,
                    icon_url_external: formData.icon_url_external,
                })
                .eq('id', parseInt(id));

            if (error) throw error;
            alert('App updated!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading app data...</p>
        </div>
    );

    // ── SPECIALIZED PORTAL DETECTION ──
    const isGameDetection = formData.is_game || formData.category === 'Games' || (formData.category && ['Action', 'RPG', 'Adventure', 'Sports', 'Racing', 'Simulation', 'Strategy', 'Puzzle', 'Horror', 'Fighting', 'Open World'].includes(formData.category));
    const isAppDetection = !isGameDetection && (formData.category && ['Productivity', 'Social', 'Entertainment', 'Finance', 'Education', 'Music', 'Photography', 'News', 'Shopping', 'Lifestyle', 'Health', 'System'].includes(formData.category));
    const isToolDetection = !isGameDetection && !isAppDetection && (formData.category === 'Tools' || formData.category === 'Root' || formData.category === 'Modules');

    if (isAppDetection) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
                <header className="ultra-glass" style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                    background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)'
                }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Layout size={22} color="#10b981" />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>App Portal</h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>

                    {/* ── Visual Brand Section ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>Visual Brand</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <label style={{ position: 'relative', width: '90px', height: '90px', cursor: 'pointer', flexShrink: 0 }}>
                                <div style={{
                                    width: '100%', height: '100%',
                                    borderRadius: '24px', overflow: 'hidden',
                                    border: '2px dashed rgba(16, 185, 129, 0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(16, 185, 129, 0.05)'
                                }}>
                                    {iconFile ? (
                                        <img src={URL.createObjectURL(iconFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : currentIconUrl ? (
                                        <img src={currentIconUrl} alt="current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Plus size={28} color="#10b981" />
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>APP NAME</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Nexa Cloud" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.2rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CATEGORY</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }}>
                                    {['Productivity', 'Social', 'Entertainment', 'Finance', 'Education', 'Music', 'Photography', 'News', 'Shopping', 'Lifestyle', 'Health', 'System'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>THEME COLOR</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="color" name="accent_color" value={formData.accent_color} onChange={handleInputChange}
                                        style={{ width: '45px', height: '45px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
                                    <input type="text" name="accent_color" value={formData.accent_color} onChange={handleInputChange}
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Hero Marketing ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Hero Marketing</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: formData.is_hero ? '#10b981' : 'rgba(255,255,255,0.3)' }}>Enable Hero Slider</span>
                                <button type="button" onClick={() => handleToggle('is_hero')}
                                    style={{ width: '45px', height: '24px', borderRadius: '100px', border: 'none', background: formData.is_hero ? '#10b981' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_hero ? '24px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>HERO BACKGROUND URL</label>
                            <input type="url" name="hero_image" value={formData.hero_image} onChange={handleInputChange} placeholder="https://..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                            {formData.hero_image && (
                                <div style={{ marginTop: '1rem', width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={formData.hero_image} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── App Details ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Core Details</h3>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DESCRIPTION</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="App features..." rows={4} required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '20px', color: 'white', outline: 'none', resize: 'none', lineHeight: '1.6' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DEVELOPER</label>
                                <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} placeholder="Developer Name" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>FILE SIZE</label>
                                <input type="text" name="package_size" value={formData.package_size} onChange={handleInputChange} placeholder="25 MB"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DOWNLOAD URL</label>
                            <input type="url" name="download_url" value={formData.download_url} onChange={handleInputChange} placeholder="https://..." required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.25rem', borderRadius: '16px', color: '#10b981', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>

                    {/* ── Screenshots ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Screenshots</h3>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                            <label style={{
                                minWidth: '100px', height: '160px', borderRadius: '16px',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.02)', cursor: 'pointer'
                            }}>
                                <Plus size={24} color="rgba(255,255,255,0.3)" />
                                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} style={{ display: 'none' }} />
                            </label>

                            {existingScreenshots.map((src, idx) => (
                                <div key={`ex-${idx}`} style={{ position: 'relative', minWidth: '100px', height: '160px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                    <button type="button" onClick={() => removeExistingScreenshot(idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px' }}>×</button>
                                </div>
                            ))}

                            {screenshotPreviews.map((src, idx) => (
                                <div key={`new-${idx}`} style={{ position: 'relative', minWidth: '100px', height: '160px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid #10b981' }} />
                                    <button type="button" onClick={() => removeNewScreenshot(idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Universal External Asset Control ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>Universal External Asset Control</h3>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (PREMIUM)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="text" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="https://..."
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                {formData.icon_url_external && (
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                        <img src={formData.icon_url_external} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Error')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT SCREENSHOT URLS (4 SLOTS)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {[1, 2, 3, 4].map((num) => {
                                    const fieldName = `screenshot${num}_external` as keyof typeof formData;
                                    // @ts-ignore
                                    const val = formData[fieldName];
                                    return (
                                        <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input type="text" name={fieldName} value={(val as string) || ''} onChange={handleInputChange} placeholder={`Screenshot ${num}`}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
                                            {val && typeof val === 'string' && (
                                                <div style={{ width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                                    <img src={val as string} alt={`Preview ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid')} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Uptodown Technical Info ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Details</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PACKAGE NAME</label>
                                <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="com.example.app"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>MIN ANDROID</label>
                                <input type="text" name="min_android_version" value={formData.min_android_version} onChange={handleInputChange} placeholder="6.0+"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SHA256 CHECKSUM</label>
                            <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="244a36d609429e50e1e90c7..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CERTIFICATE SIGNATURE</label>
                            <input type="text" name="certificate_signature" value={formData.certificate_signature} onChange={handleInputChange} placeholder="3d3e6a9538a1..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS (COMMA SEPARATED)</label>
                            <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="INTERNET, CAMERA, STORAGE..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>LANGUAGES (COMMA SEPARATED)</label>
                            <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi, Spanish..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Store Collections</h3>
                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                            {[
                                { id: 'row:app-top-picks', label: '🎯 Top Picks' },
                                { id: 'row:app-essential', label: '🛠️ Essentials' },
                                { id: 'row:app-trending', label: '⚡ Trending App' },
                                { id: 'row:app-recommended', label: '💡 Recommended' },
                                { id: 'row:app-new', label: '✨ New Releases' },
                                { id: 'row:app-entertainment', label: '🎭 Entertainment' },
                                { id: 'row:app-social', label: '🌍 Social Hub' },
                                { id: 'row:app-productivity', label: '📈 Productivity' }
                            ].map(collection => {
                                const isActive = formData.tags.includes(collection.id);
                                return (
                                    <button key={collection.id} type="button" onClick={() => handleTagToggle(collection.id)}
                                        style={{
                                            padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)',
                                            background: isActive ? 'white' : 'rgba(255,255,255,0.03)',
                                            color: isActive ? 'black' : 'white',
                                            fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s'
                                        }}>
                                        {collection.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Submission ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <Sparkles size={18} color="#10b981" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Featured</span>
                                </div>
                                <button type="button" onClick={() => handleToggle('is_featured')}
                                    style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_featured ? '#10b981' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_featured ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <Star size={18} color="#3b82f6" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Editor Choice</span>
                                </div>
                                <button type="button" onClick={() => handleToggle('is_editor_choice')}
                                    style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_editor_choice ? '#3b82f6' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_editor_choice ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        {/* ── Editor Analysis Section ── */}
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.1)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Zap size={20} color="#10b981" />
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>Editor's Analysis</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>AUTHORITY VERDICT</label>
                                    <textarea name="editors_verdict" value={formData.editors_verdict} onChange={handleInputChange} placeholder="Expert assessment..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.85rem', outline: 'none', minHeight: '100px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SCORE</label>
                                    <input type="number" step="0.1" name="editorial_rating" value={formData.editorial_rating} onChange={handleInputChange}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '900', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PROS (COMMA SEPARETED)</label>
                                    <textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="Fast, Secure..."
                                        style={{ width: '100%', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CONS (COMMA SEPARETED)</label>
                                    <textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Ads, Large..."
                                        style={{ width: '100%', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(61, 220, 132, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <ShieldCheck size={18} color="#3ddc84" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3ddc84' }}>App Safety Verified Badge</span>
                                </div>
                                <button type="button" onClick={() => handleToggle('is_safety_verified')}
                                    style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_safety_verified ? '#3ddc84' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_safety_verified ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={saving}
                            style={{
                                width: '100%', padding: '1.25rem', borderRadius: '24px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: '900',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
                                opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer'
                            }}>
                            <Save size={22} />
                            {saving ? 'Updating App...' : 'Update App Registry'}
                        </button>
                    </div>
                </form>

                <style jsx>{`
                    .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        );
    }

    if (isGameDetection) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
                <header className="ultra-glass" style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Gamepad2 size={22} color="#8b5cf6" />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Edit Game Portal</h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── Visual Identity ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <label style={{ position: 'relative', width: '90px', height: '90px', cursor: 'pointer', flexShrink: 0 }}>
                                <div style={{
                                    width: '100%', height: '100%',
                                    borderRadius: '24px', overflow: 'hidden',
                                    border: '2px dashed rgba(139, 92, 246, 0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(139, 92, 246, 0.05)'
                                }}>
                                    {iconFile ? (
                                        <img src={URL.createObjectURL(iconFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : currentIconUrl ? (
                                        <img src={currentIconUrl} alt="current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <ImageIcon size={28} color="#8b5cf6" />
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#8b5cf6', padding: '6px', borderRadius: '50%' }}>
                                    <Upload size={12} color="white" />
                                </div>
                            </label>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>GAME TITLE</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Cyberpunk 2077" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.2rem', borderRadius: '16px', color: 'white', fontSize: '1rem', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>GENRE</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '600', outline: 'none' }}>
                                    {["Action", "RPG", "Adventure", "Sports", "Racing", "Simulation", "Strategy", "Puzzle", "Horror", "Fighting", "Open World"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>VERSION</label>
                                <input type="text" name="version" value={formData.version} onChange={handleInputChange} placeholder="1.0.0" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none', fontWeight: '600' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Gaming Specs ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'rgba(139, 92, 246, 0.8)', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Specs</h3>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '700' }}>AVAILABLE PLATFORMS</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['Android', 'iOS', 'Windows', 'Steam', 'PS', 'Xbox'].map(plat => {
                                    const isActive = selectedPlatforms.includes(plat);
                                    return (
                                        <button key={plat} type="button" onClick={() => {
                                            setSelectedPlatforms(prev => isActive ? prev.filter(p => p !== plat) : [...prev, plat]);
                                        }}
                                            style={{
                                                padding: '0.6rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)',
                                                background: isActive ? '#8b5cf6' : 'rgba(255,255,255,0.02)',
                                                color: isActive ? 'black' : 'white',
                                                fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                            }}>
                                            {plat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>DOWNLOAD SIZE</label>
                                <input type="text" name="package_size" value={formData.package_size} onChange={handleInputChange} placeholder="e.g. 2.4GB"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>DEVELOPER / STUDIO</label>
                                <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} placeholder="HoYoverse"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Hero & Marketing ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase' }}>Hero Marketing</h3>

                        <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Zap size={20} color={formData.is_hero ? '#f59e0b' : 'rgba(255,255,255,0.2)'} fill={formData.is_hero ? '#f59e0b' : 'none'} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Add to Home Slider</span>
                            </div>
                            <button type="button" onClick={() => handleToggle('is_hero')}
                                style={{
                                    width: '44px', height: '24px', borderRadius: '100px', border: 'none',
                                    background: formData.is_hero ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                                    position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                                }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_hero ? '23px' : '3px', transition: '0.3s' }} />
                            </button>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>HERO BACKGROUND URL</label>
                            <input type="url" name="hero_image" value={formData.hero_image} onChange={handleInputChange} placeholder="https://..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ef4444' }}>🔥 Trending</span>
                                <button type="button" onClick={() => handleToggle('trending')}
                                    style={{
                                        width: '40px', height: '22px', borderRadius: '100px', border: 'none',
                                        background: formData.trending ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                        position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                                    }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.trending ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: '700' }}>THEME COLOR</label>
                                <input type="color" name="accent_color" value={formData.accent_color} onChange={handleInputChange}
                                    style={{ width: '100%', height: '44px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Universal External Asset Control ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Universal External Asset Control</h3>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (PREMIUM)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="text" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="https://..."
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                {formData.icon_url_external && (
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                        <img src={formData.icon_url_external} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Error')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT SCREENSHOT URLS (4 SLOTS)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {[1, 2, 3, 4].map((num) => {
                                    const fieldName = `screenshot${num}_external` as keyof typeof formData;
                                    // @ts-ignore
                                    const val = formData[fieldName];
                                    return (
                                        <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input type="text" name={fieldName} value={(val as string) || ''} onChange={handleInputChange} placeholder={`Screenshot ${num}`}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
                                            {val && typeof val === 'string' && (
                                                <div style={{ width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                                    <img src={val as string} alt={`Preview ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid')} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Screenshots ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Screenshots</h3>
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                            <label style={{
                                minWidth: '100px', height: '150px', borderRadius: '16px',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.02)', cursor: 'pointer'
                            }}>
                                <Plus size={24} color="rgba(255,255,255,0.3)" />
                                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} style={{ display: 'none' }} />
                            </label>

                            {existingScreenshots.map((src, idx) => (
                                <div key={`ex-${idx}`} style={{ position: 'relative', minWidth: '100px', height: '150px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                    <button type="button" onClick={() => removeExistingScreenshot(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px' }}>×</button>
                                </div>
                            ))}

                            {screenshotPreviews.map((src, idx) => (
                                <div key={`new-${idx}`} style={{ position: 'relative', minWidth: '100px', height: '150px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', border: '2px solid #8b5cf6' }} />
                                    <button type="button" onClick={() => removeNewScreenshot(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Uptodown Technical Info ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(139, 92, 246, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Details</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PACKAGE NAME</label>
                                <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="com.example.game"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>MIN ANDROID</label>
                                <input type="text" name="min_android_version" value={formData.min_android_version} onChange={handleInputChange} placeholder="6.0+"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SHA256 CHECKSUM</label>
                            <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="Checksum..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CERTIFICATE SIGNATURE</label>
                            <input type="text" name="certificate_signature" value={formData.certificate_signature} onChange={handleInputChange} placeholder="Signature..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS (COMMA SEPARATED)</label>
                            <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="INTERNET, STORAGE..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>LANGUAGES (COMMA SEPARATED)</label>
                            <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, etc."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '700' }}>STORE COLLECTIONS</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {[
                                    { id: 'row:game-popular-action', label: '🔥 Popular Action' },
                                    { id: 'row:game-top-picks', label: '🎯 Top Picks' },
                                    { id: 'row:game-playstore', label: '📲 Playstore Favs' },
                                    { id: 'row:game-trending', label: '⚡ Trending Row' },
                                    { id: 'row:game-adventure', label: '🗺️ Epic Adventures' },
                                    { id: 'row:game-originals', label: '🍎 Store Originals' },
                                    { id: 'row:game-competitive', label: '🏆 Competitive' },
                                    { id: 'row:game-console', label: '🎮 Console Quality' },
                                    { id: 'row:game-explore', label: '🌌 Explore Universe' },
                                    { id: 'row:rare-find', label: '💎 Rare Find' },
                                    { id: 'row:editors-choice', label: '✨ Editor\'s Choice' }
                                ].map(tag => (
                                    <button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)}
                                        style={{
                                            padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                            background: formData.tags.includes(tag.id) ? 'white' : 'rgba(255,255,255,0.03)',
                                            color: formData.tags.includes(tag.id) ? 'black' : 'white',
                                            fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s'
                                        }}>
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Editor Analysis Section ── */}
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(139, 92, 246, 0.1)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Zap size={20} color="#8b5cf6" />
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Editor's Game Analysis</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>AUTHORITY VERDICT</label>
                                    <textarea name="editors_verdict" value={formData.editors_verdict} onChange={handleInputChange} placeholder="Expert gameplay assessment..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.85rem', outline: 'none', minHeight: '100px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SCORE</label>
                                    <input type="number" step="0.1" name="editorial_rating" value={formData.editorial_rating} onChange={handleInputChange}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '900', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>GAME PROS</label>
                                    <textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="High FPS, No Ads..."
                                        style={{ width: '100%', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>GAME CONS</label>
                                    <textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Pay to win, Glitches..."
                                        style={{ width: '100%', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <ShieldCheck size={18} color="#8b5cf6" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#8b5cf6' }}>Game Safety Verified Badge</span>
                                </div>
                                <button type="button" onClick={() => handleToggle('is_safety_verified')}
                                    style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_safety_verified ? '#8b5cf6' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_safety_verified ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={saving}
                            style={{
                                width: '100%', padding: '1.25rem', borderRadius: '24px',
                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: '900',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
                                opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer'
                            }}>
                            <Save size={22} />
                            {saving ? 'Saving Changes...' : 'Update Game Registry'}
                        </button>
                    </div>
                </form>

                <style jsx>{`
                    .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        );
    }

    // ── SPECIALIZED RENDER: TOOL PORTAL ──
    if (isToolDetection) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
                <header className="ultra-glass" style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Cpu size={22} color="#3b82f6" />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Edit Tool Registry</h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── Tool Identity ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <label style={{ position: 'relative', width: '80px', height: '80px', cursor: 'pointer', flexShrink: 0 }}>
                                <div style={{
                                    width: '100%', height: '100%',
                                    borderRadius: '20px', overflow: 'hidden',
                                    border: '2px dashed rgba(59, 130, 246, 0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(59, 130, 246, 0.05)'
                                }}>
                                    {iconFile ? (
                                        <img src={URL.createObjectURL(iconFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : currentIconUrl ? (
                                        <img src={currentIconUrl} alt="current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Terminal size={28} color="#3b82f6" />
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#3b82f6', padding: '6px', borderRadius: '50%' }}>
                                    <Upload size={12} color="white" />
                                </div>
                            </label>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>TOOL NAME</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Nexus CLI" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CATEGORY</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }}>
                                    {["Tools", "Productivity", "Root", "Modules", "System", "Security", "Customization", "Developer", "CLI", "Magisk"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>VERSION</label>
                                <input type="text" name="version" value={formData.version} onChange={handleInputChange} placeholder="v1.0.0" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Technical URLs ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>Resources</h3>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Github size={18} color="rgba(255,255,255,0.4)" />
                                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '800' }}>GITHUB REPOSITORY</label>
                            </div>
                            <input type="url" name="github_url" value={formData.github_url} onChange={handleInputChange} placeholder="https://github.com/..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DOWNLOAD ASSET URL</label>
                            <input type="url" name="download_url" value={formData.download_url} onChange={handleInputChange} placeholder="Direct link to APK or ZIP"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                        </div>
                    </div>

                    {/* ── Universal External Asset Control ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>Universal External Asset Control</h3>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (PREMIUM)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="text" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="https://..."
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                {formData.icon_url_external && (
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                        <img src={formData.icon_url_external} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Error')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT SCREENSHOT URLS (4 SLOTS)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {[1, 2, 3, 4].map((num) => {
                                    const fieldName = `screenshot${num}_external` as keyof typeof formData;
                                    // @ts-ignore
                                    const val = formData[fieldName];
                                    return (
                                        <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                <input type="text" name={fieldName} value={(val as string) || ''} onChange={handleInputChange} placeholder={`URL ${num} (Pinterest)`}
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '14px', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
                                                {(typeof val === 'string' && (val.includes('pinterest.com') || val.includes('pin.it'))) && (
                                                    <button type="button" onClick={() => (resolveExternalUrl as any)(val, fieldName)}
                                                        style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Wand2 size={12} color="#3b82f6" />
                                                    </button>
                                                )}
                                            </div>
                                            {typeof val === 'string' && val && (
                                                <div style={{ width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                                    <img src={val as string} alt={`Preview ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid')} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Uptodown Technical Info ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Details</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PACKAGE NAME</label>
                                <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="com.example.tool"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>MIN ANDROID</label>
                                <input type="text" name="min_android_version" value={formData.min_android_version} onChange={handleInputChange} placeholder="6.0+"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SHA256 CHECKSUM</label>
                            <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="Checksum..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.75rem', fontFamily: 'monospace' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS</label>
                            <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="Comma-separated"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: '800' }}>SYSTEM PLACEMENT</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {[
                                    { id: 'row:security', label: '🛡️ Security Focus', color: '#ef4444' },
                                    { id: 'row:customization', label: '🎨 UI Tweaks', color: '#ec4899' },
                                    { id: 'row:performance', label: '⚡ Performance', color: '#10b981' }
                                ].map(tag => (
                                    <button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)}
                                        style={{
                                            padding: '0.65rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)',
                                            background: (formData.tags as string[]).includes(tag.id) ? tag.color : 'rgba(255,255,255,0.03)',
                                            color: (formData.tags as string[]).includes(tag.id) ? 'black' : 'white',
                                            fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s'
                                        }}>
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Editor Analysis Section ── */}
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.1)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Zap size={20} color="#f59e0b" />
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase' }}>Editor's Tool Analysis</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>AUTHORITY VERDICT</label>
                                    <textarea name="editors_verdict" value={formData.editors_verdict} onChange={handleInputChange} placeholder="Expert tool assessment..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.85rem', outline: 'none', minHeight: '100px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SCORE</label>
                                    <input type="number" step="0.1" name="editorial_rating" value={formData.editorial_rating} onChange={handleInputChange}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '900', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>TOOL PROS</label>
                                    <textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="Lightweight, fast..."
                                        style={{ width: '100%', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>TOOL CONS</label>
                                    <textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Steep learning curve..."
                                        style={{ width: '100%', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <ShieldCheck size={18} color="#f59e0b" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#f59e0b' }}>Tool Safety Verified</span>
                                </div>
                                <button type="button" onClick={() => handleToggle('is_safety_verified')}
                                    style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_safety_verified ? '#f59e0b' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_safety_verified ? '21px' : '3px', transition: '0.3s' }} />
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={saving}
                            style={{
                                width: '100%', padding: '1.25rem', borderRadius: '24px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: 'white', border: 'none', fontSize: '1rem', fontWeight: '900',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                boxShadow: '0 12px 32px rgba(3b82f6, 0.4)',
                                opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer'
                            }}>
                            <Save size={20} />
                            {saving ? 'Updating Tool...' : 'Update Tools Registry'}
                        </button>
                    </div>
                </form>

                <style jsx>{`
                    .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
            <header className="ultra-glass" style={{
                position: 'sticky', top: 0, zIndex: 100,
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit General App</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Icon Section */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer' }}>
                        <div style={{
                            width: '100%', height: '100%',
                            borderRadius: '22px', overflow: 'hidden',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)'
                        }}>
                            {(iconFile || currentIconUrl) ? (
                                iconFile ? (
                                    <img src={URL.createObjectURL(iconFile)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src={currentIconUrl} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )
                            ) : (
                                <ImageIcon size={32} color="var(--text-muted)" />
                            )}
                        </div>
                        <div style={{
                            position: 'absolute', bottom: '-5px', right: '-5px',
                            background: 'var(--accent-secondary)', padding: '8px', borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}>
                            <Upload size={16} color="white" />
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                </div>

                {/* Core Information Section */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Core Information</h3>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>App Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Nexa Store" required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Version *</label>
                            <input type="text" name="version" value={formData.version} onChange={handleInputChange} placeholder="1.0.0" required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}>
                                <option value="Tools">Tools</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Games">Games</option>
                                <option value="Social">Social</option>
                                <option value="Root">Root</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Education">Education</option>
                                <option value="Finance">Finance</option>
                                <option value="Music">Music</option>
                                <option value="Modules">Modules</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Moderation Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: formData.status === 'pending' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}>
                                <option value="approved">Approved (Live)</option>
                                <option value="pending">Pending (Under Review)</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating (e.g. 4.8)</label>
                            <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="4.5"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Age Rating</label>
                        <input type="text" name="age_rating" value={formData.age_rating} onChange={handleInputChange} placeholder="4+, 12+, 18+"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Target Platforms</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['Android', 'iOS', 'Windows', 'PS', 'Xbox'].map(plat => (
                                <button
                                    key={plat}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPlatforms(prev =>
                                            prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
                                        );
                                    }}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: selectedPlatforms.includes(plat) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {plat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Download URL</label>
                        <input type="url" name="download_url" value={formData.download_url} onChange={handleInputChange} placeholder="https://..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>GitHub Repository URL (Optional)</label>
                        <input type="url" name="github_url" value={formData.github_url} onChange={handleInputChange} placeholder="https://github.com/..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the app..." rows={4} required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }} />
                    </div>

                    {/* Collection Tags */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Collection Rows (App Placement)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                                { id: 'row:rare-find', label: 'Rare Find', color: '#fbbf24' },
                                { id: 'row:security', label: 'Security & Privacy', color: '#ef4444' },
                                { id: 'row:customization', label: 'Customization', color: '#ec4899' },
                                { id: 'row:editors-choice', label: "Editor's Choice", color: '#3b82f6' },
                                { id: 'row:performance', label: 'Performance', color: '#10b981' }
                            ].map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: (formData.tags as string[]).includes(tag.id) ? tag.color : 'rgba(255,255,255,0.05)',
                                        color: (formData.tags as string[]).includes(tag.id) ? 'black' : 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Slider & Visuals Section - Crucial for Hero Image */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Zap size={20} color="#f59e0b" fill="#f59e0b" />
                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Hero Slider & Visuals</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Zap size={18} color={formData.is_hero ? '#f59e0b' : 'var(--text-muted)'} fill={formData.is_hero ? '#f59e0b' : 'none'} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add to Slider</span>
                            </div>
                            <button type="button" onClick={() => handleToggle('is_hero')}
                                style={{
                                    width: '40px', height: '22px', borderRadius: '100px', border: 'none',
                                    background: formData.is_hero ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                                    position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                                }}>
                                <div style={{
                                    width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                                    position: 'absolute', top: '3px',
                                    left: formData.is_hero ? '21px' : '3px',
                                    transition: 'all 0.3s ease'
                                }} />
                            </button>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hero Priority</label>
                            <input type="number" name="priority" value={formData.priority} onChange={handleInputChange} placeholder="100"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hero Background Image URL (Games Only)</label>
                        <input type="url" name="hero_image" value={formData.hero_image} onChange={handleInputChange} placeholder="https://..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        {formData.hero_image && (
                            <div style={{ marginTop: '1rem', position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={formData.hero_image} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', color: 'white' }}>Hero Image Preview</div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Theme Accent Color</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="color" name="accent_color" value={formData.accent_color} onChange={handleInputChange}
                                    style={{ width: '45px', height: '45px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
                                <input type="text" name="accent_color" value={formData.accent_color} onChange={handleInputChange} placeholder="#3b82f6"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Package Size</label>
                            <input type="text" name="package_size" value={formData.package_size} onChange={handleInputChange} placeholder="45MB"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Media & Version Info</h3>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>What's New</label>
                        <textarea name="whats_new" value={formData.whats_new} onChange={handleInputChange} placeholder="Release notes..." rows={3}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Screenshots (Gallery)</label>
                        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                            <label style={{
                                minWidth: '80px', height: '120px', borderRadius: '12px',
                                border: '2px dashed rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.05)', cursor: 'pointer'
                            }}>
                                <Upload size={20} color="var(--text-muted)" />
                                <input type="file" multiple accept="image/*" onChange={handleScreenshotsChange} style={{ display: 'none' }} />
                            </label>

                            {/* Existing Screenshots */}
                            {existingScreenshots.map((src, idx) => (
                                <div key={`existing-${idx}`} style={{ position: 'relative', minWidth: '80px', height: '120px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button type="button" onClick={() => removeExistingScreenshot(idx)} style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '50%',
                                        width: '20px', height: '20px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>×</button>
                                </div>
                            ))}

                            {/* New Screenshots */}
                            {screenshotPreviews.map((src, idx) => (
                                <div key={`new-${idx}`} style={{ position: 'relative', minWidth: '80px', height: '120px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--accent-primary)' }} />
                                    <button type="button" onClick={() => removeNewScreenshot(idx)} style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '50%',
                                        width: '20px', height: '20px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Older Versions (Management) ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <History size={20} color="#3b82f6" />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>Older Versions (History)</h3>
                        </div>
                        <button type="button" onClick={addOlderVersion}
                            style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px 16px', borderRadius: '12px', color: '#3b82f6', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={14} /> Add Version
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {formData.older_versions.map((ver, idx) => (
                            <div key={idx} className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                <button type="button" onClick={() => removeOlderVersion(idx)}
                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer' }}>
                                    <Trash2 size={14} color="#ef4444" />
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>VERSION TAG</label>
                                        <input type="text" value={ver.version} onChange={(e) => updateOlderVersion(idx, 'version', e.target.value)} placeholder="v2.0.0"
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>RELEASE DATE</label>
                                        <input type="text" value={ver.date} onChange={(e) => updateOlderVersion(idx, 'date', e.target.value)} placeholder="Oct 20, 2025"
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>MIN ANDROID</label>
                                        <input type="text" value={ver.android} onChange={(e) => updateOlderVersion(idx, 'android', e.target.value)} placeholder="6.0+"
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>TYPE</label>
                                        <input type="text" value={ver.type} onChange={(e) => updateOlderVersion(idx, 'type', e.target.value)} placeholder="APK / ZIP"
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.65rem', fontWeight: '800' }}>DOWNLOAD URL (GITHUB/OTHER)</label>
                                    <input type="url" value={ver.url} onChange={(e) => updateOlderVersion(idx, 'url', e.target.value)} placeholder="https://github.com/..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: '#3b82f6', fontWeight: '700', outline: 'none' }} />
                                </div>
                            </div>
                        ))}
                        {formData.older_versions.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '20px', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                                No older versions added yet. Click "Add Version" to start.
                            </div>
                        )}
                    </div>
                </div>

                {/* Promotion & System Flags */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Star size={18} color={formData.is_featured ? '#f59e0b' : 'var(--text-muted)'} fill={formData.is_featured ? '#f59e0b' : 'none'} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Featured</span>
                        </div>
                        <button type="button" onClick={() => handleToggle('is_featured')}
                            style={{
                                width: '40px', height: '22px', borderRadius: '100px', border: 'none',
                                background: formData.is_featured ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}>
                            <div style={{
                                width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '3px',
                                left: formData.is_featured ? '21px' : '3px',
                                transition: 'all 0.3s ease'
                            }} />
                        </button>
                    </div>

                    <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Flame size={18} color={formData.trending ? '#ef4444' : 'var(--text-muted)'} fill={formData.trending ? '#ef4444' : 'none'} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Trending</span>
                        </div>
                        <button type="button" onClick={() => handleToggle('trending')}
                            style={{
                                width: '40px', height: '22px', borderRadius: '100px', border: 'none',
                                background: formData.trending ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}>
                            <div style={{
                                width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '3px',
                                left: formData.trending ? '21px' : '3px',
                                transition: 'all 0.3s ease'
                            }} />
                        </button>
                    </div>

                    <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Smartphone size={18} color={formData.is_game ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Mark as Game</span>
                        </div>
                        <button type="button" onClick={() => handleToggle('is_game')}
                            style={{
                                width: '40px', height: '22px', borderRadius: '100px', border: 'none',
                                background: formData.is_game ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.1)',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}>
                            <div style={{
                                width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '3px',
                                left: formData.is_game ? '21px' : '3px',
                                transition: 'all 0.3s ease'
                            }} />
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={saving} className="play-btn"
                    style={{ width: '100%', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form >
        </div >
    );
}
