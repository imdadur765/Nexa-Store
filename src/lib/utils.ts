/**
 * Sanitizes and validates image URLs for Next.js Image component.
 * Prevents "Invalid URL" crashes by ensuring strings start with /, http, or https.
 */
export const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url) return false;
    const trimmed = url.trim();
    if (trimmed.length === 0) return false;

    // Check for common placeholder strings or invalid formats
    if (trimmed.toLowerCase().includes('url for')) return false;
    if (trimmed.toLowerCase().includes('placeholder')) return false;

    return trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://');
};

/**
 * Gets a profile image URL.
 * Falls back to ui-avatars if no avatar_url is present in metadata.
 */
export const getAvatarUrl = (email?: string, metadataAvatarUrl?: string): string => {
    if (metadataAvatarUrl && isValidUrl(metadataAvatarUrl)) {
        return metadataAvatarUrl;
    }

    if (email) {
        // Use an aesthetically pleasing placeholder service
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=3b82f6&color=fff&size=200&bold=true`;
    }

    return `https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200`;
};
