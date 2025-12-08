
import React, { useState } from 'react';
import RankChecker from './components/RankChecker';
import Leaderboard from './components/Leaderboard';
import DeveloperLeaderboard from './components/DeveloperLeaderboard';
import { BarChart2, Trophy, Code2 } from 'lucide-react';

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
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
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
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
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
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
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
            <footer className="mt-24 py-8 text-neutral-600 font-mono text-center border-t border-white/5 w-full max-w-4xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <span className="text-sm">Zama Pulse v2.2</span>
                    <span className="text-sm opacity-50">Unofficial Analytics Tool</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1.5">
                        <span>Made by</span>
                        <a 
                            href="https://x.com/idkerrors" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-yellow-500 hover:text-yellow-400 font-bold transition-colors flex items-center gap-1"
                        >
                            @idkerrors
                        </a>
                    </div>
                    <div className="text-neutral-500">
                        For any issue/bug or request contact me on X
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
