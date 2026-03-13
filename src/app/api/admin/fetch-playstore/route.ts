import { NextRequest, NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const packageName = searchParams.get('id');

    if (!packageName) {
        return NextResponse.json({ error: 'Package ID (id) is required' }, { status: 400 });
    }

    try {
        console.log(`Fetching data for package: ${packageName}`);
        const appData = await gplay.app({ appId: packageName });

        if (!appData) {
            return NextResponse.json({ error: 'App not found on Play Store' }, { status: 404 });
        }

        // Map relevant data for Nexa Store
        const mappedData = {
            name: appData.title,
            description: appData.description,
            category: appData.genre, // Using raw genre directly (e.g., 'Action', 'Productivity')
            genreId: appData.genreId,
            icon: appData.icon,
            hero_image: appData.headerImage,
            screenshots: appData.screenshots.slice(0, 4),
            developer: appData.developer,
            rating: appData.scoreText || String(appData.score),
            package_size: appData.size,
            whats_new: appData.recentChanges || 'Latest stable version',
            min_android_version: appData.androidVersionText || 'Varies with device',
            price: appData.priceText || 'Free',
            is_game: appData.genreId?.startsWith('GAME_') || false,
            package_name: packageName,
            screenshots_external: appData.screenshots.slice(0, 4).join(','), // CSV for convenience
            version: appData.version !== 'VARY' ? appData.version : '1.0.0'
        };

        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error('Play Store Fetch Error:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch from Play Store. Make sure the package name is correct.', 
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Maps Play Store genres to Nexa Store categories
 */
function mapCategory(genre: string): string {
    const genreUpper = (genre || '').toUpperCase();
    
    if (genreUpper.includes('PRODUCTIVITY')) return 'Productivity';
    if (genreUpper.includes('SOCIAL')) return 'Social';
    if (genreUpper.includes('ENTERTAINMENT')) return 'Entertainment';
    if (genreUpper.includes('FINANCE')) return 'Finance';
    if (genreUpper.includes('EDUCATION')) return 'Education';
    if (genreUpper.includes('MUSIC')) return 'Music';
    if (genreUpper.includes('PHOTOGRAPHY')) return 'Photography';
    if (genreUpper.includes('NEWS')) return 'News';
    if (genreUpper.includes('SHOPPING')) return 'Shopping';
    if (genreUpper.includes('LIFESTYLE')) return 'Lifestyle';
    if (genreUpper.includes('HEALTH')) return 'Health';
    if (genreUpper.includes('SYSTEM')) return 'System';
    if (genreUpper.includes('TOOL')) return 'Tools';
    if (genreUpper.includes('GAME')) return 'Games';
    
    return 'Tools'; // Fallback
}
