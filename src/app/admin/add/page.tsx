"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, Image as ImageIcon, Smartphone, Star, Flame, CheckCircle2, Zap } from 'lucide-react';

export default function AddAppPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tools',
        version: '',
        developer: '',
        rating: '4.5',
        age_rating: '4+',
        package_size: '',
        download_url: '',
        github_url: '',
        is_featured: false,
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
        tags: [] as string[],
        // Technical Info
        package_name: '',
        sha256: '',
        certificate_signature: '',
        min_android_version: '6.0+',
        permissions: '',
        languages: 'English'
    });
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Android']);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let iconUrl = '';
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

            const { error } = await supabase
                .from('apps')
                .insert([{
                    ...formData,
                    icon_url: iconUrl,
                    screenshots: uploadedScreenshots,
                    github_url: formData.github_url,
                    rating: parseFloat(formData.rating) || 4.5,
                    downloads: formData.downloads || '0',
                    platforms: selectedPlatforms,
                    is_game: formData.is_game,
                    accent_color: formData.accent_color,
                    hero_image: formData.hero_image,
                    age_rating: formData.age_rating,
                    package_size: formData.package_size,
                    developer: formData.developer,
                    is_hero: formData.is_hero,
                    status: 'approved',
                    priority: parseInt(formData.priority) || 0,
                    tags: formData.tags,
                    // Technical Info
                    package_name: formData.package_name,
                    sha256: formData.sha256,
                    certificate_signature: formData.certificate_signature,
                    min_android_version: formData.min_android_version,
                    permissions: formData.permissions ? formData.permissions.split(',').map(s => s.trim()) : [],
                    languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : ['English']
                }]);

            if (error) throw error;
            alert('✅ App published successfully!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add Application</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Icon Upload Section */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer' }}>
                        <div style={{
                            width: '100%', height: '100%',
                            borderRadius: '22px', overflow: 'hidden',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)'
                        }}>
                            {iconPreview ? (
                                <img src={iconPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                {/* Core Information Group */}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating (e.g. 4.8)</label>
                            <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="4.5"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Age Rating</label>
                            <input type="text" name="age_rating" value={formData.age_rating} onChange={handleInputChange} placeholder="4+, 12+, 18+"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
                        </div>
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
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the app features..." rows={4} required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }} />
                    </div>
                </div>

                {/* ── Technical Details ── */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'white' }}>Technical Details</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PACKAGE NAME</label>
                            <input type="text" name="package_name" value={formData.package_name} onChange={handleInputChange} placeholder="com.example.app"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>MIN ANDROID</label>
                            <input type="text" name="min_android_version" value={formData.min_android_version} onChange={handleInputChange} placeholder="6.0+"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>SHA256 CHECKSUM</label>
                        <input type="text" name="sha256" value={formData.sha256} onChange={handleInputChange} placeholder="Checksum hash..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>CERTIFICATE SIGNATURE</label>
                        <input type="text" name="certificate_signature" value={formData.certificate_signature} onChange={handleInputChange} placeholder="Signature hash..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>PERMISSIONS (COMMA SEPARATED)</label>
                        <input type="text" name="permissions" value={formData.permissions} onChange={handleInputChange} placeholder="INTERNET, CAMERA..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>LANGUAGES (COMMA SEPARATED)</label>
                        <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: 'white', fontWeight: '700', outline: 'none' }} />
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
                                        background: formData.tags.includes(tag.id) ? tag.color : 'rgba(255,255,255,0.05)',
                                        color: formData.tags.includes(tag.id) ? 'black' : 'white',
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

                {/* Media & Version Section */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Media & Version Info</h3>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>What's New</label>
                        <textarea name="whats_new" value={formData.whats_new} onChange={handleInputChange} placeholder="Release notes, bug fixes..." rows={3}
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
                            {screenshotPreviews.map((src, idx) => (
                                <div key={idx} style={{ position: 'relative', minWidth: '80px', height: '120px' }}>
                                    <img src={src} alt="screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--accent-primary)' }} />
                                    <button type="button" onClick={() => removeScreenshot(idx)} style={{
                                        position: 'absolute', top: '-5px', right: '-5px',
                                        background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: '50%',
                                        width: '20px', height: '20px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>×</button>
                                </div>
                            ))}
                        </div>
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
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Is a Game?</span>
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

                <button type="submit" disabled={loading} className="play-btn"
                    style={{ width: '100%', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                    <Save size={20} />
                    {loading ? 'Publishing...' : 'Publish App'}
                </button>
            </form>
        </div>
    );
}
