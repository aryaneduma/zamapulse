
import React, { useState, useEffect, useRef } from 'react';
import { ZamaUser } from '../types';
import { getLeaderboard, searchUserInTimeframe } from '../services/zamaService';
import { SEASONS } from '../constants';
import { Trophy, Search, Loader2, Medal, Zap, CheckCircle2, XCircle, Star, Crown, ExternalLink } from 'lucide-react';

const Leaderboard: React.FC = () => {
    // Default to Active Season found in constants, or fallback to the last one
    const [selectedSeason, setSelectedSeason] = useState<string>(() => {
        const activeSeason = SEASONS.find(s => s.active);
        return activeSeason ? activeSeason.id : SEASONS[SEASONS.length - 1].id;
    });
    
    const [users, setUsers] = useState<ZamaUser[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [verifyQuery, setVerifyQuery] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState<{ found: boolean; data: ZamaUser | any | null } | null>(null);
    
    // State to hold dynamically loaded static data
    const [staticData, setStaticData] = useState<any>(null);
    const [loadingStatic, setLoadingStatic] = useState(false);

    // Ref to track current season for race condition prevention
    const currentSeasonRef = useRef(selectedSeason);

    // Check if current season is static
    const isStaticSeason = ['season1', 'season2', 'season3', 'season4'].includes(selectedSeason);

    // Initial Load & Season Change
    useEffect(() => {
        currentSeasonRef.current = selectedSeason;
        setUsers([]);
        setPage(1);
        setHasMore(true);
        setVerifyResult(null);
        setVerifyQuery('');
        setStaticData(null);
        
        if (isStaticSeason) {
            loadStaticSeasonData(selectedSeason);
        } else {
            loadMore(1, selectedSeason);
        }
    }, [selectedSeason]);

    const loadStaticSeasonData = async (seasonId: string) => {
        setLoadingStatic(true);
        try {
            let data;
            if (seasonId === 'season1') data = await import('../data/season1');
            if (seasonId === 'season2') data = await import('../data/season2');
            if (seasonId === 'season3') data = await import('../data/season3');
            if (seasonId === 'season4') data = await import('../data/season4');
            
            // Check if user is still on the same tab
            if (currentSeasonRef.current === seasonId) {
                setStaticData(data);
            }
        } catch (e) {
            console.error("Failed to load static data", e);
        }
        setLoadingStatic(false);
    };

    const loadMore = async (pageNum = page, season = selectedSeason) => {
        if (isStaticSeason) return; // Handled statically
        
        if (loading && pageNum !== 1) return; 
        if (!hasMore && pageNum !== 1) return;
        if (pageNum > 10) return; // Limit to 10 pages (1000 users)

        setLoading(true);
        const newUsers = await getLeaderboard(season, pageNum);
        
        // Race condition check
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

        // --- Static Season Verification Logic ---
        if (isStaticSeason && staticData) {
            let choiceAwards: any[] = [];
            let rankedList: any[] = [];
            
            // Map the dynamic data imports to the variable names safely with checks
            if (selectedSeason === 'season1') {
                choiceAwards = staticData?.SEASON_1_CHOICE_AWARDS || [];
                rankedList = staticData?.SEASON_1_RANKED || [];
            } else if (selectedSeason === 'season2') {
                choiceAwards = staticData?.SEASON_2_CHOICE_AWARDS || [];
                rankedList = staticData?.SEASON_2_RANKED || [];
            } else if (selectedSeason === 'season3') {
                choiceAwards = staticData?.SEASON_3_CHOICE_AWARDS || [];
                rankedList = staticData?.SEASON_3_RANKED || [];
            } else if (selectedSeason === 'season4') {
                choiceAwards = staticData?.SEASON_4_CHOICE_AWARDS || [];
                rankedList = staticData?.SEASON_4_RANKED || [];
            }

            // Check Choice Awards
            const choiceMatch = choiceAwards.find(
                (u: any) => (u.handle && u.handle.toLowerCase().includes(verifyQuery.toLowerCase())) || 
                     u.name.toLowerCase().includes(verifyQuery.toLowerCase())
            );

            if (choiceMatch) {
                setVerifyResult({ found: true, data: { ...choiceMatch, type: 'choice' } });
                setVerifying(false);
                return;
            }

            // Check Ranked List
            const rankedMatch = rankedList.find(
                (u: any) => u.url.toLowerCase().includes(verifyQuery.toLowerCase()) || 
                     u.name.toLowerCase().includes(verifyQuery.toLowerCase())
            );
            
            if (rankedMatch) {
                // Extract handle from URL for display
                const handle = rankedMatch.url.split('x.com/')[1] || rankedMatch.name;
                setVerifyResult({ 
                    found: true, 
                    data: { 
                        displayName: rankedMatch.name, 
                        username: handle, 
                        rank: rankedMatch.rank, 
                        mindshare: 0, // Not used
                        profilePicture: `https://unavatar.io/twitter/${handle}`,
                        type: 'ranked',
                        prize: rankedMatch.prize
                    } 
                });
            } else {
                setVerifyResult({ found: false, data: null });
            }
            setVerifying(false);
            return;
        }

        // --- Standard Season Verification Logic ---

        // First check if user is already in the loaded list
        const localUser = users.find(u => 
            u.username.toLowerCase() === verifyQuery.toLowerCase() || 
            u.displayName.toLowerCase().includes(verifyQuery.toLowerCase())
        );

        if (localUser) {
            setVerifyResult({ found: true, data: localUser });
            setVerifying(false);
            return;
        }

        // If not in loaded list, search API
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
        return <span className="font-mono text-neutral-400 font-bold">#{rank}</span>;
    };

    // --- STATIC SEASON RENDER (S1 & S2 & S3 & S4) ---
    const renderStaticSeason = (stats: any, choiceAwards: any[], rankedList: any[]) => {
        // Strict null check for stats object
        if (!stats) return <div className="p-10 text-center text-neutral-500">Loading data...</div>;

        return (
            <div className="w-full space-y-12 animate-in fade-in duration-500">
                
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-900/60 border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Trophy size={100} /></div>
                        <div>
                            <div className="text-sm text-neutral-400 uppercase tracking-wider mb-1">Total Rewards</div>
                            <div className="text-3xl font-bold text-white font-display">{stats.totalRewards}</div>
                        </div>
                    </div>
                    <div className="bg-neutral-900/60 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={100} /></div>
                        <div>
                            <div className="text-sm text-neutral-400 uppercase tracking-wider mb-1">Creators Awarded</div>
                            <div className="text-3xl font-bold text-white font-display">{stats.creatorsAwarded}</div>
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-neutral-300 max-w-2xl mx-auto italic border-l-2 border-yellow-500/50 pl-4 py-2 bg-yellow-500/5 rounded-r-lg">
                    "{stats.description}"
                </p>

                {/* Creator Choice Awards */}
                {choiceAwards && choiceAwards.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Star className="text-yellow-400 fill-yellow-400" />
                            <h3 className="text-2xl font-bold font-display text-white">Creator Choice Awards</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {choiceAwards.map((winner, i) => (
                                <div key={i} className="glass-panel p-5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">
                                                WINNER
                                            </div>
                                            <ExternalLink size={14} className="text-neutral-400 group-hover:text-white" />
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={`https://unavatar.io/${winner.platform && winner.platform.toLowerCase() === 'x' ? 'twitter' : ''}/${winner.handle}`} className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-800" alt={winner.name} />
                                            <div>
                                                <div className="font-bold text-white">{winner.name}</div>
                                                <div className="text-xs text-neutral-400">{winner.platform}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-mono text-neutral-200 border-t border-white/10 pt-3">
                                            {winner.prize}
                                        </div>
                                    </div>
                                    <a href={winner.link} target="_blank" className="absolute inset-0 z-20" aria-label={`View ${winner.name}'s post`}></a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ranked List */}
                {rankedList && rankedList.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Crown className="text-blue-400" />
                            <h3 className="text-2xl font-bold font-display text-white">Ranked Winners (Top {rankedList.length})</h3>
                        </div>
                        <div className="glass-panel rounded-2xl overflow-hidden border border-neutral-800">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-800 bg-black/40 text-xs uppercase text-neutral-400 tracking-wider font-semibold">
                                            <th className="p-4 w-24 text-center">Rank</th>
                                            <th className="p-4">Creator</th>
                                            <th className="p-4 text-right">Prize</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/50">
                                        {rankedList.map((user) => {
                                            // Extract handle roughly
                                            const handle = user.url.split('x.com/')[1] || '';
                                            return (
                                                <tr key={user.rank} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4 text-center font-mono text-neutral-400 font-bold">
                                                        #{user.rank}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <img 
                                                                src={`https://unavatar.io/twitter/${handle}`} 
                                                                alt="" 
                                                                className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-800"
                                                                loading="lazy"
                                                            />
                                                            <div>
                                                                <div className="font-bold text-neutral-200">{user.name}</div>
                                                                <a href={user.url} target="_blank" className="text-xs text-neutral-400 hover:text-blue-400 flex items-center gap-1 transition-colors">
                                                                    @{handle} <ExternalLink size={10} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="inline-block bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg text-purple-300 text-xs font-bold">
                                                            {user.prize}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
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
                <p className="text-neutral-300 mt-3 text-lg font-light">Honoring the top contributors of each season</p>
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
                                        : 'bg-neutral-900/50 text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-white'
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
                        <div className="pl-4 text-neutral-400">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text"
                            value={verifyQuery}
                            onChange={(e) => setVerifyQuery(e.target.value)}
                            placeholder={`Verify rank in ${SEASONS.find(s => s.id === selectedSeason)?.label}...`}
                            className="w-full bg-transparent border-none text-white px-4 py-4 outline-none placeholder:text-neutral-500 font-display"
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
                                        <div className="text-white font-bold text-xl font-display tracking-tight">{verifyResult.data.displayName || verifyResult.data.name}</div>
                                        <div className="text-neutral-400 text-sm font-mono">@{verifyResult.data.username || verifyResult.data.handle}</div>
                                    </div>
                                    <div className="text-right bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20 backdrop-blur-md">
                                        {verifyResult.data.rank ? (
                                            <>
                                                <div className="text-xs text-yellow-500 uppercase font-bold tracking-wider mb-0.5">Rank</div>
                                                <div className="text-3xl font-bold text-white font-display leading-none">#{verifyResult.data.rank}</div>
                                            </>
                                        ) : (
                                            <div className="text-yellow-400 font-bold uppercase tracking-widest text-sm py-2">
                                                WINNER
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {verifyResult.data.prize && (
                                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-sm text-neutral-400">Award</span>
                                        <span className="text-white font-bold font-mono">{verifyResult.data.prize}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200">
                                <XCircle className="text-red-500" size={20} />
                                <div className="text-sm">
                                    <span className="font-bold block text-red-400">Not Found</span>
                                    {isStaticSeason 
                                        ? `User not found in ${SEASONS.find(s => s.id === selectedSeason)?.label} winners list.`
                                        : `User not found in top 3000 for ${SEASONS.find(s => s.id === selectedSeason)?.label}.`
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            {loadingStatic ? (
                <div className="py-20">
                    <Loader2 className="animate-spin text-yellow-500" size={40} />
                </div>
            ) : (
                <>
                    {/* Safe rendering with optional chaining to prevent crashes if data is missing */}
                    {selectedSeason === 'season1' && staticData && (
                        renderStaticSeason(staticData?.SEASON_1_STATS, staticData?.SEASON_1_CHOICE_AWARDS, staticData?.SEASON_1_RANKED)
                    )}
                    {selectedSeason === 'season2' && staticData && (
                        renderStaticSeason(staticData?.SEASON_2_STATS, staticData?.SEASON_2_CHOICE_AWARDS, staticData?.SEASON_2_RANKED)
                    )}
                    {selectedSeason === 'season3' && staticData && (
                        renderStaticSeason(staticData?.SEASON_3_STATS, staticData?.SEASON_3_CHOICE_AWARDS, staticData?.SEASON_3_RANKED)
                    )}
                    {selectedSeason === 'season4' && staticData && (
                        renderStaticSeason(staticData?.SEASON_4_STATS, staticData?.SEASON_4_CHOICE_AWARDS, staticData?.SEASON_4_RANKED)
                    )}
                    
                    {!isStaticSeason && (
                        <div className="w-full glass-panel rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-800 bg-black/40 text-xs uppercase text-neutral-400 tracking-wider font-semibold">
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
                                                                className="text-xs text-neutral-400 flex items-center gap-1 hover:text-yellow-400 hover:underline mt-0.5"
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
                                                <td colSpan={3} className="p-20 text-center text-neutral-400">
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
                                <div className="p-6 text-center text-xs text-neutral-500 border-t border-neutral-800 uppercase tracking-widest font-semibold">
                                    — End of Top 1000 —
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Leaderboard;
