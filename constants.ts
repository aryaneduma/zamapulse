
export const API_BASE_URL = "https://leaderboard-bice-mu.vercel.app/api/zama";
export const MAX_SEARCH_PAGES = 30; // 30 pages * 100 users = 3000 top users
export const LOCAL_STORAGE_KEY = "zama_pulse_history_v1";

export const TIMEFRAMES = [
    { key: '24h', label: '24 Hours', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
    { key: '7d', label: '7 Days', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { key: '30d', label: '30 Days', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
] as const;

export const SEASONS = [
    { id: 'season1', label: 'Season 1', active: false },
    { id: 'season2', label: 'Season 2', active: false },
    { id: 'season3', label: 'Season 3', active: false },
    { id: 'season4', label: 'Season 4', active: false },
    { id: 'season5', label: 'Season 5', active: true },
] as const;

export const LEADERBOARD_TIMEFRAME = 'all'; // Fallback or cumulative if needed
