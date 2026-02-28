import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexastore.vercel.app';

    const staticRoutes = [
        '',
        '/apps',
        '/games',
        '/games/all',
        '/games/appstore',
        '/games/console',
        '/games/pc',
        '/games/playstore',
        '/games/trending',
        '/discover',
        '/modules',
        '/search',
        '/tools',
        '/top-charts',
        '/trending',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes];
}
