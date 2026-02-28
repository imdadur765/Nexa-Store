import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";

type Props = {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    // Fetch directly from DB as hooks can't be used in generateMetadata
    const { data: appData } = await supabase
        .from('apps')
        .select('name, description, category, tags, is_hero, icon_url_external, screenshots')
        .eq('id', id)
        .single();

    if (!appData) {
        return {
            title: 'App Not Found | Nexa Store',
            description: 'The requested application could not be found.',
        };
    }

    const appName = appData.name;
    const shortDesc = appData.description.substring(0, 150) + (appData.description.length > 150 ? '...' : '');
    const iconUrl = appData.icon_url_external || '/assets/default-icon.png';
    const screenshot = Array.isArray(appData.screenshots) && appData.screenshots.length > 0
        ? appData.screenshots[0]
        : iconUrl;

    return {
        title: `${appName} - Free Download | Nexa Store`,
        description: shortDesc,
        keywords: [appName, appData.category, ...(appData.tags || []), 'download', 'free', 'nexa store'],
        openGraph: {
            title: `${appName} | Nexa Store`,
            description: shortDesc,
            images: [
                {
                    url: appData.is_hero ? screenshot : iconUrl,
                    width: appData.is_hero ? 1280 : 512,
                    height: appData.is_hero ? 720 : 512,
                    alt: `${appName} cover`,
                },
            ],
            type: 'website',
            siteName: 'Nexa Store',
        },
        twitter: {
            card: appData.is_hero ? 'summary_large_image' : 'summary',
            title: `${appName} Download`,
            description: shortDesc,
            images: [appData.is_hero ? screenshot : iconUrl],
        },
    };
}

export default function AppLayout({ children }: Props) {
    return <>{children}</>;
}
