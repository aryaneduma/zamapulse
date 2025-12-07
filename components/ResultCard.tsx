import React from 'react';
import { ZamaUser, SearchStatus } from '../types';
import { Loader2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultCardProps {
    label: string;
    data: ZamaUser | null;
    status: SearchStatus;
    colorClass: string;
    borderClass: string;
    bgClass: string;
    progress?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
    label, 
    data, 
    status, 
    colorClass,
    borderClass,
    bgClass,
    progress = 0
}) => {
    
    // Calculate a simulated progress bar for the Mindshare score (assuming max is somewhat relative, typical high is 5-10% but lets just visually represent it)
    // Actually, mindshare is a percentage.
    const mindshareValue = data ? parseFloat(data.mindshare.toFixed(2)) : 0;
    
    return (
        <div className={`glass-panel rounded-xl p-6 flex flex-col justify-between h-full min-h-[180px] transition-all duration-500 hover:translate-y-[-2px] ${status === 'found' ? 'border-neutral-700' : 'border-neutral-800'}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${bgClass} ${colorClass}`}>
                    {label}
                </span>
                
                {status === 'found' && (
                    <CheckCircle2 className="text-green-500/50" size={16} />
                )}
            </div>

            {/* Content Body */}
            <div className="flex-grow flex flex-col justify-center">
                
                {status === 'idle' && (
                    <div className="text-center text-neutral-600 text-sm">
                        Waiting to scan...
                    </div>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className={`animate-spin ${colorClass}`} size={24} />
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                            <div 
                                className={`h-full ${colorClass.replace('text-', 'bg-')}`} 
                                style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                            ></div>
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">{progress}% Scanned</span>
                    </div>
                )}

                {status === 'not_found' && (
                    <div className="text-center text-neutral-500 flex flex-col items-center gap-2">
                        <AlertCircle size={20} className="opacity-50" />
                        <span className="text-sm">Not Ranked</span>
                    </div>
                )}

                {status === 'found' && data && (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-4xl font-bold text-white font-display mb-1">
                            #{data.rank}
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                            Rank
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 bg-neutral-900/50 py-2 rounded-lg border border-neutral-800">
                            <TrendingUp size={14} className={colorClass} />
                            <span className="text-lg font-mono font-bold text-neutral-200">
                                {mindshareValue}%
                            </span>
                            <span className="text-[10px] text-neutral-600 self-end mb-1">Mindshare</span>
                        </div>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="text-center text-red-500/70 text-sm">
                        Connection Error
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
