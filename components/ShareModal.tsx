
import React, { useState, useRef, useEffect } from 'react';
import { ZamaUser, SearchResult, Timeframe } from '../types';
import { TIMEFRAMES } from '../constants';
import { Download, X, Twitter, Share2, Check, Copy, Zap, Trophy, TrendingUp, User } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: Partial<ZamaUser>;
    results: Partial<Record<Timeframe, SearchResult>>;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, user, results }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Filter results to only get found ones
    const activeResults = Object.entries(results).filter(([_, r]) => (r as SearchResult | undefined)?.status === 'found');
    const hasMultiple = activeResults.length > 1;

    // State for selection (can be a Timeframe OR 'combined')
    const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);

    // Initialize selection when modal opens
    useEffect(() => {
        if (isOpen && !selectedTimeframe) {
            if (hasMultiple) {
                setSelectedTimeframe('combined');
            } else if (activeResults.length > 0) {
                setSelectedTimeframe(activeResults[0][0]);
            }
        }
    }, [isOpen, hasMultiple, activeResults.length, selectedTimeframe]); 

    if (!isOpen || !selectedTimeframe) return null;

    // Get data for selected view
    const isCombined = selectedTimeframe === 'combined';
    
    // For single view, get specific data
    const currentResult = !isCombined ? results[selectedTimeframe as Timeframe] : null;
    const singleData = currentResult?.data;
    const timeframeLabel = !isCombined ? (TIMEFRAMES.find(t => t.key === selectedTimeframe)?.label || selectedTimeframe) : 'All-Rounder';

    // Safety fallback
    if (!isCombined && !singleData) return null;

    const downloadCard = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            // Wait slightly longer for images/fonts to stabilize
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: null,
                scale: 2, // Retina quality
                logging: false,
                allowTaint: true,
                // Fix for text shifting: html2canvas often renders text slightly lower. 
                // We use onclone to shift specific text elements up in the capture.
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.querySelectorAll('.fix-shift');
                    elements.forEach((el) => {
                        (el as HTMLElement).style.transform = 'translateY(-3px)';
                    });
                }
            });

            const link = document.createElement('a');
            link.download = `ZamaPulse-${user.username}-${selectedTimeframe}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (e) {
            console.error("Failed to generate image", e);
        }
        setIsDownloading(false);
    };

    const shareOnTwitter = () => {
        let text = "";
        if (isCombined) {
            text = `I'm dominating the Zama Leaderboard across multiple timeframes! ⚡️\n\nCheck my stats on Zama Pulse:\n`;
        } else {
            text = `I just ranked #${singleData?.rank} on the Zama Leaderboard (${timeframeLabel})! ⚡️\n\nCheck your rank on Zama Pulse:\n`;
        }
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://zamapulse.in')}&hashtags=Zama,FHE,ZamaPulse`;
        window.open(url, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText('https://zamapulse.in');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-neutral-900/50">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Share2 size={18} className="text-yellow-500" />
                        Share Rank
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 custom-scrollbar">
                    
                    {/* Timeframe Selector */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {hasMultiple && (
                            <button
                                onClick={() => setSelectedTimeframe('combined')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isCombined
                                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/20' 
                                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                                }`}
                            >
                                <Trophy size={12} /> Combined
                            </button>
                        )}
                        {activeResults.map(([tf]) => {
                            const label = TIMEFRAMES.find(t => t.key === tf)?.label || tf;
                            const isActive = selectedTimeframe === tf;
                            return (
                                <button
                                    key={tf}
                                    onClick={() => setSelectedTimeframe(tf)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        isActive 
                                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* The Card Wrapper */}
                    <div className="relative shadow-2xl rounded-2xl overflow-hidden group">
                        {/* Download Overlay Hint */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                            <span className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl backdrop-blur">
                                <Download size={16} /> Preview
                            </span>
                        </div>

                        {/* Actual Card DOM to Capture */}
                        {/* Using Grid Layout instead of Flex to enforce strict row heights and prevent shifting */}
                        <div 
                            ref={cardRef}
                            className="w-[340px] sm:w-[500px] aspect-[1.6/1] relative overflow-hidden bg-[#050505] grid grid-rows-[auto_1fr_auto]"
                        >
                            {/* Background Elements - Absolute but pinned */}
                            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-yellow-600/20 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none z-0"></div>
                            <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-gradient-to-tr from-blue-900/20 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none z-0"></div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] pointer-events-none z-0"></div>
                            
                            {/* Card Border */}
                            <div className="absolute inset-0 border-[6px] border-neutral-900 z-50 pointer-events-none"></div>
                            <div className="absolute inset-[6px] border border-white/10 z-50 pointer-events-none rounded-sm"></div>

                            {/* Row 1: Header */}
                            <div className="relative z-10 flex justify-between items-start p-8 pb-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-yellow-500/10 p-1.5 rounded-lg border border-yellow-500/20">
                                        <Zap className="text-yellow-500 fill-yellow-500" size={18} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold font-display leading-tight tracking-tight fix-shift">ZAMA PULSE</div>
                                        <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase fix-shift">Leaderboard</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900/80 border border-neutral-800 px-3 py-1 rounded-full backdrop-blur-md">
                                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide fix-shift">
                                        {isCombined ? 'Elite Creator' : timeframeLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Row 2: Middle Content (Centered) */}
                            <div className="relative z-10 flex flex-col justify-center items-center w-full px-8">
                                {isCombined ? (
                                    <div className="flex flex-wrap justify-center items-center gap-3 w-full">
                                        {activeResults.slice(0, 3).map(([tf, res]) => {
                                            const label = TIMEFRAMES.find(t => t.key === tf)?.label.replace(' Hours', 'H').replace(' Days', 'D') || tf;
                                            const r = res as SearchResult;
                                            return (
                                                <div key={tf} className="flex-1 min-w-[100px] bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm max-w-[140px]">
                                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2 fix-shift">{label}</span>
                                                    <span className="text-3xl font-black text-white font-display leading-none mb-2 fix-shift">#{r.data?.rank}</span>
                                                    <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono bg-green-900/20 px-1.5 py-0.5 rounded fix-shift">
                                                        <TrendingUp size={10} />
                                                        {r.data?.mindshare ? r.data.mindshare.toFixed(1) : 0}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Single Rank Layout */
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em] mb-4 fix-shift">Current Rank</div>
                                        {/* Reduced leading to preventing bounding box from pushing footer */}
                                        <div className="text-7xl sm:text-8xl font-black text-white font-display tracking-tighter leading-[0.85] flex items-start gap-1 mb-6 fix-shift">
                                            <span className="text-4xl sm:text-5xl text-neutral-600 mt-2">#</span>
                                            {singleData?.rank}
                                        </div>
                                        {singleData?.mindshare !== undefined && singleData.mindshare > 0 && (
                                            <div className="bg-neutral-900/60 px-4 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-neutral-300 font-mono fix-shift">Mindshare: <span className="text-white font-bold">{singleData.mindshare.toFixed(2)}%</span></span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Row 3: Footer */}
                            <div className="relative z-10 flex justify-between items-end p-8 pt-0">
                                <div className="flex items-center gap-3">
                                    {imgError ? (
                                        <div className="w-10 h-10 rounded-full border-2 border-neutral-800 bg-neutral-800 flex items-center justify-center text-neutral-500">
                                            <User size={20} />
                                        </div>
                                    ) : (
                                        <img 
                                            src={user.profilePicture} 
                                            className="w-10 h-10 rounded-full border-2 border-neutral-800 bg-neutral-800 object-cover"
                                            alt=""
                                            crossOrigin="anonymous" 
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm leading-tight max-w-[150px] truncate fix-shift">{user.displayName}</span>
                                        <span className="text-neutral-500 text-xs fix-shift">@{user.username}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <span className="text-[10px] text-white/80 font-mono fix-shift">zamapulse.in</span>
                                    <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={downloadCard}
                        disabled={isDownloading}
                        className="flex-1 bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {isDownloading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Download size={18} />}
                        Download Image
                    </button>
                    <button 
                        onClick={shareOnTwitter}
                        className="flex-1 bg-black text-white border border-neutral-700 font-bold py-3 px-4 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Twitter size={18} />
                        Share on X
                    </button>
                    <button 
                        onClick={copyLink}
                        className="sm:w-14 bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-neutral-700 transition-all flex items-center justify-center active:scale-95"
                        title="Copy Website Link"
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
