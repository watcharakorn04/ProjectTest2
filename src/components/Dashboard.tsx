import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  BookOpen, 
  PlusCircle, 
  Clock, 
  Award, 
  Zap, 
  Flame, 
  Star, 
  ArrowRight,
  TrendingUp,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, challenges, userStats, changeView, playChallenge, settings } = useApp();

  if (!user) return null;

  // Render XP bar details
  const xpInCurrentLevel = user.xp % 1000;
  const xpNeededForNext = 1000 - xpInCurrentLevel;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 1000) * 100);

  // Daily Recommended (Select 2 challenges that the user hasn't completed or just popular ones)
  const completedIds = userStats.recentActivity.map(a => a.challengeId);
  const recommended = challenges
    .filter(c => !completedIds.includes(c.id))
    .slice(0, 2);

  // Fallback if all are completed
  const dailyRecommendations = recommended.length > 0 
    ? recommended 
    : challenges.slice(0, 2);

  // Get recently played challenges from user stats
  const recentPlayedList = userStats.recentActivity.slice(0, 3);

  const creators = [
    { name: 'CiscoFan', title: 'CCNP Instructor', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CiscoFan', challenges: 15 },
    { name: 'CLIHero', title: 'Network Architect', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CLIHero', challenges: 12 },
    { name: 'PacketWizard', title: 'Technical Trainer', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=PacketWizard', challenges: 9 },
  ];

  // Formatting helper for time
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-8 pb-12" id="dashboard-root">
      
      {/* Top Welcome / Status Card */}
      <div 
        className={`
          p-8 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6
          ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/20' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/20 font-mono' : ''}
          ${settings.theme === 'nord' ? 'bg-[#3B4252] border-[#4C566A]' : ''}
        `}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="space-y-2 relative z-10 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-600/10 text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Ready to configuration
            </span>
            {userStats.currentStreakDays > 0 && (
              <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame size={12} fill="currentColor" /> {userStats.currentStreakDays} Day Streak
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">{user.username}</span>!
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            You've completed <span className="text-white font-semibold">{userStats.completedChallenges}</span> CLI labs with an average accuracy of <span className="text-green-400 font-semibold">{userStats.averageAccuracy}%</span>. Continue your training below.
          </p>
        </div>

        {/* Quick Level-XP Box */}
        <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl min-w-[240px] w-full md:w-auto shrink-0 space-y-3 relative z-10">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Rank & Level</span>
            <span className="text-blue-400 font-bold">LV {user.level} (Rank #{user.rank})</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">XP Progress</span>
              <span className="text-white">{xpInCurrentLevel}/1000 XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-right font-medium">
              {xpNeededForNext} XP required for Level {user.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="dashboard-quick-actions">
        <button 
          onClick={() => changeView('browse')}
          className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800 hover:border-blue-500/30 text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Browse Challenges</h4>
            <p className="text-xs text-slate-400">Explore CLI simulator labs</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <BookOpen size={16} />
          </div>
        </button>

        <button 
          onClick={() => changeView('create-challenge')}
          className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800 hover:border-cyan-500/30 text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Create Challenge</h4>
            <p className="text-xs text-slate-400">Build & share custom commands</p>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-600/10 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <PlusCircle size={16} />
          </div>
        </button>

        <button 
          onClick={() => changeView('leaderboard')}
          className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800 hover:border-indigo-500/30 text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">View Rankings</h4>
            <p className="text-xs text-slate-400">Climb weekly & global charts</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Trophy size={16} />
          </div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Recommendations & Recently Played */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Daily Challenges */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Daily Recommended Labs
              </h3>
              <button 
                onClick={() => changeView('browse')} 
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <span>See all</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dailyRecommendations.map((challenge) => (
                <div 
                  key={challenge.id}
                  className={`
                    p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group
                    ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/10' : ''}
                    ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/10 font-mono' : ''}
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : ''}
                        ${challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : ''}
                        ${challenge.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : ''}
                        ${challenge.difficulty === 'Expert' ? 'bg-purple-500/10 text-purple-400' : ''}
                      `}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-blue-400 font-bold">+{challenge.xpReward} XP</span>
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{challenge.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{challenge.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-medium">Est. {challenge.estimatedTime} mins</span>
                    <button 
                      onClick={() => playChallenge(challenge.id)}
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Play</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recently Played */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Recently Played Labs
            </h3>

            {recentPlayedList.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 space-y-2">
                <p className="text-slate-400 text-xs">No configuration challenges attempted yet.</p>
                <button 
                  onClick={() => changeView('browse')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg text-white transition-colors"
                >
                  Start Your First Challenge
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl divide-y divide-slate-800/40 overflow-hidden">
                {recentPlayedList.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-400/5 px-1.5 py-0.5 rounded border border-blue-400/10">
                          {activity.category}
                        </span>
                        <span className="text-slate-500">{activity.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">{activity.challengeTitle}</h4>
                    </div>

                    <div className="flex items-center gap-6 text-right shrink-0">
                      <div>
                        <div className="text-xs font-bold text-slate-200">Accuracy</div>
                        <div className={`text-xs font-bold ${activity.accuracy >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                          {activity.accuracy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Time</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {formatTime(activity.timeSpentSeconds)}
                        </div>
                      </div>
                      <button 
                        onClick={() => playChallenge(activity.challengeId)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Replay challenge"
                      >
                        <TrendingUp size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right column: Popular Creators & Stats Card */}
        <div className="space-y-8">
          
          {/* User Performance Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-indigo-400" /> Performance Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Acc.</span>
                <p className="text-xl font-bold text-green-400">{userStats.averageAccuracy}%</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Play Time</span>
                <p className="text-xl font-bold text-indigo-400">{formatTime(userStats.totalPlayTimeSeconds)}</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daily Streak</span>
                <p className="text-xl font-bold text-amber-500">{userStats.currentStreakDays} Days</p>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed</span>
                <p className="text-xl font-bold text-blue-400">{userStats.completedChallenges}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Achievements ({userStats.achievements.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {userStats.achievements.map((ach) => (
                  <span key={ach} className="text-[10px] bg-slate-800/80 text-amber-400 border border-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                    🏆 {ach}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Popular Creators */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <UserIcon size={16} className="text-cyan-400" />
              Arena Top Creators
            </h3>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              {creators.map((creator) => (
                <div key={creator.name} className="flex items-center justify-between gap-3 p-2 hover:bg-slate-800/30 rounded-lg transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{creator.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{creator.title}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded font-medium border border-cyan-800/10">
                      {creator.challenges} labs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
