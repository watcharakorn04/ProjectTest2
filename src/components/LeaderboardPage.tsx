import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Search, Star, Sparkles, Award, UserCheck, Shield } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard, user, settings } = useApp();

  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'monthly' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock modifiers for weekly, monthly or friends to simulate realistic differences
  const modifiedLeaderboard = React.useMemo(() => {
    let list = [...leaderboard];
    
    if (activeTab === 'weekly') {
      // Scale down scores/xp for active weekly range
      list = list.map(item => ({
        ...item,
        xp: Math.round(item.xp * 0.15),
        score: Math.round(item.score * 0.18),
        completedChallenges: Math.max(1, Math.round(item.completedChallenges * 0.2))
      })).sort((a, b) => b.xp - a.xp);
    } else if (activeTab === 'monthly') {
      // Scale down scores/xp for monthly range
      list = list.map(item => ({
        ...item,
        xp: Math.round(item.xp * 0.45),
        score: Math.round(item.score * 0.48),
        completedChallenges: Math.max(1, Math.round(item.completedChallenges * 0.5))
      })).sort((a, b) => b.xp - a.xp);
    } else if (activeTab === 'friends') {
      // Only keep the user and top 2 players
      const topTwoNames = ['PacketWizard', 'CLIHero'];
      list = list.filter(item => 
        item.username.toLowerCase() === user?.username.toLowerCase() || 
        topTwoNames.includes(item.username)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      list = list.filter(item => 
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Re-rank items
    return list.sort((a, b) => b.xp - a.xp).map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [leaderboard, activeTab, searchQuery, user]);

  return (
    <div className="space-y-6 pb-12 font-sans" id="leaderboard-root">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          Competitive Rankings
        </h2>
        <p className="text-sm text-slate-400">Track experience points, scores, and complete challenges to climb to the top of the leaderboards.</p>
      </div>

      {/* Grid: Stats Preview & Search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Performer Box */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 w-max">
              <Sparkles size={11} fill="currentColor" /> Current Champion
            </span>
            <h3 className="text-lg font-bold text-white">
              {modifiedLeaderboard[0]?.username || 'Analyzing...'}
            </h3>
            <p className="text-xs text-slate-400">Leading the scoreboard with {modifiedLeaderboard[0]?.xp || 0} total XP.</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center shrink-0 w-full sm:w-auto relative z-10">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Your Standings</span>
            <div className="text-sm font-extrabold text-blue-400">Rank #{user?.rank || 'N/A'}</div>
            <span className="text-[10px] text-slate-400">{user?.xp || 0} XP</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
          <label htmlFor="search-player" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Find Player
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={15} />
            </div>
            <input 
              type="text" 
              id="search-player"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type username..."
              className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

      </div>

      {/* Leaderboard tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
        {(['global', 'weekly', 'monthly', 'friends'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-3 text-xs font-bold capitalize transition-all border-b-2 cursor-pointer shrink-0
              ${activeTab === tab 
                ? 'border-blue-500 text-blue-400 font-extrabold' 
                : 'border-transparent text-slate-400 hover:text-white'
              }
            `}
            id={`leaderboard-tab-${tab}`}
          >
            {tab} Rankings
          </button>
        ))}
      </div>

      {/* Leaderboard list table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="leaderboard-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-20">Rank</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6 text-right">XP</th>
                <th className="py-4 px-6 text-right">Score</th>
                <th className="py-4 px-6 text-center">Completed Labs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm">
              {modifiedLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs font-medium">
                    No leaderboard participants found.
                  </td>
                </tr>
              ) : (
                modifiedLeaderboard.map((row) => {
                  const isCurrentUser = row.username.toLowerCase() === user?.username.toLowerCase();
                  
                  return (
                    <tr 
                      key={row.username}
                      className={`
                        transition-all
                        ${isCurrentUser ? 'bg-blue-600/5' : 'hover:bg-slate-850/30'}
                        ${settings.theme === 'classic-terminal' ? 'font-mono' : ''}
                      `}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6 text-center font-bold">
                        {row.rank === 1 && <span className="text-xl">🥇</span>}
                        {row.rank === 2 && <span className="text-xl">🥈</span>}
                        {row.rank === 3 && <span className="text-xl">🥉</span>}
                        {row.rank > 3 && <span className="text-slate-400">#{row.rank}</span>}
                      </td>

                      {/* User details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${row.username}`} 
                            alt={row.username} 
                            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span className="truncate">{row.username}</span>
                              {isCurrentUser && (
                                <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                                  <UserCheck size={9} /> You
                                </span>
                              )}
                              {row.rank === 1 && (
                                <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                                  👑 Leader
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">Active Engineer</div>
                          </div>
                        </div>
                      </td>

                      {/* XP Reward column */}
                      <td className="py-4 px-6 text-right font-extrabold text-blue-400">
                        {row.xp} XP
                      </td>

                      {/* Cumulative Score */}
                      <td className="py-4 px-6 text-right font-bold text-slate-200">
                        {row.score} pts
                      </td>

                      {/* Completed counts */}
                      <td className="py-4 px-6 text-center font-semibold text-slate-300">
                        {row.completedChallenges} labs
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
