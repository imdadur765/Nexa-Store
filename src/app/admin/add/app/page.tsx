"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Upload, Save, Image as ImageIcon,
    Smartphone, Plus, Sparkles, Layout, Monitor,
    Trash2, Star, Zap, ShoppingBag, Send, Wand2, History, Cpu, Terminal, Github, Code, ShieldCheck
} from 'lucide-react';

const APP_CATEGORIES = [
    "Productivity", "Social", "Entertainment", "Finance",
    "Education", "Music", "Photography", "News",
    "Shopping", "Lifestyle", "Health", "System", "Tools"
];

const APP_COLLECTIONS = [
    { id: 'row:app-top-picks', label: '🎯 Top Picks' },
    { id: 'row:app-essential', label: '🛠️ Essentials' },
    { id: 'row:app-trending', label: '⚡ Trending App' },
    { id: 'row:app-recommended', label: '💡 Recommended' },
    { id: 'row:app-new', label: '✨ New Releases' },
    { id: 'row:app-entertainment', label: '🎭 Entertainment' },
    { id: 'row:app-social', label: '🌍 Social Hub' },
    { id: 'row:app-productivity', label: '📈 Productivity' }
];

export default function AddGeneralAppPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Productivity',
        version: '1.0.0',
        developer: '',
        rating: '4.5',
        age_rating: '4+',
        package_size: '',
        download_url: '',
        is_featured: false,
        trending: false,
        is_editor_choice: false,
        whats_new: 'Initial Release',
        is_game: false,
        platforms: ['Android', 'iOS'],
        accent_color: '#10b981',
        icon_url: '',
        hero_image: '',
        downloads: '0',
        is_hero: false,
        priority: '0',
        tags: [] as string[],
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
        older_versions: [] as { version: string; date: string; url: string; android: string; type: string }[],
        // Editorial Analysis (Phase 25)
        editors_verdict: '',
        pros: '',
        cons: '',
        editorial_rating: '4.8',
        is_safety_verified: true
    });

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

    // Auth check
    useEffect(() => {
        const check = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/admin');
        };
        check();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'hero' | 'screenshots') => {
        if (!e.target.files?.[0]) return;

        if (type === 'icon') {
            setIconFile(e.target.files[0]);
            setIconPreview(URL.createObjectURL(e.target.files[0]));
        } else if (type === 'hero') {
            setHeroFile(e.target.files[0]);
            setHeroPreview(URL.createObjectURL(e.target.files[0]));
        } else if (type === 'screenshots') {
            const files = Array.from(e.target.files);
            setScreenshotFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(f => URL.createObjectURL(f));
            setScreenshotPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeScreenshot = (index: number) => {
        setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
        setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleTagToggle = (tagId: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('nexa-assets')
            .upload(fileName, file);

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
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
        setLoading(true);
        try {
            let iconUrl = formData.icon_url_external;
            if (!iconUrl && iconFile) iconUrl = await uploadImage(iconFile);
            else if (!iconUrl) iconUrl = formData.icon_url;

            let heroUrl = formData.hero_image;
            if (heroFile) heroUrl = await uploadImage(heroFile);

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
                    ...formData,
                    icon_url: iconUrl,
                    hero_image: heroUrl,
                    screenshots: screenshotUrls,
                    status: 'approved',
                    priority: parseInt(formData.priority) || 0,
                    // Technical Info
                    package_name: formData.package_name,
                    sha256: formData.sha256,
                    certificate_signature: formData.certificate_signature,
                    min_android_version: formData.min_android_version,
                    permissions: formData.permissions ? formData.permissions.split(',').map(s => s.trim()) : [],
                    languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : ['English'],
                    older_versions: formData.older_versions,
                    // Editorial Analysis
                    editors_verdict: formData.editors_verdict,
                    pros: formData.pros ? formData.pros.split(',').map(s => s.trim()) : [],
                    cons: formData.cons ? formData.cons.split(',').map(s => s.trim()) : [],
                    editorial_rating: parseFloat(formData.editorial_rating) || 4.8,
                    is_safety_verified: formData.is_safety_verified
                }]);

            if (error) throw error;
            alert('✨ Premium App published successfully!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
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
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Premium App Registry</h1>
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
                                {iconPreview ? (
                                    <img src={iconPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Plus size={28} color="#10b981" />
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} style={{ display: 'none' }} />
                        </label>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>APP NAME</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Nexa Cloud" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.2rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (OPTIONAL)</label>
                                <input type="url" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="GitHub/Imgur link..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.2rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', fontWeight: '600', outline: 'none' }} />
                                {formData.icon_url_external && <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>Using External URL (Bypassing Storage)</div>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CATEGORY</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }}>
                                {APP_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>ACCENT COLOR</label>
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
                            <button type="button" onClick={() => setFormData(p => ({ ...p, is_hero: !p.is_hero }))}
                                style={{ width: '45px', height: '24px', borderRadius: '100px', border: 'none', background: formData.is_hero ? '#10b981' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_hero ? '24px' : '3px', transition: '0.3s' }} />
                            </button>
                        </div>
                    </div>

                    <label style={{
                        width: '100%', height: '180px', borderRadius: '24px',
                        border: '2px dashed rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.02)', cursor: 'pointer', overflow: 'hidden'
                    }}>
                        {heroPreview ? (
                            <img src={heroPreview} alt="hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <ImageIcon size={32} color="rgba(255,255,255,0.3)" />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', fontWeight: '700' }}>Upload Hero Banner (16:9)</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} style={{ display: 'none' }} />
                    </label>
                </div>

                {/* ── App Details ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Core Details</h3>
                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DESCRIPTION</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Premium productivity module for power users..." rows={4} required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '20px', color: 'white', outline: 'none', resize: 'none', lineHeight: '1.6' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DEVELOPER</label>
                            <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} placeholder="Nexa Labs" required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>FILE SIZE</label>
                            <input type="text" name="package_size" value={formData.package_size} onChange={handleInputChange} placeholder="25 MB"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>DOWNLOAD URL (APK/PLAY STORE)</label>
                        <input type="url" name="download_url" value={formData.download_url} onChange={handleInputChange} placeholder="https://cloud.nexa/dl/..." required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.25rem', borderRadius: '16px', color: '#10b981', fontWeight: '700', outline: 'none' }} />
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
                        <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="Checksum hash..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CERTIFICATE SIGNATURE</label>
                        <input type="text" name="certificate_signature" value={formData.certificate_signature} onChange={handleInputChange} placeholder="Signature hash..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS (COMMA SEPARATED)</label>
                        <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="INTERNET, CAMERA..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>LANGUAGES (COMMA SEPARATED)</label>
                        <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                    </div>
                </div>

                {/* ── Visual Media ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Visual Media</h3>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (PREMIUM OPTION)</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input type="text" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="https://pinterest.com/pin/..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', paddingRight: '3.5rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                {(formData.icon_url_external.includes('pinterest.com') || formData.icon_url_external.includes('pin.it') || formData.icon_url_external.includes('imgur.com')) && (
                                    <button type="button" onClick={() => resolveExternalUrl(formData.icon_url_external, 'icon_url_external')}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(59, 130, 246, 0.2)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wand2 size={16} color="#3b82f6" />
                                    </button>
                                )}
                            </div>
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
                                const val = formData[fieldName] as string;
                                return (
                                    <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name={fieldName}
                                                value={val}
                                                onChange={handleInputChange}
                                                placeholder={`URL ${num} (Pinterest Page)`}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '14px', color: 'white', fontSize: '0.8rem', outline: 'none' }}
                                            />
                                            {(val.includes('pinterest.com') || val.includes('pin.it')) && (
                                                <button type="button" onClick={() => resolveExternalUrl(val, fieldName)}
                                                    style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
                                                    <Wand2 size={12} color="#3b82f6" />
                                                </button>
                                            )}
                                        </div>
                                        {val && (
                                            <div style={{ width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                                <img src={val} alt={`Preview ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+Link')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {(formData.screenshot1_external || formData.screenshot2_external || formData.screenshot3_external || formData.screenshot4_external) && (
                            <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '10px', fontWeight: '700' }}>✨ Live Previews Active (Direct Link Optimization)</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                        <label style={{
                            minWidth: '100px', height: '160px', borderRadius: '16px',
                            border: '2px dashed rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.02)', cursor: 'pointer'
                        }}>
                            <Plus size={24} color="rgba(255,255,255,0.3)" />
                            <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'screenshots')} style={{ display: 'none' }} />
                        </label>
                        {screenshotPreviews.map((src, idx) => (
                            <div key={idx} style={{ position: 'relative', minWidth: '100px', height: '160px' }}>
                                <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                <button type="button" onClick={() => removeScreenshot(idx)}
                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px' }}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Store Collections ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Store Collections</h3>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        {APP_COLLECTIONS.map(collection => {
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
                            <button type="button" onClick={() => setFormData(p => ({ ...p, is_featured: !p.is_featured }))}
                                style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_featured ? '#10b981' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_featured ? '21px' : '3px', transition: '0.3s' }} />
                            </button>
                        </div>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <Star size={18} color="#3b82f6" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Editor Choice</span>
                            </div>
                            <button type="button" onClick={() => setFormData(p => ({ ...p, is_editor_choice: !p.is_editor_choice }))}
                                style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_editor_choice ? '#3b82f6' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_editor_choice ? '21px' : '3px', transition: '0.3s' }} />
                            </button>
                        </div>
                    </div>

                    {/* ── Older Versions ── */}
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

                    {/* ── Editor Analysis Section ── */}
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Zap size={20} color="#f59e0b" />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase' }}>Editor's Analysis (Uptodown Style)</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>AUTHORITY VERDICT</label>
                                <textarea name="editors_verdict" value={formData.editors_verdict} onChange={handleInputChange} placeholder="Expert assessment of the app..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.85rem', outline: 'none', minHeight: '100px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>NEXA SCORE</label>
                                <input type="number" step="0.1" name="editorial_rating" value={formData.editorial_rating} onChange={handleInputChange} placeholder="4.8"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '900', outline: 'none', fontSize: '1.2rem', textAlign: 'center' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PROS (COMMA SEPARETED)</label>
                                <textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="Fast, Clean UI, Secure..."
                                    style={{ width: '100%', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CONS (COMMA SEPARETED)</label>
                                <textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Large size, Ads..."
                                    style={{ width: '100%', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(61, 220, 132, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <ShieldCheck size={18} color="#3ddc84" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3ddc84' }}>Safety Verified Badge</span>
                            </div>
                            <button type="button" onClick={() => setFormData(p => ({ ...p, is_safety_verified: !p.is_safety_verified }))}
                                style={{ width: '40px', height: '22px', borderRadius: '100px', border: 'none', background: formData.is_safety_verified ? '#3ddc84' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_safety_verified ? '21px' : '3px', transition: '0.3s' }} />
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '1.25rem', borderRadius: '24px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: '900',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
                            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                        }}>
                        <Send size={22} />
                        {loading ? 'Publishing Premium App...' : 'Release to Nexa Store'}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div >
    );
}
