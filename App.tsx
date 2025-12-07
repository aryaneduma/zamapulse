import React, { useState } from 'react';
import RankChecker from './components/RankChecker';
import Leaderboard from './components/Leaderboard';
import { BarChart2, Trophy } from 'lucide-react';

type View = 'checker' | 'leaderboard';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('checker');

    return (
        <div className="min-h-screen relative flex flex-col items-center p-4 sm:p-6 lg:p-12 font-sans selection:bg-yellow-500/30">
            
            {/* Ambient Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

            {/* Navigation Switcher */}
            <nav className="relative z-50 mb-8 sm:mb-12 bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-full border border-neutral-800 shadow-xl flex items-center gap-1">
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
            </nav>

            {/* Content Container */}
            <main className="w-full z-10 flex flex-col items-center min-h-[600px]">
                {currentView === 'checker' ? <RankChecker /> : <Leaderboard />}
            </main>

            {/* Footer */}
            <footer className="mt-20 py-6 text-neutral-600 text-sm font-mono text-center border-t border-white/5 w-full max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <span>Zama Pulse v2.2</span>
                    <span className="opacity-50">Unofficial Analytics Tool</span>
                </div>
            </footer>
        </div>
    );
};

export default App;