
import React, { useState } from 'react';
import { Terminal, Search, Code2, Hammer, Cpu, GitCommit, Shield, Github, ExternalLink, Play, CheckCircle2, Layers } from 'lucide-react';
import { JULY_2025_PROJECTS, AUGUST_2025_PROJECTS, SEPTEMBER_2025_PROJECTS, OCTOBER_2025_PROJECTS, DevProject } from '../data/developerSeasons.ts';

const DEV_SEASONS = [
    { id: 'july_25', label: 'July 2025', status: 'completed' },
    { id: 'aug_25', label: 'August 2025', status: 'completed' },
    { id: 'sep_25', label: 'September 2025', status: 'completed' },
    { id: 'oct_25', label: 'October 2025', status: 'completed' },
    { id: 'nov_25', label: 'November 2025', status: 'upcoming' },
];

const DeveloperLeaderboard: React.FC = () => {
    // Default to the most recent season (the last one in the list)
    const [selectedSeason, setSelectedSeason] = useState<string>(DEV_SEASONS[DEV_SEASONS.length - 1].id);
    const [searchQuery, setSearchQuery] = useState('');

    // Determine data source based on season
    let projects: DevProject[] = [];
    if (selectedSeason === 'july_25') {
        projects = JULY_2025_PROJECTS;
    } else if (selectedSeason === 'aug_25') {
        projects = AUGUST_2025_PROJECTS;
    } else if (selectedSeason === 'sep_25') {
        projects = SEPTEMBER_2025_PROJECTS;
    } else if (selectedSeason === 'oct_25') {
        projects = OCTOBER_2025_PROJECTS;
    }

    const isUpcoming = projects.length === 0;

    const filteredProjects = projects.filter(p => 
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Grouping Logic
    const categories = Array.from(new Set(filteredProjects.map(p => p.category).filter(Boolean))) as string[];
    const hasCategories = categories.length > 0;

    const renderProjectCard = (project: DevProject, index: number) => (
        <div key={`${project.username}-${index}`} className="glass-panel rounded-2xl p-6 border border-neutral-800 hover:border-green-500/30 transition-all duration-300 group relative overflow-hidden h-full">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-colors pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                {/* Left: Avatar & Rank */}
                <div className="flex-shrink-0 flex lg:flex-col items-center gap-4 lg:w-24 lg:border-r border-neutral-800 lg:pr-6">
                    {/* Rank is only relevant if not categorized or if we want to show global rank, but for categories, maybe just an index is fine */}
                    <div className="text-4xl font-bold font-display text-neutral-700 group-hover:text-green-500/50 transition-colors">
                        #{index + 1}
                    </div>
                    <img 
                        src={`https://github.com/${project.username}.png`} 
                        alt={project.username}
                        className="w-16 h-16 rounded-xl border border-neutral-700 shadow-lg bg-black"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${project.username}&background=random`;
                        }}
                    />
                </div>

                {/* Middle: Info */}
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="text-2xl font-bold text-white font-display group-hover:text-green-400 transition-colors">
                            {project.projectName}
                        </h3>
                        <a 
                            href={`https://github.com/${project.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors self-start sm:self-center"
                        >
                            @{project.username}
                        </a>
                    </div>
                    
                    <p className="text-neutral-400 leading-relaxed mb-4 text-sm max-w-3xl">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <a 
                            href={project.repoUrl}
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <Github size={14} /> Repository
                        </a>
                        {project.demoUrl && (
                            <a 
                                href={project.demoUrl}
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                        {project.videoUrl && (
                            <a 
                                href={project.videoUrl}
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                                <Play size={14} /> Demo Video
                            </a>
                        )}
                    </div>
                </div>

                {/* Right: Prize */}
                <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center lg:w-32 lg:pl-6 lg:border-l border-neutral-800 mt-4 lg:mt-0">
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Prize</div>
                    <div className="text-xl font-bold font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20 whitespace-nowrap">
                        {project.prize}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="w-full max-w-6xl flex flex-col items-center animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 mb-3 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <Terminal className="text-green-500" size={16} />
                    <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Devs & Builders</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-display text-white mt-2 text-glow">Developer Leaderboard</h2>
                <p className="text-neutral-400 mt-3 text-lg font-light">Tracking contributions to the Zama ecosystem</p>
            </div>

            {/* Season Selector */}
            <div className="w-full overflow-x-auto pb-6 mb-2 no-scrollbar">
                <div className="flex justify-center min-w-max gap-3 px-4">
                    {DEV_SEASONS.map((season) => {
                        const isActive = selectedSeason === season.id;
                        return (
                            <button
                                key={season.id}
                                onClick={() => setSelectedSeason(season.id)}
                                className={`relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border ${
                                    isActive
                                        ? 'bg-green-500 text-black border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105'
                                        : 'bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:border-green-500/30 hover:text-green-400'
                                }`}
                            >
                                {season.label}
                                {season.status === 'completed' && isActive && <CheckCircle2 size={14} className="text-black" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search Bar */}
            {!isUpcoming && (
                <div className="w-full max-w-lg mb-10 relative z-20">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-lg transition-opacity opacity-50 group-hover:opacity-100"></div>
                        <div className="relative flex items-center bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl focus-within:border-green-500/50 focus-within:ring-1 focus-within:ring-green-500/50 transition-all">
                            <div className="pl-4 text-neutral-500">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects or builders..."
                                className="w-full bg-transparent border-none text-white px-4 py-4 outline-none placeholder:text-neutral-600 font-display"
                            />
                        </div>
                    </form>
                </div>
            )}

            {/* Content Area */}
            <div className="w-full px-4">
                {isUpcoming ? (
                    <div className="w-full glass-panel rounded-3xl border border-neutral-800 shadow-2xl p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                            <div className="relative bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                                <Code2 size={48} className="text-green-500" />
                            </div>
                        </div>
                        <div className="max-w-md space-y-2">
                            <h3 className="text-2xl font-bold text-white font-display">
                                {DEV_SEASONS.find(s => s.id === selectedSeason)?.label} Season
                            </h3>
                            <p className="text-neutral-400">
                                {selectedSeason === 'nov_25' 
                                    ? "Coming soon. All submissions are under review."
                                    : "Leaderboard data for this season is not yet available. Start building to earn your spot!"
                                }
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                            <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Status</div>
                                <div className="text-green-400 font-mono font-bold flex items-center justify-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Upcoming
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Pool</div>
                                <div className="text-white font-mono font-bold">TBA</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {hasCategories ? (
                            <div className="space-y-12">
                                {categories.map(category => {
                                    const categoryProjects = filteredProjects.filter(p => p.category === category);
                                    if (categoryProjects.length === 0) return null;
                                    
                                    return (
                                        <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                                                <Layers className="text-green-500" size={24} />
                                                <h3 className="text-2xl font-bold text-white font-display">{category}</h3>
                                                <span className="bg-neutral-800 text-neutral-400 text-xs font-bold px-2 py-1 rounded-md">
                                                    {categoryProjects.length} Projects
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {categoryProjects.map((project, index) => renderProjectCard(project, index))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredProjects.map((project, index) => renderProjectCard(project, index))}
                            </div>
                        )}
                        
                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12 text-neutral-500">
                                No projects found matching your search.
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

export default DeveloperLeaderboard;
