export type Timeframe = '24h' | '7d' | '30d' | 'all' | 'season1' | 'season2' | 'season3' | 'season4' | 'season5';

export interface ZamaUser {
    _id: string;
    username: string;
    displayName: string;
    profilePicture: string; // usually URL
    mindshare: number;
    rank: number;
    // Add other fields from API if necessary
}

export interface ApiResponse {
    success: boolean;
    data: ZamaUser[];
    total: number;
    page: number;
    pages: number;
}

export type SearchStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

export interface SearchResult {
    status: SearchStatus;
    data: ZamaUser | null;
}

export interface HistoryItem {
    username: string;
    displayName: string;
    avatar: string;
    timestamp: number;
}