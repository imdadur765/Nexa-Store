export interface GitHubRepo {
    name: string;
    description: string;
    stargazers_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
}

export interface GitHubRelease {
    tag_name: string;
    published_at: string;
    assets: Array<{
        name: string;
        browser_download_url: string;
        size: number;
    }>;
}

const GITHUB_API_BASE = "https://api.github.com/repos";

/**
 * Fetches basic repository information from GitHub
 */
export async function fetchRepoData(repoPath: string): Promise<GitHubRepo | null> {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${repoPath}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching GitHub repo:", error);
        return null;
    }
}

/**
 * Fetches the latest release info for a repository
 */
export async function fetchLatestRelease(repoPath: string): Promise<GitHubRelease | null> {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${repoPath}/releases/latest`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching latest release:", error);
        return null;
    }
}

/**
 * Fetches the README content for a repository
 */
export async function fetchReadme(repoPath: string): Promise<string | null> {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/${repoPath}/readme`, {
            headers: { 'Accept': 'application/vnd.github.raw' }
        });
        if (!response.ok) return null;
        return await response.text();
    } catch (error) {
        console.error("Error fetching README:", error);
        return null;
    }
}

/**
 * Parses a GitHub URL to get the 'owner/repo' path
 */
export function parseGitHubUrl(url: string): string | null {
    try {
        const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (!match) return null;
        // Clean up if it has .git at the end or extra paths
        return match[1].replace(/\.git$/, "").split('/').slice(0, 2).join('/');
    } catch {
        return null;
    }
}
