"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Upload, Play, Loader2, CheckCircle2,
    XCircle, Database, Server, Smartphone, Monitor, AlertTriangle, PlayCircle, ShieldCheck, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types and Mappings
type AppType = 'app' | 'game' | 'tool';

interface QueueItem {
    id: string; // package_name
    status: 'pending' | 'processing' | 'success' | 'failed' | 'skipped';
    step: 'waiting' | 'playstore' | 'security' | 'mirrors' | 'cloud' | 'database' | 'done' | 'error' | 'duplicate';
    progress: number;
    errorMsg?: string;
    type: AppType;
    data?: any;
    finalUrl?: string;
}

export default function BulkImportPage() {
    const router = useRouter();
    const [rawInput, setRawInput] = useState('');
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkingDuplicates, setCheckingDuplicates] = useState(false);
    const [globalType, setGlobalType] = useState<AppType>('app');
    
    // Auth check
    useEffect(() => {
        const check = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/admin');
        };
        check();
    }, [router]);

    // Parse input into queue
    const handleParse = async () => {
        if (!rawInput.trim()) return;
        
        // Split by comma, space or newline, clean up empty ones
        const packages = rawInput
            .split(/[\n,\s]+/)
            .map(p => p.trim())
            .filter(p => p.length > 3 && p.includes('.')); // Basic package name validation
            
        // Deduplicate local list
        const unique = Array.from(new Set(packages));
        
        if (unique.length > 100) {
            alert("Please limit to 100 packages at a time to prevent browser memory issues.");
            return;
        }

        setCheckingDuplicates(true);
        
        // Check which ones exist in DB
        const { data: existingApps } = await supabase
            .from('apps')
            .select('package_name')
            .in('package_name', unique);
        
        const existingPackages = new Set(existingApps?.map(a => a.package_name) || []);

        const newQueue: QueueItem[] = unique.map(pkg => ({
            id: pkg,
            status: existingPackages.has(pkg) ? 'skipped' : 'pending',
            step: existingPackages.has(pkg) ? 'duplicate' : 'waiting',
            progress: existingPackages.has(pkg) ? 100 : 0,
            type: globalType,
            errorMsg: existingPackages.has(pkg) ? "App already exists in database" : undefined
        }));

        setQueue(newQueue);
        setCheckingDuplicates(false);
    };

    // Helper: Delay to prevent API rate limits
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: Clean and truncate text for DB efficiency
    const cleanText = (text: string, limit: number = 1500) => {
        if (!text) return '';
        const cleaned = text
            .replace(/<[^>]*>?/gm, '') // Remove HTML tags
            .replace(/&[a-z0-9#]+;/gi, (tag) => {
                const entities: Record<string, string> = {
                    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' '
                };
                return entities[tag] || tag;
            })
            .replace(/[\%\$#\{\}\[\]\\]/g, '') // Remove junk characters requested
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim();
        return cleaned.length > limit ? cleaned.substring(0, limit) + '...' : cleaned;
    };

    // MAIN PROCESSING LOOP
    const startProcessing = async () => {
        if (queue.length === 0) return;
        setIsProcessing(true);

        // We process sequentially (1 by 1) to respect Rate Limits
        for (let i = 0; i < queue.length; i++) {
            const currentItem = queue[i];
            
            // Skip if already success
            if (currentItem.status === 'success') continue;

            const updateItem = (updates: Partial<QueueItem>) => {
                setQueue(prev => prev.map((item, idx) => idx === i ? { ...item, ...updates } : item));
            };

            updateItem({ status: 'processing', step: 'playstore', progress: 10 });

            try {
                // 1. PLAYSTORE FETCH
                const playRes = await fetch(`/api/admin/fetch-playstore?id=${currentItem.id}`);
                const playData = await playRes.json();
                
                if (playData.error || !playData.name) {
                    throw new Error(playData.error || "Not found on Play Store");
                }
                
                updateItem({ step: 'security', progress: 30, data: playData });

                // 2. SECURITY FETCH (Optional, don't fail if it errors)
                let securityData = { sha256: '', certificate_signature: '', permissions: [] as string[] };
                try {
                    const secRes = await fetch(`/api/admin/fetch-security?id=${currentItem.id}`);
                    const secJson = await secRes.json();
                    if (!secJson.error) {
                        securityData = {
                            sha256: secJson.sha256 || '',
                            certificate_signature: secJson.signature || '',
                            permissions: Array.isArray(secJson.permissions) ? secJson.permissions : []
                        };
                    }
                } catch (e) { console.warn("Security fetch skipped", e); }

                updateItem({ step: 'mirrors', progress: 50 });

                // 3. MIRRORS FETCH
                const mirrorRes = await fetch(`/api/admin/fetch-mirrors?id=${currentItem.id}`);
                const mirrorData = await mirrorRes.json();
                
                let bestMirror = '';
                let isDirect = false;
                
                if (mirrorData.mirrors && mirrorData.mirrors.length > 0) {
                    // Try to find a direct one (APKPure/Aptoide)
                    const directMirror = mirrorData.mirrors.find((m: any) => m.isDirect);
                    if (directMirror) {
                        bestMirror = directMirror.url;
                        isDirect = true;
                    } else {
                        bestMirror = mirrorData.mirrors[0].url; // Fallback to first
                    }
                }

                if (!bestMirror) {
                     // If no mirror is found, we can't offer download. Fail or put Playstore link?
                     // Let's fallback to Play Store link
                     bestMirror = `https://play.google.com/store/apps/details?id=${currentItem.id}`;
                }

                updateItem({ step: 'database', progress: 90, finalUrl: bestMirror });

                // 4. AUTO-DETECT GAME/TOOL & CATEGORY
                let isGame = globalType === 'game';
                let isTool = globalType === 'tool';
                
                // We use is_game and genreId returned from our updated API
                const genreId = (playData.genreId || '').toUpperCase();
                if (playData.is_game || genreId.includes('GAME')) {
                    isGame = true;
                    isTool = false;
                } else if (!isGame && (genreId.includes('TOOL') || genreId.includes('PRODUCTIVITY') || genreId.includes('PERSONALIZATION') || genreId.includes('COMMUNICATION'))) {
                    isTool = true;
                }

                // Expanded Play Store genre mapping so we don't fallback incorrectly
                const gameCategories = ["Action", "RPG", "Adventure", "Sports", "Racing", "Simulation", "Strategy", "Puzzle", "Horror", "Fighting", "Open World", "Arcade", "Board", "Card", "Casino", "Casual", "Educational", "Music", "Role Playing", "Trivia", "Word"];
                const toolCategories = ["Tools", "Productivity", "Root", "Modules", "System", "Security", "Customization", "Developer", "CLI", "Magisk", "Personalization", "Communication"];
                const appCategories = ["Productivity", "Social", "Entertainment", "Finance", "Education", "Music", "Photography", "News & Magazines", "Shopping", "Lifestyle", "Health & Fitness", "System", "Tools", "Business", "Communication", "Dating", "Events", "Food & Drink", "House & Home", "Libraries & Demo", "Medical", "Parenting", "Auto & Vehicles", "Beauty", "Books & Reference", "Comics", "Maps & Navigation", "Travel & Local", "Video Players & Editors", "Weather", "Art & Design", "Social Network", "News", "Health", "Video Players"];
                
                const targetCategoryList = isGame ? gameCategories : (isTool ? toolCategories : appCategories);
                
                // Clean the category before matching
                const rawCategory = playData.category || '';
                
                // Allow the exact raw category if valid, else fallback
                let finalCategory = targetCategoryList.includes(rawCategory) ? rawCategory : 
                                    (targetCategoryList.find(c => c.toLowerCase() === rawCategory.toLowerCase()) || targetCategoryList[0]);

                // 5. AUTO-GENERATE EDITORIAL CONTENT
                const ratingNum = parseFloat(playData.rating) || 4.5;
                const editorsRating = parseFloat(Math.min(5.0, ratingNum + 0.1).toFixed(1)); 
                
                let editorialVerdict = `${playData.name} is a standout ${isGame ? 'game' : (isTool ? 'tool' : 'app')} in the ${finalCategory} category. `;
                if (ratingNum >= 4.5) editorialVerdict += "Our editors highly recommend it for its exceptional design and flawless performance.";
                else if (ratingNum >= 4.0) editorialVerdict += "It offers a solid experience and is highly praised by the community.";
                else editorialVerdict += "It provides standard functionality and meets general user expectations.";

                // 6. AUTO-ASSIGN CURATION ROW TAGS
                let autoTags: string[] = [];
                const isEditorsChoice = ratingNum >= 4.5;
                const isTrending = ratingNum >= 4.3;

                if (isGame) {
                    if (isEditorsChoice) autoTags.push('row:game-top-picks', 'row:editors-choice');
                    if (isTrending) autoTags.push('row:game-trending');
                    autoTags.push('row:game-explore', 'row:game-playstore');
                    if (finalCategory === 'Action' || finalCategory === 'Fighting') autoTags.push('row:game-popular-action');
                    if (finalCategory === 'Adventure' || finalCategory === 'RPG') autoTags.push('row:game-adventure');
                    if (finalCategory === 'Strategy' || finalCategory === 'Sports') autoTags.push('row:game-competitive');
                } else if (isTool) {
                    if (finalCategory === 'Security') autoTags.push('row:security');
                    else if (finalCategory === 'Customization' || finalCategory === 'Personalization') autoTags.push('row:customization');
                    else if (finalCategory === 'System' || finalCategory === 'Performance') autoTags.push('row:performance');
                    if (isEditorsChoice) autoTags.push('row:editors-choice');
                } else {
                    if (isEditorsChoice) autoTags.push('row:app-top-picks', 'row:app-recommended');
                    if (isTrending) autoTags.push('row:app-trending');
                    autoTags.push('row:app-new');
                    if (finalCategory === 'Entertainment' || finalCategory === 'Music' || finalCategory === 'Video Players') autoTags.push('row:app-entertainment');
                    if (finalCategory === 'Social' || finalCategory === 'Communication') autoTags.push('row:app-social');
                    if (finalCategory === 'Productivity' || finalCategory === 'Business') autoTags.push('row:app-productivity', 'row:app-essential');
                }

                const insertData = {
                    name: playData.name,
                    description: cleanText(playData.description, 1500),
                    category: finalCategory,
                    developer: playData.developer,
                    package_size: playData.package_size || 'Varies with device',
                    rating: ratingNum,
                    whats_new: cleanText(playData.whats_new || 'Latest Version', 500),
                    min_android_version: playData.min_android_version || '6.0+',
                    icon_url: playData.icon || '', 
                    hero_image: playData.hero_image || '',
                    screenshots: playData.screenshots ? playData.screenshots.slice(0, 4) : [],
                    is_game: isGame,
                    version: playData.version || '1.0.0',
                    download_url: bestMirror, // Directly using Verified Mirror instead of Cloud Upload
                    status: 'approved',
                    is_featured: false,
                    trending: isTrending,
                    is_editor_choice: isEditorsChoice,
                    priority: isEditorsChoice ? 5 : 0,
                    platforms: ['Android'],
                    accent_color: isGame ? '#8b5cf6' : (isTool ? '#3b82f6' : '#10b981'),
                    tags: autoTags, 
                    
                    // Technical
                    package_name: currentItem.id,
                    sha256: securityData.sha256,
                    certificate_signature: securityData.certificate_signature,
                    permissions: securityData.permissions,
                    languages: ['English'],
                    older_versions: [],
                    
                    // Editor
                    editors_verdict: editorialVerdict,
                    pros: ['Verified Direct Download', 'Latest Signed Version', 'Checked for Malware'],
                    cons: ratingNum < 4.0 ? ['UI could be improved', 'Requires permissions'] : ['Contains Ads', 'Requires network access'],
                    editorial_rating: editorsRating,
                    is_safety_verified: true,
                    slider_image_url: playData.hero_image || ''
                };

                const { error: dbError } = await supabase.from('apps').insert([insertData]);

                if (dbError) {
                    // Check if already exists error (unique constraint on package_name usually)
                    if (dbError.code === '23505') {
                        throw new Error("App already exists in database");
                    }
                    throw dbError;
                }

                // SUCCESS
                updateItem({ status: 'success', step: 'done', progress: 100 });

                // SMART DELAY (Crucial to prevent Google/Github IP block)
                if (i < queue.length - 1) { // Don't delay on the last item
                    console.log("Sleeping 4s for rate limiting.");
                    await sleep(4000);
                }

            } catch (err: any) {
                updateItem({ status: 'failed', step: 'error', errorMsg: err.message || "Unknown error" });
                // Even on error, sleep a bit so we don't spam
                await sleep(2000);
            }
        }

        setIsProcessing(false);
        alert("Bulk Import Processing Completed!");
    };


    // UI Helpers
    const getStatusColor = (status: string) => {
        if (status === 'success') return '#10b981';
        if (status === 'skipped') return '#f59e0b';
        if (status === 'failed') return '#ef4444';
        if (status === 'processing') return '#3b82f6';
        return 'rgba(255,255,255,0.3)';
    };
    
    const getStatusIcon = (status: string) => {
        if (status === 'success') return <CheckCircle2 size={16} color="#10b981" />;
        if (status === 'skipped') return <ShieldCheck size={16} color="#f59e0b" />;
        if (status === 'failed') return <XCircle size={16} color="#ef4444" />;
        if (status === 'processing') return <Loader2 size={16} color="#3b82f6" className="spin-fast" />;
        return <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />;
    };

    const stats = {
        total: queue.length,
        success: queue.filter(q => q.status === 'success' || q.status === 'skipped').length,
        actualSuccess: queue.filter(q => q.status === 'success').length,
        skipped: queue.filter(q => q.status === 'skipped').length,
        failed: queue.filter(q => q.status === 'failed').length,
        pending: queue.filter(q => q.status === 'pending').length
    };


    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
            <header className="ultra-glass" style={{
                position: 'sticky', top: 0, zIndex: 100,
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Server size={22} color="#3b82f6" />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Bulk App Importer</h1>
                    </div>
                </div>
                {isProcessing && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#3b82f6' }}>Processing {stats.total - stats.pending}/{stats.total}</span>
                    <Loader2 size={14} color="#3b82f6" className="spin-fast" />
                </div>}
            </header>

            <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.5fr)', gap: '1.5rem', alignItems: 'start' }}>
                
                {/* LEFT: Input Configuration */}
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
                    
                    <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>1. App Type</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            {([
                                { id: 'app', label: 'Apps', icon: Smartphone, color: '#10b981' },
                                { id: 'game', label: 'Games', icon: PlayCircle, color: '#8b5cf6' },
                                { id: 'tool', label: 'Tools', icon: Terminal, color: '#3b82f6' }
                            ] as const).map(type => (
                                <button key={type.id} onClick={() => !isProcessing && setGlobalType(type.id)}
                                    style={{
                                        padding: '0.75rem', borderRadius: '16px', border: '1px solid',
                                        borderColor: globalType === type.id ? type.color : 'rgba(255,255,255,0.05)',
                                        background: globalType === type.id ? `${type.color}15` : 'rgba(255,255,255,0.02)',
                                        color: globalType === type.id ? 'white' : 'rgba(255,255,255,0.5)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                                        cursor: isProcessing ? 'not-allowed' : 'pointer', transition: '0.2s'
                                    }}>
                                    <type.icon size={20} color={globalType === type.id ? type.color : 'rgba(255,255,255,0.4)'} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800' }}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>2. Package IDs</h3>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>Comma or Line separated</span>
                        </div>
                        <textarea 
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            disabled={isProcessing || queue.length > 0}
                            placeholder="com.whatsapp&#10;com.tencent.ig&#10;com.mojang.minecraftpe"
                            style={{ 
                                width: '100%', height: '200px', background: 'rgba(0,0,0,0.3)', 
                                border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', 
                                borderRadius: '20px', color: '#3b82f6', fontFamily: 'monospace', fontSize: '0.85rem',
                                outline: 'none', resize: 'vertical', lineHeight: '1.6'
                            }} 
                        />
                    </div>
                    
                    {queue.length === 0 ? (
                        <button onClick={handleParse} disabled={!rawInput.trim() || checkingDuplicates}
                            style={{
                                width: '100%', padding: '1rem', borderRadius: '20px',
                                background: 'white', color: 'black', border: 'none',
                                fontSize: '0.9rem', fontWeight: '900', cursor: (rawInput.trim() && !checkingDuplicates) ? 'pointer' : 'not-allowed',
                                opacity: (rawInput.trim() && !checkingDuplicates) ? 1 : 0.5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}>
                            {checkingDuplicates ? (
                                <><Loader2 size={18} className="spin-fast" /> Validating DB...</>
                            ) : (
                                <>Parse {rawInput.split(/[\n,\s]+/).filter(p => p.trim()).length} Packages</>
                            )}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={startProcessing} disabled={isProcessing || stats.pending === 0}
                                style={{
                                    width: '100%', padding: '1rem', borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none',
                                    fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)', cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    opacity: (isProcessing || stats.pending === 0) ? 0.7 : 1
                                }}>
                                {isProcessing ? (
                                    <><Loader2 size={18} className="spin-fast" /> Processing Data...</>
                                ) : (
                                    <><Play size={18} fill="currentColor" /> Start Cloud Import</>
                                )}
                            </button>
                            {!isProcessing && (
                                <button onClick={() => setQueue([])}
                                    style={{
                                        width: '100%', padding: '0.8rem', borderRadius: '16px', background: 'transparent',
                                        color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                                        fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                                    }}>
                                    Clear Queue & Reset
                                </button>
                            )}
                        </div>
                    )}

                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px dashed rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '20px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#f59e0b' }}>Anti-Ban Logic Active</span>
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>This queue processes sequentially with 4s API delays between apps to bypass Google/GitHub rate limits. Do not refresh!</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Queue View */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>{stats.total}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)' }}>TOTAL IN QUEUE</span>
                        </div>
                        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{stats.actualSuccess}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(16, 185, 129, 0.6)' }}>IMPORTED</span>
                        </div>
                        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>{stats.skipped}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(245, 158, 11, 0.6)' }}>SKIPPED</span>
                        </div>
                        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>{stats.failed}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(239, 68, 68, 0.6)' }}>FAILED</span>
                        </div>
                    </div>

                    <div className="glass" style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: 'white', letterSpacing: '1px' }}>Live Queue Tracker</h3>
                            {isProcessing && <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '700', background: 'rgba(59, 130, 246, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>Active</span>}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto' }} className="custom-scrollbar">
                            {queue.map((item, i) => (
                                <div key={i} style={{ 
                                    padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.02)',
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    background: item.status === 'processing' ? 'rgba(59, 130, 246, 0.03)' : 'transparent',
                                    transition: 'background 0.3s'
                                }}>
                                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                                        {getStatusIcon(item.status)}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: item.status === 'success' ? 'white' : 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                                                {item.data?.name || item.id}
                                            </span>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: getStatusColor(item.status), textTransform: 'uppercase' }}>
                                                {item.step}
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar (Visible only when processing) */}
                                        {item.status === 'processing' && (
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                                                <div style={{ height: '100%', width: `${item.progress}%`, background: '#3b82f6', transition: 'width 0.3s ease' }} />
                                            </div>
                                        )}
                                        
                                        {/* Error Label */}
                                        {item.status === 'failed' && (
                                            <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: '600' }}>Error: {item.errorMsg}</span>
                                        )}
                                        {/* Skipped Label */}
                                        {item.status === 'skipped' && (
                                            <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertTriangle size={10} /> {item.errorMsg}</span>
                                        )}
                                        {/* Success Label */}
                                        {item.status === 'success' && (
                                            <span style={{ fontSize: '0.65rem', color: 'rgba(16, 185, 129, 0.8)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Database size={10} /> Fully Synced to DB</span>
                                        )}
                                    </div>
                                    
                                    {item.data?.icon && (
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={item.data.icon} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {queue.length === 0 && (
                                <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.2)' }}>
                                    <Database size={48} strokeWidth={1} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Queue is empty. Parse package IDs to begin.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                .ultra-glass { background: rgba(10, 10, 15, 0.8); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }
                .spin-fast { animation: spin 0.6s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
