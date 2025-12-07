import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // We don't have date-fns installed, I'll use simple formatter

interface SearchHistoryProps {
    history: HistoryItem[];
    onSelect: (username: string) => void;
}

const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
};

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect }) => {
    if (history.length === 0) return null;

    return (
        <div className="w-full mt-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center gap-2 text-neutral-500 mb-4 px-1">
                <Clock size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Recent Scans</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {history.map((item, index) => (
                    <button
                        key={`${item.username}-${index}`}
                        onClick={() => onSelect(item.username)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 transition-all group text-left"
                    >
                        <div className="relative">
                            <img 
                                src={item.avatar} 
                                alt={item.username}
                                className="w-10 h-10 rounded-full border border-neutral-700 group-hover:border-yellow-500/50 transition-colors"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.username}&background=random`;
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-neutral-300 group-hover:text-white truncate">
                                {item.displayName}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-500 font-mono truncate">@{item.username}</span>
                                <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                <span className="text-[10px] text-neutral-600">{timeAgo(item.timestamp)}</span>
                            </div>
                        </div>
                        <div className="text-neutral-700 group-hover:text-yellow-400 transition-colors">
                            <ArrowUpRight size={16} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchHistory;
