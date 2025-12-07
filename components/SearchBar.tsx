import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
    onSearch: (username: string) => void;
    isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 rounded-2xl blur-lg transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>
            
            <div className="relative flex items-center glass-panel rounded-2xl overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-yellow-500/50 focus-within:border-yellow-500/50 border-neutral-800">
                <div className="pl-6 text-neutral-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter X (Twitter) username..."
                    disabled={isLoading}
                    className="w-full bg-transparent text-white placeholder-neutral-500 px-4 py-5 text-lg outline-none font-medium font-display"
                />
                <div className="pr-2">
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <span className="font-semibold text-sm px-2">Analyze</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
