import React, { useState, useEffect } from 'react';
import { SearchResult, ZamaUser, HistoryItem, Timeframe } from '../types';
import { TIMEFRAMES, LOCAL_STORAGE_KEY } from '../constants';
import { searchUserInTimeframe } from '../services/zamaService';
import SearchBar from './SearchBar';
import ResultCard from './ResultCard';
import SearchHistory from './SearchHistory';
import { ExternalLink, Zap } from 'lucide-react';

const RankChecker: React.FC = () => {
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Results State for each timeframe
    const [results, setResults] = useState<Partial<Record<Timeframe, SearchResult>>>({
        '24h': { status: 'idle', data: null },
        '7d': { status: 'idle', data: null },
        '30d': { status: 'idle', data: null },
        'all': { status: 'idle', data: null }, 
    });
    
    // Progress state for each timeframe
    const [progress, setProgress] = useState<Record<string, number>>({
        '24h': 0,
        '7d': 0,
        '30d': 0,
    });

    // User Metadata (Avatar/Name) - taken from the first successful result
    const [userMeta, setUserMeta] = useState<Partial<ZamaUser> | null>(null);

    // History State
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Load History on Mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    // Helper to update result for a specific timeframe
    const updateResult = (key: Timeframe, status: SearchResult['status'], data: ZamaUser | null) => {
        setResults(prev => ({
            ...prev,
            [key]: { status, data }
        }));
    };

    const handleSearch = async (username: string) => {
        if (!username) return;
        
        // Reset State
        setSearchQuery(username);
        setIsSearching(true);
        setUserMeta(null);
        setResults({
            '24h': { status: 'loading', data: null },
            '7d': { status: 'loading', data: null },
            '30d': { status: 'loading', data: null },
            'all': { status: 'idle', data: null },
        });
        setProgress({ '24h': 0, '7d': 0, '30d': 0 });

        // Helper for individual search execution
        const runSearch = async (tf: Timeframe) => {
            const result = await searchUserInTimeframe(username, tf, (pct) => {
                setProgress(prev => ({ ...prev, [tf]: pct }));
            });

            if (result) {
                updateResult(tf, 'found', result);
                // If we haven't set meta yet, set it now
                setUserMeta(prev => prev || {
                    username: result.username,
                    displayName: result.displayName,
                    profilePicture: result.profilePicture || `https://unavatar.io/twitter/${result.username}`
                });
            } else {
                updateResult(tf, 'not_found', null);
            }
        };

        // Run all searches in parallel
        await Promise.all(TIMEFRAMES.map(tf => runSearch(tf.key as Timeframe)));

        setIsSearching(false);
    };

    // Save to history when userMeta is populated and we aren't searching anymore
    useEffect(() => {
        if (!isSearching && userMeta && userMeta.username) {
            setHistory(prev => {
                const newItem: HistoryItem = {
                    username: userMeta.username!,
                    displayName: userMeta.displayName!,
                    avatar: userMeta.profilePicture!,
                    timestamp: Date.now()
                };
                
                // Filter out duplicates (case insensitive) and limit to 6
                const filtered = prev.filter(h => h.username.toLowerCase() !== newItem.username.toLowerCase());
                const newHistory = [newItem, ...filtered].slice(0, 6);
                
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, [isSearching, userMeta]);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-2 shadow-xl backdrop-blur-sm">
                    <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tighter text-white text-glow">
                    ZAMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">PULSE</span>
                </h1>
                <p className="text-neutral-400 text-lg max-w-md mx-auto leading-relaxed">
                    Real-time rank analytics for the Zama leaderboard. 
                    Track Mindshare across timeframes.
                </p>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-xl mb-12">
                <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>

            {/* User Profile Header (Visible when data found) */}
            {userMeta && (
                <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 border-l-4 border-l-yellow-500">
                        <img 
                            src={userMeta.profilePicture} 
                            alt={userMeta.displayName} 
                            className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow-2xl"
                        />
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-bold text-white font-display">{userMeta.displayName}</h2>
                            <a 
                                href={`https://x.com/${userMeta.username}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-neutral-400 hover:text-yellow-400 transition-colors mt-1"
                            >
                                @{userMeta.username}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="hidden sm:block text-right">
                            <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">Status</div>
                            <div className="text-green-400 font-mono text-sm bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 inline-block">
                                Active
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {TIMEFRAMES.map((tf) => {
                    const result = results[tf.key as Timeframe] || { status: 'idle', data: null };
                    return (
                        <div key={tf.key} className="w-full">
                            <ResultCard 
                                label={tf.label}
                                status={result.status}
                                data={result.data}
                                progress={progress[tf.key]}
                                colorClass={tf.color}
                                borderClass={tf.border}
                                bgClass={tf.bg}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Empty State / Prompt */}
            {!userMeta && !isSearching && history.length === 0 && (
                <div className="mt-12 text-center text-neutral-600">
                    <p>Enter a username above to start scanning.</p>
                </div>
            )}

            {/* History */}
            <div className="w-full max-w-xl">
                <SearchHistory history={history} onSelect={handleSearch} />
            </div>
        </div>
    );
};

export default RankChecker;