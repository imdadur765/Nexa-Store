"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Upload, Save, Image as ImageIcon,
    Smartphone, Star, Flame, CheckCircle2, Zap,
    Gamepad2, Trophy, Monitor, Laptop, Plus, Wand2, History, Trash2, ShieldCheck, Send,
    Sparkles, Layout, Github, Code, Terminal, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const GAME_CATEGORIES = [
    "Action", "RPG", "Adventure", "Sports",
    "Racing", "Simulation", "Strategy", "Puzzle",
    "Horror", "Fighting", "Open World"
];

export default function AddGamePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Action',
        version: '1.0.0',
        developer: '',
        rating: '4.8',
        age_rating: '12+',
        package_size: '',
        download_url: '',
        github_url: '',
        is_featured: false,
        trending: false,
        is_editor_choice: false,
        whats_new: 'Initial Release',
        is_game: true,
        platforms: ['Android', 'Windows'],
        accent_color: '#8b5cf6',
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
        is_safety_verified: true,
        slider_image_url: ''
    });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

    const [mirrors, setMirrors] = useState<{ source: string; name: string; url: string }[]>([]);
    const [searchingMirrors, setSearchingMirrors] = useState(false);
    const [mirroring, setMirroring] = useState(false);
    const [fetchingSecurity, setFetchingSecurity] = useState(false);

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

    const handlePlatformToggle = (plat: string) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(plat)
                ? prev.platforms.filter(p => p !== plat)
                : [...prev.platforms, plat]
        }));
    };

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

    const removeScreenshot = (index: number) => {
        setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
        setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
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

    const handleFetchPlaystore = async () => {
        if (!formData.package_name) {
            alert('Please enter a Package Name first (e.g., com.mojang.minecraftpe)');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/fetch-playstore?id=${encodeURIComponent(formData.package_name)}`);
            const data = await res.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            // Auto-populate form
            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                description: data.description || prev.description,
                category: data.category || prev.category,
                developer: data.developer || prev.developer,
                package_size: data.package_size || prev.package_size,
                rating: data.rating ? String(data.rating).slice(0, 3) : prev.rating,
                whats_new: data.whats_new || prev.whats_new,
                min_android_version: data.min_android_version || prev.min_android_version,
                icon_url_external: data.icon || prev.icon_url_external,
                hero_image: data.hero_image || prev.hero_image,
                slider_image_url: data.hero_image || prev.slider_image_url,
                screenshot1_external: data.screenshots?.[0] || prev.screenshot1_external,
                screenshot2_external: data.screenshots?.[1] || prev.screenshot2_external,
                screenshot3_external: data.screenshots?.[2] || prev.screenshot3_external,
                screenshot4_external: data.screenshots?.[3] || prev.screenshot4_external,
                is_game: true,
                version: data.version || prev.version
            }));

            // Handle preview updates
            if (data.icon) setIconPreview(data.icon);
            if (data.hero_image) setHeroPreview(data.hero_image);
            if (data.screenshots) setScreenshotPreviews(data.screenshots);

            alert('✨ Magic Fetch Successful! Data populated.');
            
            // Auto-search mirrors as well
            handleSearchMirrors(formData.package_name || data.package_name);
        } catch (err: any) {
            alert('❌ Failed to fetch: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchMirrors = async (pName?: string) => {
        const pkg = pName || formData.package_name;
        if (!pkg) {
            alert('Please enter a Package Name or use Magic Fetch first');
            return;
        }

        setSearchingMirrors(true);
        try {
            const res = await fetch(`/api/admin/fetch-mirrors?id=${encodeURIComponent(pkg)}`);
            const data = await res.json();
            if (data.mirrors) {
                setMirrors(data.mirrors);
            }
        } catch (err) {
            console.error("Mirror search failed:", err);
        } finally {
            setSearchingMirrors(false);
        }
    };

    const handleFetchSecurity = async () => {
        if (!formData.package_name) {
            alert('Please enter a Package Name first (or use Magic Fetch).');
            return;
        }
        setFetchingSecurity(true);
        try {
            const res = await fetch(`/api/admin/fetch-security?id=${encodeURIComponent(formData.package_name)}`);
            const data = await res.json();
            if (data.error) {
                alert('❌ Security Fetch Failed: ' + data.error);
                return;
            }
            setFormData(prev => ({
                ...prev,
                sha256: data.sha256 || prev.sha256,
                certificate_signature: data.signature || prev.certificate_signature,
                permissions: data.permissions?.join(', ') || prev.permissions,
                package_size: data.size || prev.package_size,
            }));
            alert(`✅ Security data fetched!\nSHA256: ${data.sha256 ? 'Found ✅' : 'Not found ❌'}\nPermissions: ${data.permissions?.length || 0} found`);
        } catch (err: any) {
            alert('❌ Error: ' + err.message);
        } finally {
            setFetchingSecurity(false);
        }
    };

    const handleCloudMirror = async (mirrorUrl: string) => {
        if (!formData.package_name) {
            alert('Package name is required for mirroring');
            return;
        }

        const confirmMirror = confirm("Cloud-Mirroring will transfer the APK directly from the source to your GitHub Releases (Zero Data Usage). Continue?");
        if (!confirmMirror) return;

        setMirroring(true);
        setLoading(true);
        try {
            const res = await fetch('/api/admin/cloud-mirror', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mirrorUrl, packageName: formData.package_name })
            });

            const data = await res.json();

            if (data.error) {
                alert('❌ Mirror Failed: ' + data.error);
                return;
            }

            // Success! Update the form download URL
            setFormData(prev => ({ ...prev, download_url: data.directDownloadUrl }));
            alert(`✅ Success! APK Mirrored to GitHub.\nFile Size: ${data.size}\nDirect Link Generated.`);

        } catch (err: any) {
            alert('❌ Cloud Mirror Error: ' + err.message);
        } finally {
            setMirroring(false);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let iconUrl = formData.icon_url_external;
            if (!iconUrl && iconFile) iconUrl = await uploadImage(iconFile);

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
                    screenshots: screenshotUrls,
                    rating: parseFloat(formData.rating) || 4.8,
                    priority: parseInt(formData.priority) || 0,
                    status: 'approved',
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
                    is_safety_verified: formData.is_safety_verified,
                    slider_image_url: formData.slider_image_url
                }]);

            if (error) throw error;
            alert('🎮 Game published successfully!');
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
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)'
            }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Gamepad2 size={22} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Publish Game</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

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
                                {iconPreview ? (
                                    <img src={iconPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Gamepad2 size={28} color="#8b5cf6" />
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: '800' }}>GAME TITLE</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Cyberpunk 2077" required
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '16px', color: 'white', fontSize: '1rem', fontWeight: '700', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (OPTIONAL)</label>
                                <input type="url" name="icon_url_external" value={formData.icon_url_external} onChange={handleInputChange} placeholder="GitHub/Imgur link..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', fontWeight: '600', outline: 'none' }} />
                                {formData.icon_url_external && <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>Using External URL (Bypassing Storage)</div>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>GENRE</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '600', outline: 'none' }}>
                                {GAME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                            {['Android', 'iOS', 'Windows', 'Steam', 'PS', 'Xbox'].map(plat => (
                                <button key={plat} type="button" onClick={() => handlePlatformToggle(plat)}
                                    style={{
                                        padding: '0.6rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)',
                                        background: formData.platforms.includes(plat) ? '#8b5cf6' : 'rgba(255,255,255,0.02)',
                                        color: formData.platforms.includes(plat) ? 'black' : 'white',
                                        fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                    }}>
                                    {plat}
                                </button>
                            ))}
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

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}>MAIN DOWNLOAD URL</label>
                        <input type="url" name="download_url" value={formData.download_url} onChange={handleInputChange} placeholder="Direct APK link, Play Store, etc."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: '#8b5cf6', outline: 'none', fontWeight: '600' }} />
                    </div>
                </div>

                {/* ── Hero & Marketing ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Hero Marketing</h3>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>HOMEPAGE SLIDER IMAGE (16:9 BANNER)</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input type="url" name="slider_image_url" value={formData.slider_image_url} onChange={handleInputChange} placeholder="GitHub/Imgur banner link..."
                                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: '#8b5cf6', fontWeight: '700', outline: 'none' }} />
                            {formData.slider_image_url && (
                                <div style={{ width: '80px', height: '45px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                    <img src={formData.slider_image_url} alt="Slider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80x45?text=Error')} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Gamepad2 size={20} color={formData.is_hero ? '#8b5cf6' : 'rgba(255,255,255,0.2)'} fill={formData.is_hero ? '#8b5cf6' : 'none'} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Add to Home Slider</span>
                        </div>
                        <button type="button" onClick={() => handleToggle('is_hero')}
                            style={{
                                width: '44px', height: '24px', borderRadius: '100px', border: 'none',
                                background: formData.is_hero ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                            }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: formData.is_hero ? '23px' : '3px', transition: '0.3s' }} />
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800' }}>DIRECT ICON URL (EXTERNAL)</label>
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
                                const val = formData[fieldName] as string | undefined;
                                return (
                                    <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name={fieldName}
                                                value={val || ''}
                                                onChange={handleInputChange}
                                                placeholder={`URL ${num} (Pinterest)`}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '14px', color: 'white', fontSize: '0.8rem', outline: 'none' }}
                                            />
                                            {(val && (val.includes('pinterest.com') || val.includes('pin.it'))) && (
                                                <button type="button" onClick={() => resolveExternalUrl(val, fieldName)}
                                                    style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <Wand2 size={12} color="#a855f7" />
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

                {/* ── Technical Details ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PACKAGE NAME</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="com.example.game"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                                <button type="button" onClick={handleFetchPlaystore} disabled={loading}
                                    style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0 1rem', borderRadius: '14px', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                                    <Sparkles size={16} /> Magic
                                </button>
                                <button type="button" onClick={handleFetchSecurity} disabled={fetchingSecurity}
                                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0 1rem', borderRadius: '14px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                                    <ShieldCheck size={16} /> Security
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>MIN ANDROID</label>
                            <input type="text" name="min_android_version" value={formData.min_android_version} onChange={handleInputChange} placeholder="6.0+"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SHA256 HASH</label>
                            <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="0123...89ab"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CERTIFICATE SIG</label>
                            <input type="text" name="certificate_signature" value={formData.certificate_signature} onChange={handleInputChange} placeholder="A1:B2..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS (COMMA SEP)</label>
                            <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="Storage, Camera"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>LANGUAGES</label>
                            <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>

                    {/* ── Mirror Registry (Uptodown/Aptoide) ── */}
                    {mirrors.length > 0 && (
                        <div className="glass" style={{ padding: '1rem', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Monitor size={16} color="#8b5cf6" />
                                <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#8b5cf6' }}>COLLECTION SEARCH RESULTS (MIRRORS)</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {mirrors.map((mirror, idx) => (
                                    <div key={idx} style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                        background: formData.download_url === mirror.url ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)', 
                                        padding: '0.75rem 1rem', borderRadius: '16px', 
                                        border: formData.download_url === mirror.url ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                                        transition: 'all 0.2s'
                                    }}>
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, download_url: mirror.url }))}
                                            style={{ display: 'flex', flexDirection: 'column', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', flex: 1 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: formData.download_url === mirror.url ? '#8b5cf6' : 'white' }}>{mirror.name.slice(0, 30)}...</span>
                                            <span style={{ fontSize: '0.65rem', color: formData.download_url === mirror.url ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255,255,255,0.3)', fontWeight: '600' }}>Source: {mirror.source}</span>
                                        </button>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <a href={mirror.url} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.7rem', fontWeight: '800', textDecoration: 'none' }}>Visit</a>
                                            <button type="button" onClick={() => handleCloudMirror(mirror.url)} disabled={mirroring}
                                                style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', border: 'none', color: '#8b5cf6', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                🚀 Cloud Mirror
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Older Versions (Management) ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <History size={20} color="#8b5cf6" />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#8b5cf6', letterSpacing: '1px', textTransform: 'uppercase' }}>Older Versions (History)</h3>
                        </div>
                        <button type="button" onClick={addOlderVersion}
                            style={{ background: 'rgba(139, 92, 246, 0.1)', border: 'none', padding: '8px 16px', borderRadius: '12px', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.7rem', borderRadius: '12px', color: '#8b5cf6', fontWeight: '700', outline: 'none' }} />
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

                {/* ── Collection & Submit ── */}
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
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.1)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Zap size={20} color="#f59e0b" />
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase' }}>Editor's Analysis (Uptodown Style)</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>AUTHORITY VERDICT</label>
                                <textarea name="editors_verdict" value={formData.editors_verdict} onChange={handleInputChange} placeholder="Expert assessment of the game content..."
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
                                <textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="Extreme Graphics, Responsive Controls..."
                                    style={{ width: '100%', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CONS (COMMA SEPARETED)</label>
                                <textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Battery Drain, Large Download..."
                                    style={{ width: '100%', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.9rem', borderRadius: '16px', color: 'white', fontSize: '0.8rem', outline: 'none', minHeight: '60px' }} />
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(61, 220, 132, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <ShieldCheck size={18} color="#3ddc84" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3ddc84' }}>Nexa Game Safety Verified</span>
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
                            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: '900',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
                            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                        }}>
                        <Save size={22} />
                        {loading ? 'Publishing Game...' : 'Publish to Games Portal'}
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
