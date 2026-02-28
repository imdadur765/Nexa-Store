import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Fetch the URL, following redirects
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            },
            redirect: 'follow'
        });

        const contentType = response.headers.get('content-type') || '';

        // If it's already an image, just return it
        if (contentType.startsWith('image/')) {
            return NextResponse.json({ imageUrl: url });
        }

        const html = await response.text();

        // Extract og:image (standard for social sharing)
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        // Extract twitter:image
        const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
        // Extract Pinterest specific pin image if needed
        const pinImageMatch = html.match(/["']image["']\s*:\s*["']([^"']+)["']/i);

        let imageUrl = ogImageMatch ? ogImageMatch[1] : (twitterImageMatch ? twitterImageMatch[1] : (pinImageMatch ? pinImageMatch[1] : null));

        // If it's a Pinterest link and we found an image URL, let's make sure it's high quality
        if (imageUrl && imageUrl.includes('pinimg.com')) {
            // Convert any smaller sizes to 736x if possible
            imageUrl = imageUrl.replace(/\/(170x170|236x|474x)\//, '/736x/');
        }

        if (imageUrl) {
            // Ensure the URL is absolute
            if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
            if (imageUrl.startsWith('/')) {
                const targetUrl = new URL(url);
                imageUrl = targetUrl.protocol + '//' + targetUrl.host + imageUrl;
            }

            return NextResponse.json({ imageUrl });
        } else {
            return NextResponse.json({ error: 'Could not find a preview image on this page. Please try Copying the Image Address directly.' }, { status: 404 });
        }
    } catch (error: any) {
        console.error('Resolution Error:', error);
        return NextResponse.json({ error: 'Failed to connect to the provided URL. Make sure it is valid.' }, { status: 500 });
    }
}
