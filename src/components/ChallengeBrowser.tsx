import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Star, 
  Bookmark, 
  Clock, 
  Award, 
  Filter, 
  ArrowUpDown, 
  Terminal, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Difficulty, Challenge } from '../types';

export const ChallengeBrowser: React.FC = () => {
  const { challenges, userStats, toggleFavorite, playChallenge, changeView, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating'); // 'rating' | 'xp' | 'players' | 'title'

  // Extract unique categories from all challenges
  const categories = useMemo(() => {
    const list = challenges.map(c => c.category);
    return ['All', ...Array.from(new Set(list))];
  }, [challenges]);

  // Filter and sort challenges
  const filteredAndSortedChallenges = useMemo(() => {
    return challenges
      .filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.creator.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
        const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;

        return matchesSearch && matchesDifficulty && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'xp') return b.xpReward - a.xpReward;
        if (sortBy === 'players') return b.players - a.players;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [challenges, searchQuery, selectedDifficulty, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-12" id="challenge-browser-root">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="text-blue-500" size={24} />
          Challenge Arena
        </h2>
        <p className="text-sm text-slate-400">Search, filter, and tackle dynamic networking exercises designed by the community.</p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search size={18} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or creator..."
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="challenge-search-input"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg shrink-0">
            <ArrowUpDown size={15} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-4"
              id="challenge-sort-select"
            >
              <option value="rating" className="bg-slate-950 text-white">Sort by Rating</option>
              <option value="xp" className="bg-slate-950 text-white">Sort by XP Reward</option>
              <option value="players" className="bg-slate-950 text-white">Sort by Popularity</option>
              <option value="title" className="bg-slate-950 text-white">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Categories and Difficulties quick filters */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800/60">
          
          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={11} /> Diff:
            </span>
            {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-all
                  ${selectedDifficulty === diff 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
                id={`filter-difficulty-${diff}`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block h-4 w-px bg-slate-800" />

          {/* Category filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-all
                  ${selectedCategory === cat 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                  }
                `}
                id={`filter-category-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Grid of Challenges */}
      {filteredAndSortedChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
          <Terminal size={40} className="text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">No challenges match your search filters.</p>
          <p className="text-slate-500 text-xs">Try clearing the search box or selecting 'All' difficulties.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="challenges-grid">
          {filteredAndSortedChallenges.map((challenge) => {
            const isFavorite = userStats.favoriteChallenges.includes(challenge.id);
            
            return (
              <div 
                key={challenge.id}
                className={`
                  p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between group relative
                  ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/10 hover:border-pink-500/30' : ''}
                  ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/10 hover:border-green-500/30 font-mono' : ''}
                `}
              >
                {/* Favorite Bookmark Badge */}
                <button
                  onClick={() => toggleFavorite(challenge.id)}
                  className={`
                    absolute top-5 right-5 p-2 rounded-full border transition-all cursor-pointer z-10
                    ${isFavorite 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white hover:bg-slate-800'
                    }
                  `}
                  title={isFavorite ? "Remove from favorites" : "Bookmark challenge"}
                  id={`favorite-btn-${challenge.id}`}
                >
                  <Bookmark size={15} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="space-y-3">
                  {/* Category & Difficulty badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider
                      ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : ''}
                      ${challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : ''}
                      ${challenge.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : ''}
                      ${challenge.difficulty === 'Expert' ? 'bg-purple-500/10 text-purple-400' : ''}
                    `}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/10">
                      {challenge.category}
                    </span>
                  </div>

                  {/* Title & Creator */}
                  <div className="space-y-0.5">
                    <h3 
                      onClick={() => changeView('challenge-detail', challenge.id)}
                      className="font-bold text-white text-base group-hover:text-blue-400 transition-colors cursor-pointer leading-tight line-clamp-1"
                      title={challenge.title}
                    >
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Created by <span className="text-slate-400 font-medium">{challenge.creator}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[36px]">
                    {challenge.description}
                  </p>
                </div>

                {/* Footer section with details */}
                <div className="pt-4 border-t border-slate-800/50 mt-5 space-y-4">
                  {/* Rating / Plays */}
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{challenge.estimatedTime} mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star size={13} fill="currentColor" />
                        <span>{challenge.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{challenge.players} players</span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Award size={15} />
                      <span>+{challenge.xpReward} XP</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => changeView('challenge-detail', challenge.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-400 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => playChallenge(challenge.id)}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-blue-600/10 flex items-center gap-1"
                      >
                        <span>Start</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
