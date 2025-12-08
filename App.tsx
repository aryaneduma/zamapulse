
import React, { useState } from 'react';
import RankChecker from './components/RankChecker';
import Leaderboard from './components/Leaderboard';
import DeveloperLeaderboard from './components/DeveloperLeaderboard';
import { BarChart2, Trophy, Code2, ExternalLink, Twitter } from 'lucide-react';

type View = 'checker' | 'leaderboard' | 'developer';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('checker');

    return (
        <div className="min-h-screen relative flex flex-col items-center p-4 sm:p-6 lg:p-12 font-sans selection:bg-yellow-500/30">
            
            {/* Ambient Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

            {/* Navigation Switcher */}
            <nav className="relative z-50 mb-8 sm:mb-12 bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-full border border-neutral-800 shadow-xl flex flex-wrap justify-center gap-1">
                <button
                    onClick={() => setCurrentView('checker')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        currentView === 'checker' 
                            ? 'bg-neutral-800 text-white shadow-md ring-1 ring-white/10' 
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                >
                    <BarChart2 size={16} />
                    Rank Checker
                </button>
                <button
                    onClick={() => setCurrentView('leaderboard')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        currentView === 'leaderboard' 
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                >
                    <Trophy size={16} />
                    Creator Leaderboard
                </button>
                <button
                    onClick={() => setCurrentView('developer')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        currentView === 'developer' 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                >
                    <Code2 size={16} />
                    Dev Leaderboard
                </button>
            </nav>

            {/* Content Container */}
            <main className="w-full z-10 flex flex-col items-center min-h-[600px]">
                {currentView === 'checker' && <RankChecker />}
                {currentView === 'leaderboard' && <Leaderboard />}
                {currentView === 'developer' && <DeveloperLeaderboard />}
            </main>

            {/* Footer */}
            <footer className="mt-32 pb-16 w-full max-w-4xl relative z-10 px-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent -z-10 pointer-events-none" />
                
                <div className="glass-panel rounded-3xl p-1 border-t border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl overflow-hidden">
                    <div className="bg-neutral-900/80 rounded-[22px] px-8 py-10 flex flex-col items-center text-center relative">
                        
                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row justify-between w-full items-center gap-6 mb-12 border-b border-white/10 pb-8 relative z-10">
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Zama Pulse <span className="text-yellow-500 text-xs bg-yellow-500/10 px-2 py-0.5 rounded ml-2 align-middle">v2.2</span></h3>
                                <p className="text-neutral-400 text-sm">The unofficial analytics suite for Zama.</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-neutral-500 text-xs">Data provided by Zama Leaderboard API</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6 relative z-10">
                            <p className="text-neutral-300 text-sm font-medium">Built & Maintained by</p>
                            
                            <a 
                                href="https://x.com/idkerrors" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                                <div className="relative flex items-center gap-4 bg-neutral-900 border border-neutral-700 p-2 pr-6 rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
                                    <div className="relative">
                                        <img 
                                            src="https://unavatar.io/twitter/idkerrors" 
                                            alt="idkerrors" 
                                            className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                                            <div className="bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-black"></div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 group-hover:text-yellow-500/80 transition-colors">Creator</div>
                                        <div className="text-lg font-bold text-white flex items-center gap-2 group-hover:text-yellow-400 transition-colors">
                                            @idkerrors
                                            <ExternalLink size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <div className="mt-4 flex flex-col items-center gap-2">
                                <p className="text-neutral-400 text-xs max-w-xs leading-relaxed">
                                    Need help with the tool or have a feature request?
                                </p>
                                <a 
                                    href="https://x.com/idkerrors" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors border-b border-dashed border-neutral-600 pb-0.5 hover:border-white"
                                >
                                    <Twitter size={12} />
                                    DM for Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
