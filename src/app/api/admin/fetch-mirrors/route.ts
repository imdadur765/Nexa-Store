import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const packageName = searchParams.get('id');

    if (!packageName) {
        return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    const mirrors: { source: string; name: string; url: string; isDirect?: boolean }[] = [];

    const fetchSource = async (url: string) => {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            });
            return res.ok ? await res.text() : null;
        } catch (e) {
            return null;
        }
    };

    const tasks = [
        // 1. APKPure Direct Snipe (Top Priority)
        async () => {
            mirrors.push({
                source: 'APKPure (Direct)',
                name: 'Verified APK Link',
                url: `https://d.apkpure.net/b/APK/${packageName}?version=latest`,
                isDirect: true
            });
        },

        // 2. Aptoide (Official API - Native Direct Pool Link)
        async () => {
            try {
                const res = await fetch(`https://ws75.aptoide.com/api/7/app/get/package_name=${packageName}`);
                if (res.ok) {
                    const data = await res.json();
                    const directApkUrl = data.nodes?.meta?.data?.file?.path;
                    if (directApkUrl) {
                        mirrors.push({
                            source: 'Aptoide (Verified Tool)',
                            name: 'Native Pool APK',
                            url: directApkUrl,
                            isDirect: true // 100% Direct APK Link
                        });
                    }
                }
            } catch (e) {
                console.error("Aptoide API Mirror Error:", e);
            }
        },

        // 3. APK-DL (Reliable Backup)
        async () => {
             mirrors.push({
                 source: 'APK-DL',
                 name: 'Clean Mirror',
                 url: `https://apk-dl.com/${packageName}`,
                 isDirect: true
             });
        },

        // 4. Google Play (Official Reference)
        async () => {
            mirrors.push({ 
                source: 'Google Play', 
                name: 'Official Store', 
                url: `https://play.google.com/store/apps/details?id=${packageName}`, 
                isDirect: true 
            });
        }
    ];

    await Promise.all(tasks.map(t => t()));

    return NextResponse.json({ 
        packageName,
        mirrors: mirrors.sort((a, b) => (b.isDirect ? 1 : 0) - (a.isDirect ? 1 : 0)) // Direct links first
    });
}
