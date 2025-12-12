
import { API_BASE_URL, MAX_SEARCH_PAGES } from '../constants';
import { ApiResponse, ZamaUser } from '../types';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

const getCached = (key: string) => {
    const item = cache.get(key);
    if (item && Date.now() - item.timestamp < CACHE_TTL) {
        return item.data;
    }
    return null;
};

const setCache = (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Searches for a user within a specific timeframe by paginating through the leaderboard.
 * Uses concurrent batch fetching to improve performance.
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
    
    if (!username) return null;

    const cleanUser = username.toLowerCase().replace('@', '').trim();
    // Reduced batch size to prevent 429 Rate Limit errors when multiple timeframes are searched concurrently
    const BATCH_SIZE = 3; 
    
    for (let i = 0; i < MAX_SEARCH_PAGES; i += BATCH_SIZE) {
        const batchPromises = [];
        
        // Prepare batch
        for (let j = 0; j < BATCH_SIZE; j++) {
            const page = i + j + 1;
            if (page > MAX_SEARCH_PAGES) break;
            
            const cacheKey = `${timeframe}-${page}`;
            const cachedData = getCached(cacheKey);

            if (cachedData) {
                batchPromises.push(Promise.resolve({ page, json: cachedData, error: false }));
            } else {
                batchPromises.push(
                    fetch(`${API_BASE_URL}?timeframe=${timeframe}&sortBy=mindshare&page=${page}`)
                        .then(async (res) => {
                            if (!res.ok) return { page, json: null, error: true };
                            try {
                                const json = await res.json();
                                // Cache successful responses
                                if (json && json.success) {
                                    setCache(cacheKey, json);
                                }
                                return { page, json, error: false };
                            } catch (e) {
                                return { page, json: null, error: true };
                            }
                        })
                        .catch(() => ({ page, json: null, error: true }))
                );
            }
        }

        // Execute batch
        const results = await Promise.all(batchPromises);

        // Update progress based on the last page of this batch
        const currentMaxPage = Math.min(i + BATCH_SIZE, MAX_SEARCH_PAGES);
        const percent = Math.round((currentMaxPage / MAX_SEARCH_PAGES) * 100);
        onProgress(percent);

        // Sort results to ensure we check page 1 before page 2, etc.
        results.sort((a, b) => a.page - b.page);

        let endOfListReached = false;

        for (const result of results) {
            const { json } = result;
            
            if (json && json.success && Array.isArray(json.data)) {
                // Check if we hit an empty page, which usually means end of leaderboard
                if (json.data.length === 0) {
                    endOfListReached = true;
                }

                // Robust check to avoid crashes if API returns partial data
                const user = json.data.find((u: ZamaUser) => {
                    if (!u) return false;
                    const uName = u.username ? u.username.toLowerCase() : '';
                    const dName = u.displayName ? u.displayName.toLowerCase() : '';
                    return uName === cleanUser || dName.includes(cleanUser);
                });

                if (user) {
                    return user;
                }
            } else if (result.error) {
                // Silent continue on error, try next pages
                console.warn(`Failed to fetch page ${result.page} for ${timeframe}`);
            }
        }

        // Optimization: If we found an empty page, no need to query further batches
        if (endOfListReached) {
            break;
        }

        // Small delay between batches to be nice to the API and avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 150));
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
    const cacheKey = `lb-${timeframe}-${page}`;
    const cachedData = getCached(cacheKey);
    
    if (cachedData) return cachedData.data;

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

        if (json && json.success && Array.isArray(json.data)) {
            setCache(cacheKey, json);
            return json.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch leaderboard page", error);
        return [];
    }
};
