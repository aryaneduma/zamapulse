
import { API_BASE_URL, MAX_SEARCH_PAGES } from '../constants';
import { ApiResponse, ZamaUser } from '../types';

/**
 * Searches for a user within a specific timeframe by paginating through the leaderboard.
 * 
 * @param username The username to search for (case insensitive)
 * @param timeframe The timeframe to search in ('24h', '7d', '30d')
 * @param onProgress Callback to update progress percentage
 * @returns The found user object or null
 */
export const searchUserInTimeframe = async (
    username: string, 
    timeframe: string, 
    onProgress: (percent: number) => void
): Promise<ZamaUser | null> => {
    
    const cleanUser = username.toLowerCase().replace('@', '').trim();
    
    for (let page = 1; page <= MAX_SEARCH_PAGES; page++) {
        try {
            // Update progress based on page number relative to max pages
            const percent = Math.round((page / MAX_SEARCH_PAGES) * 100);
            onProgress(percent);

            const response = await fetch(`${API_BASE_URL}?timeframe=${timeframe}&sortBy=mindshare&page=${page}`);
            
            if (!response.ok) {
                console.warn(`API Error for ${timeframe} on page ${page}: ${response.statusText}`);
                continue; 
            }

            let json: ApiResponse;
            try {
                json = await response.json();
            } catch (e) {
                console.warn(`Invalid JSON response for ${timeframe} on page ${page}`);
                continue;
            }

            if (json && json.success && Array.isArray(json.data)) {
                const user = json.data.find((u: ZamaUser) => 
                    u.username.toLowerCase() === cleanUser || 
                    u.displayName.toLowerCase().includes(cleanUser)
                );

                if (user) {
                    return user;
                }
            } else {
                break;
            }

        } catch (error) {
            console.error(`Fetch error in ${timeframe}:`, error);
        }
    }

    return null;
};

/**
 * Fetches a specific page of the leaderboard.
 * 
 * @param timeframe The timeframe to fetch ('24h', '7d', '30d', 'all')
 * @param page The page number (1-indexed)
 */
export const getLeaderboard = async (timeframe: string, page: number): Promise<ZamaUser[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}?timeframe=${timeframe}&sortBy=mindshare&page=${page}`);
        if (!response.ok) return [];
        
        let json: ApiResponse;
        try {
            json = await response.json();
        } catch (e) {
            console.error("Failed to parse leaderboard JSON", e);
            return [];
        }

        return json && json.success && Array.isArray(json.data) ? json.data : [];
    } catch (error) {
        console.error("Failed to fetch leaderboard page", error);
        return [];
    }
};
