
import React, { useState, useEffect, useRef } from 'react';
import { ZamaUser } from '../types';
import { getLeaderboard, searchUserInTimeframe } from '../services/zamaService';
import { SEASONS } from '../constants';
import { Trophy, Search, Loader2, Medal, Zap, CheckCircle2, XCircle } from 'lucide-react';

const Leaderboard: React.FC = () => {
    // Default to Season 5 (Active)
    const [selectedSeason, setSelectedSeason] = useState<string>('season5');
    
    const [users, setUsers] = useState<ZamaUser[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [verifyQuery, setVerifyQuery] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState<{ found: boolean; data: ZamaUser | null } | null>(null);

    // Ref to track current season for race condition prevention
    const currentSeasonRef = useRef(selectedSeason);

    // Initial Load & Season Change
    useEffect(() => {
        currentSeasonRef.current = selectedSeason;
        // Reset state when season changes
        setUsers([]);
        setPage(1);
        setHasMore(true);
        setVerifyResult(null);
        setVerifyQuery('');
        
        // Trigger load
        loadMore(1, selectedSeason);
    }, [selectedSeason]);

    const loadMore = async (pageNum = page, season = selectedSeason) => {
        // Simple lock check
        if (loading && pageNum !== 1) return; 
        if (!hasMore && pageNum !== 1) return;
        if (pageNum > 10) return; // Limit to 10 pages (1000 users)

        setLoading(true);
        const newUsers = await getLeaderboard(season, pageNum);
        
        // Race condition check: if season changed while fetching, discard results
        if (season !== currentSeasonRef.current) {
             setLoading(false);
             return;
        }

        if (newUsers.length > 0) {
            setUsers(prev => pageNum === 1 ? newUsers : [...prev, ...newUsers]);
            setPage(pageNum + 1);
        } else {
            setHasMore(false);
        }
        setLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyQuery.trim()) return;

        setVerifying(true);
        setVerifyResult(null);

        // First check if user is already in the loaded list (optimization)
        const localUser = users.find(u => 
            u.username.toLowerCase() === verifyQuery.toLowerCase() || 
            u.displayName.toLowerCase().includes(verifyQuery.toLowerCase())
        );

        if (localUser) {
            setVerifyResult({ found: true, data: localUser });
            setVerifying(false);
            return;
        }

        // If not in loaded list, search API for specific season (up to 30 pages)
        const result = await searchUserInTimeframe(verifyQuery, selectedSeason, (pct) => {}); 
        
        if (result) {
            setVerifyResult({ found: true, data: result });
        } else {
            setVerifyResult({ found: false, data: null });
        }
        setVerifying(false);
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Medal className="text-yellow-400 fill-yellow-400/20" size={24} />;
        if (rank === 2) return <Medal className="text-gray-300 fill-gray-300/20" size={24} />;
        if (rank === 3) return <Medal className="text-amber-700 fill-amber-700/20" size={24} />;
        return <span className="font-mono text-neutral-500 font-bold">#{rank}</span>;
    };

    return (
        <div className="w-full max-w-5xl flex flex-col items-center animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-3 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <Trophy className="text-yellow-500" size={16} />
                    <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs">Top 1000</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-display text-white mt-2 text-glow">Creator Leaderboard</h2>
                <p className="text-neutral-400 mt-3 text-lg font-light">Honoring the top contributors of each season</p>
            </div>

            {/* Season Selector */}
            <div className="w-full overflow-x-auto pb-6 mb-2 no-scrollbar">
                <div className="flex justify-center min-w-max gap-3 px-4">
                    {SEASONS.map((season) => {
                        const isActive = selectedSeason === season.id;
                        return (
                            <button
                                key={season.id}
                                onClick={() => setSelectedSeason(season.id)}
                                className={`relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                        : 'bg-neutral-900/50 text-neutral-500 border border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'
                                }`}
                            >
                                {season.label}
                                {season.active && (
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Verification / Search */}
            <div className="w-full max-w-lg mb-10 relative z-20">
                <form onSubmit={handleVerify} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-blue-500/10 rounded-2xl blur-lg transition-opacity opacity-50 group-hover:opacity-100"></div>
                    <div className="relative flex items-center bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl focus-within:border-yellow-500/50 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all">
                        <div className="pl-4 text-neutral-500">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text"
                            value={verifyQuery}
                            onChange={(e) => setVerifyQuery(e.target.value)}
                            placeholder={`Verify rank in ${SEASONS.find(s => s.id === selectedSeason)?.label}...`}
                            className="w-full bg-transparent border-none text-white px-4 py-4 outline-none placeholder:text-neutral-600 font-display"
                        />
                        <div className="pr-2">
                            <button 
                                type="submit" 
                                disabled={verifying || !verifyQuery}
                                className="bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {verifying ? <Loader2 className="animate-spin" size={16} /> : 'Check'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Verification Result */}
                {verifyResult && (
                    <div className="mt-4 animate-in slide-in-from-top-4 duration-500">
                        {verifyResult.found && verifyResult.data ? (
                            <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap size={100} />
                                </div>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-500 blur rounded-full opacity-20"></div>
                                        <img 
                                            src={verifyResult.data.profilePicture || `https://unavatar.io/twitter/${verifyResult.data.username}`} 
                                            className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-xl relative z-10" 
                                            alt="" 
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-black rounded-full p-0.5 border-2 border-black z-20">
                                            <CheckCircle2 size={12} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-xl font-display tracking-tight">{verifyResult.data.displayName}</div>
                                        <div className="text-neutral-500 text-sm font-mono">@{verifyResult.data.username}</div>
                                    </div>
                                    <div className="text-right bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20 backdrop-blur-md">
                                        <div className="text-xs text-yellow-500 uppercase font-bold tracking-wider mb-0.5">Rank</div>
                                        <div className="text-3xl font-bold text-white font-display leading-none">#{verifyResult.data.rank}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200/80">
                                <XCircle className="text-red-500" size={20} />
                                <div className="text-sm">
                                    <span className="font-bold block text-red-400">Not Found</span>
                                    User not found in top 3000 for {SEASONS.find(s => s.id === selectedSeason)?.label}.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="w-full glass-panel rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-black/40 text-xs uppercase text-neutral-500 tracking-wider font-semibold">
                                <th className="p-5 w-24 text-center">Rank</th>
                                <th className="p-5">Creator</th>
                                <th className="p-5 text-right">Mindshare</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center h-full scale-90 group-hover:scale-100 transition-transform">
                                            {getRankIcon(user.rank)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={user.profilePicture || `https://unavatar.io/twitter/${user.username}`} 
                                                alt="" 
                                                className="w-10 h-10 rounded-full bg-neutral-800 object-cover border border-neutral-800 group-hover:border-yellow-500/30 transition-colors"
                                                loading="lazy"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-bold text-neutral-200 group-hover:text-white truncate text-base">{user.displayName}</div>
                                                <a 
                                                    href={`https://x.com/${user.username}`}
                                                    target="_blank"
                                                    rel="noreferrer" 
                                                    className="text-xs text-neutral-500 flex items-center gap-1 hover:text-yellow-400 hover:underline mt-0.5"
                                                >
                                                    @{user.username}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                                            <span className="font-mono text-blue-400 font-bold">{user.mindshare.toFixed(2)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={3} className="p-20 text-center text-neutral-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="opacity-20" size={40} />
                                            <span>No data available for this season yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Load More Trigger */}
                {hasMore && page <= 10 && users.length > 0 && (
                    <div className="p-4 flex justify-center border-t border-neutral-800 bg-black/20 backdrop-blur">
                        <button 
                            onClick={() => loadMore()} 
                            disabled={loading}
                            className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-neutral-800 active:scale-95 duration-200"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Load More Creators'}
                        </button>
                    </div>
                )}
                {(!hasMore || page > 10) && users.length > 0 && (
                    <div className="p-6 text-center text-xs text-neutral-600 border-t border-neutral-800 uppercase tracking-widest font-semibold">
                        — End of Top 1000 —
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
