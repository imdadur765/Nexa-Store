import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
    const { mirrorUrl, packageName } = await request.json();

    if (!mirrorUrl || !packageName) {
        return NextResponse.json({ error: 'Mirror URL and Package Name are required' }, { status: 400 });
    }

    // Check for GitHub credentials
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'imdadur765';
    const repo = process.env.GITHUB_REPO || 'Nexa-Store';

    if (!token) {
        return NextResponse.json({ error: 'GitHub Token is missing in environment variables. Please add GITHUB_TOKEN to .env.local' }, { status: 500 });
    }

    try {
        console.log(`Cloud-Mirroring: ${packageName} from ${mirrorUrl}`);

        // 1. Extract direct .apk link
        const directLink = await extractDirectApkLink(mirrorUrl);
        if (!directLink) {
            throw new Error('Could not find a direct APK link from this mirror.');
        }

        // 2. Fetch the APK into memory (Buffer) - Nexa Server acts as the bridge
        console.log(`Downloading APK from mirror: ${directLink}`);
        const apkRes = await fetch(directLink, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }
        });

        if (!apkRes.ok) throw new Error(`Failed to download APK from mirror: ${apkRes.statusText}`);
        const apkBuffer = Buffer.from(await apkRes.arrayBuffer());
        const fileSize = apkBuffer.length;

        // 3. Find or Create a "Nexa-Mirrors" Release on GitHub
        console.log(`Uploading to GitHub: ${owner}/${repo}`);
        const fileName = `${packageName}-${Date.now()}.apk`;

        // 3a. Get/Create release ID
        const releaseId = await getOrCreateRelease(owner, repo, token);

        // 3b. Upload asset to that release
        const uploadUrl = `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${fileName}`;
        
        const uploadRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Length': fileSize.toString(),
            },
            body: apkBuffer
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(`GitHub Upload Failed: ${err.message || 'Unknown error'}`);
        }

        const assetData = await uploadRes.json();
        const directDownloadUrl = assetData.browser_download_url;

        return NextResponse.json({ 
            success: true, 
            directDownloadUrl, 
            fileName,
            size: (fileSize / (1024 * 1024)).toFixed(2) + ' MB'
        });

    } catch (error: any) {
        console.error('Cloud Mirror Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Aggressive Link Extractor
 * Follows redirects and parses HTML pages for hidden download buttons
 */
async function extractDirectApkLink(url: string): Promise<string | null> {
    // Fast-Pass for verified direct patterns (APKPure/Aptoide Direct)
    if (url.includes('d.apkpure.net') || url.includes('pool.apk.aptoide.com') || url.includes('/download')) {
        return url;
    }

    let currentUrl = url;
    const maxRedirects = 8;
    const headers = { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    };

    for (let i = 0; i < maxRedirects; i++) {
        try {
            console.log(`[Aggressive] Checking: ${currentUrl}`);
            const response = await fetch(currentUrl, { method: 'GET', headers, redirect: 'follow' });
            
            const contentType = response.headers.get('content-type') || '';
            const finalUrl = response.url;

            // 1. Success! We found a raw APK stream
            if (contentType.includes('application/vnd.android.package-archive') || finalUrl.endsWith('.apk')) {
                return finalUrl;
            }

            // 2. We landed on a webpage, let's look for a "Download Now" button or Meta-Refresh
            const html = await response.text();
            const $ = cheerio.load(html);
            
            // Check for Meta-Refresh (Common on landing pages)
            const metaRefresh = $('meta[http-equiv="refresh"]').attr('content');
            if (metaRefresh) {
                const match = metaRefresh.match(/url=(.+)$/i);
                if (match && match[1]) {
                    currentUrl = match[1].startsWith('http') ? match[1] : new URL(match[1], finalUrl).href;
                    continue;
                }
            }

            let foundButtonUrl = '';

            // Common selectors for download buttons across stores
            const selectors = ['a', 'button#detail-download-button', 'button.download', '#download-button'];
            $(selectors.join(',')).each((_i, el) => {
                const element = $(el);
                const href = element.attr('href') || element.attr('data-url');
                const text = element.text().toLowerCase();
                const cls = (element.attr('class') || '').toLowerCase();
                const id = (element.attr('id') || '').toLowerCase();

                if (!href || href.startsWith('javascript') || href === '#') return;

                // Priority check: Is it a direct APK link or a high-probability download button?
                if (href.endsWith('.apk') || 
                    (text.includes('click here') || text.includes('restart') || text.includes('here')) ||
                    (text.includes('download') && (text.includes('apk') || text.includes('latest'))) ||
                    (cls.includes('download') && cls.includes('button')) ||
                    (id === 'download-button' || id.includes('download'))) {
                    
                    foundButtonUrl = href.startsWith('http') ? href : new URL(href, finalUrl).href;
                    // If it's a "click here" link, it's very likely the direct file, so we break early
                    if (text.includes('click here') || href.endsWith('.apk')) return false;
                }
            });

            if (foundButtonUrl && foundButtonUrl !== currentUrl) {
                currentUrl = foundButtonUrl;
                continue;
            }

            break;
        } catch (e) { break; }
    }
    return (currentUrl.includes('.apk')) ? currentUrl : null;
}

/**
 * GitHub Release Helper
 */
async function getOrCreateRelease(owner: string, repo: string, token: string): Promise<number> {
    const tag = 'mirrors';
    
    // Check if release exists
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });

    if (checkRes.ok) {
        const data = await checkRes.json();
        return data.id;
    }

    // Create new release
    const createRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tag_name: tag,
            name: 'Nexa Store Cloud Mirrors',
            body: 'Automated mirrors for Nexa Store apps. DO NOT DELETE.',
            draft: false,
            prerelease: false
        })
    });

    if (!createRes.ok) throw new Error('Failed to create GitHub release');
    const data = await createRes.json();
    return data.id;
}
