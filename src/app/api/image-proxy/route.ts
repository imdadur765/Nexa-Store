import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('URL is required', { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Impersonate a standard browser hitting it directly
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // Explicitly send nothing or a null referer to bypass hotlink checks
                'Referer': '' 
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
                // Enable CORS so the `<img src="..."/>` can load it without throwing security errors
                'Access-Control-Allow-Origin': '*'
            },
        });
    } catch (error) {
        console.error('Image proxy error for', url, error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
}
