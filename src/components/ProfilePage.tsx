import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Flame, 
  Star, 
  User as UserIcon, 
  TrendingUp, 
  Bookmark, 
  PlusCircle, 
  ChevronRight,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, challenges, userStats, changeView, settings } = useApp();

  const [activeSection, setActiveSection] = useState<'activity' | 'created' | 'favorites'>('activity');

  if (!user) return null;

  // Format play time
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  // XP Progress Bar details
  const xpInCurrentLevel = user.xp % 1000;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 1000) * 100);

  // Filter challenges created by user
  const createdChallenges = challenges.filter(c => c.creator.toLowerCase() === user.username.toLowerCase());

  // Filter user bookmarked favorites
  const favoriteChallenges = challenges.filter(c => userStats.favoriteChallenges.includes(c.id));

  // Achievements definitions list
  const allPossibleAchievements = [
    { title: 'First Login', desc: 'Securely registered and accessed the configuration arena.', icon: '🔑', rule: true },
    { title: 'First Challenge Completed', desc: 'Finished your first command validation exercise.', icon: '⚡', rule: userStats.completedChallenges >= 1 },
    { title: 'Challenge Creator', desc: 'Developed and published a custom lab to the browser.', icon: '🛠️', rule: createdChallenges.length >= 1 },
    { title: '100% Accuracy', desc: 'Answered all lab commands perfectly on first attempt.', icon: '🎯', rule: userStats.achievements.includes('100% Accuracy') },
    { title: 'Level 5 Engineer', desc: 'Sustained study and scaled to level 5 rank.', icon: '🎓', rule: user.level >= 5 },
    { title: 'Top 3 Competitor', desc: 'Climbed to a top 3 spot on the competitive leaderboards.', icon: '🏆', rule: user.rank <= 3 }
  ];

  return (
    <div className="space-y-8 pb-12 font-sans" id="profile-root">
      
      {/* Profile Header Block */}
      <div 
        className={`
          p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden
          ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/20' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/20 font-mono' : ''}
          ${settings.theme === 'nord' ? 'bg-[#3B4252] border-[#4C566A]' : ''}
        `}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-950"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span>{user.username}</span>
              <span className="text-xs bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                Level {user.level}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Networking Specialist • {user.email}</p>
            
            {/* Rank display */}
            <div className="text-xs text-slate-500 font-medium">
              Rank <strong className="text-white">#{user.rank}</strong> on Leaderboard with <strong className="text-blue-400">{user.xp} XP</strong>
            </div>
          </div>
        </div>

        {/* Progress bar details */}
        <div className="w-full md:w-80 space-y-2 relative z-10 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">XP Progress</span>
            <span className="text-white">{xpInCurrentLevel}/1000 XP</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-right font-medium">
            Next Level: {1000 - xpInCurrentLevel} XP required
          </div>
        </div>
      </div>

      {/* Grid: Stats Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4" id="profile-stats-grid">
        {[
          { label: 'Completed', value: userStats.completedChallenges, unit: 'labs', color: 'text-blue-400', icon: BookOpen },
          { label: 'Created', value: createdChallenges.length, unit: 'labs', color: 'text-cyan-400', icon: PlusCircle },
          { label: 'Accuracy', value: `${userStats.averageAccuracy}%`, unit: 'average', color: 'text-emerald-400', icon: Award },
          { label: 'Play Time', value: formatTime(userStats.totalPlayTimeSeconds), unit: 'accumulated', color: 'text-purple-400', icon: Clock },
          { label: 'Favorite Cat', value: userStats.favoriteCategory, unit: 'topic', color: 'text-yellow-400', icon: Star },
          { label: 'Daily Streak', value: userStats.currentStreakDays, unit: 'days', color: 'text-amber-500', icon: Flame }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
              <Icon size={16} className={`${stat.color} mx-auto mb-1`} />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{stat.label}</span>
              <p className={`text-sm sm:text-base font-black truncate leading-tight ${stat.color}`}>{stat.value}</p>
              <span className="text-[9px] text-slate-500 block font-medium">{stat.unit}</span>
            </div>
          );
        })}
      </div>

      {/* Grid: Achievements Gallery & Interactive Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Achievements Gallery (Take 2 cols height equivalent) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Award size={16} className="text-yellow-500" />
            Arena Badges ({allPossibleAchievements.filter(a => a.rule).length})
          </h3>

          <div className="space-y-3">
            {allPossibleAchievements.map((ach) => (
              <div 
                key={ach.title} 
                className={`
                  p-3.5 rounded-xl border flex gap-3.5 items-start transition-all
                  ${ach.rule 
                    ? 'bg-slate-950/80 border-slate-800/80' 
                    : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                  }
                `}
              >
                <span className="text-2xl select-none shrink-0">{ach.icon}</span>
                <div className="space-y-0.5">
                  <h4 className={`font-bold text-xs ${ach.rule ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Activity, Created or Favorites Selection Tab */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section tabs */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveSection('activity')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0
                ${activeSection === 'activity' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}
              `}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveSection('created')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0
                ${activeSection === 'created' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}
              `}
            >
              Created Labs ({createdChallenges.length})
            </button>
            <button
              onClick={() => setActiveSection('favorites')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer shrink-0
                ${activeSection === 'favorites' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}
              `}
            >
              Bookmarked Favorites ({favoriteChallenges.length})
            </button>
          </div>

          {/* Section Body */}
          <div className="space-y-4">
            
            {activeSection === 'activity' && (
              <div className="space-y-3" id="profile-recent-activity">
                {userStats.recentActivity.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                    No activity logs recorded. Play some challenges to trace logs!
                  </div>
                ) : (
                  userStats.recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{activity.category}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {activity.date}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{activity.challengeTitle}</h4>
                      </div>

                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
                          <div className={`text-xs font-bold ${activity.accuracy >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                            {activity.accuracy}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Points</div>
                          <div className="text-xs font-bold text-blue-400">{activity.score} pts</div>
                        </div>
                        <button
                          onClick={() => changeView('challenge-detail', activity.challengeId)}
                          className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSection === 'created' && (
              <div className="space-y-3" id="profile-created-challenges">
                {createdChallenges.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <p>You haven't developed any network challenges yet.</p>
                    <button 
                      onClick={() => changeView('create-challenge')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-lg text-white transition-colors"
                    >
                      Develop Your First Lab
                    </button>
                  </div>
                ) : (
                  createdChallenges.map((challenge) => (
                    <div 
                      key={challenge.id} 
                      className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{challenge.category}</span>
                          <span className="text-slate-500">{challenge.players} players</span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{challenge.title}</h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-emerald-400 font-bold">+{challenge.xpReward} XP</span>
                        <button
                          onClick={() => changeView('challenge-detail', challenge.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSection === 'favorites' && (
              <div className="space-y-3" id="profile-favorite-challenges">
                {favoriteChallenges.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                    No bookmarked favorites. Click the bookmark icon on any challenge card to save it here.
                  </div>
                ) : (
                  favoriteChallenges.map((challenge) => (
                    <div 
                      key={challenge.id} 
                      className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{challenge.category}</span>
                          <span className="text-slate-500">By {challenge.creator}</span>
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">{challenge.title}</h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-blue-400 font-medium">Est. {challenge.estimatedTime}m</span>
                        <button
                          onClick={() => changeView('challenge-detail', challenge.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded text-white transition-colors"
                        >
                          Solve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
