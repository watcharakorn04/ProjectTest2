import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Terminal, 
  Trophy, 
  BookOpen, 
  User, 
  ArrowRight, 
  Award, 
  Users, 
  Star,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { challenges, leaderboard, changeView, login } = useApp();

  // Get top 3 popular challenges
  const popularChallenges = [...challenges]
    .sort((a, b) => b.players - a.players || b.rating - a.rating)
    .slice(0, 3);

  // Get top 3 players
  const topPlayers = [...leaderboard]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="landing-page-root">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400">
              <Terminal size={22} />
            </div>
            <span className="font-bold tracking-tight text-white text-lg flex items-center gap-1">
              NetConfig <span className="text-blue-500 font-mono text-xs border border-blue-500/30 px-1.5 py-0.5 rounded">ARENA</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => changeView('login')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              id="landing-login-btn"
            >
              Sign In
            </button>
            <button 
              onClick={() => changeView('register')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 shadow-lg shadow-blue-600/10 transition-all hover:-translate-y-0.5"
              id="landing-register-btn"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 flex flex-col items-center justify-center border-b border-slate-900">
        {/* Ambient background decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/10 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Gamified CLI Router Training Arena
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Master Network Configurations <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Through Interactive CLI Battles
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            NetConfig Arena is a web-based training ground. Complete CLI configurations, solve fill-in-the-blank commands, compete with colleagues, and level up your network engineering chops.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                // Instantly log them in as a tester or take to Login page
                login('NetMaster');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-500 shadow-xl shadow-blue-600/15 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              id="landing-quick-start-btn"
            >
              <span>Instant Play (NetMaster)</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => changeView('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 font-medium text-slate-200 hover:bg-slate-700 border border-slate-700/60 transition-all flex items-center justify-center"
              id="landing-register-hero-btn"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-slate-900/40" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Engaging Labs Made Lightweight</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Skip the heavy virtual machines. NetConfig Arena runs directly in your browser, keeping the CLI commands authentic.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-blue-500/30 transition-all group">
              <div className="p-3 w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Terminal size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dual Game Modes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Test yourself with full CLI syntax configuration writing, or perfect command structures in fill-in-the-blank exercises.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-cyan-500/30 transition-all group">
              <div className="p-3 w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                <Users size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">User-Created Content</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your training. Design custom network challenges with exact command validation rules and explanations, then share them with the world.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-indigo-500/30 transition-all group">
              <div className="p-3 w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Trophy size={22} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Competitive Leaderboard</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Climb rankings by earning Experience Points (XP) and score multipliers. Keep streaks alive and prove your configuration expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Challenges & Top Players */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Popular Challenges Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen size={20} className="text-blue-500" />
                Popular Challenges
              </h2>
              <button 
                onClick={() => {
                  login('NetMaster');
                  changeView('browse');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-4">
              {popularChallenges.map((challenge) => (
                <div 
                  key={challenge.id}
                  className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl hover:bg-slate-900/60 transition-all flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : ''}
                        ${challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : ''}
                        ${challenge.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : ''}
                        ${challenge.difficulty === 'Expert' ? 'bg-purple-500/10 text-purple-400' : ''}
                      `}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Category: {challenge.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base truncate">{challenge.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold justify-end">
                        <Star size={13} fill="currentColor" />
                        <span>{challenge.rating}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {challenge.players} players
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        login('NetMaster');
                        changeView('browse', challenge.id);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-all text-slate-400"
                      title="Play Challenge"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Players Preview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              Leaderboard Top
            </h2>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/50">
              {topPlayers.map((player, idx) => (
                <div key={player.username} className="flex items-center gap-3.5 p-4">
                  <div className="w-6 text-center">
                    {idx === 0 && <span className="text-xl">🥇</span>}
                    {idx === 1 && <span className="text-xl">🥈</span>}
                    {idx === 2 && <span className="text-xl">🥉</span>}
                  </div>
                  <img 
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${player.username}`} 
                    alt={player.username} 
                    className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate text-sm">{player.username}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Completed: {player.completedChallenges} labs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-400">{player.xp} XP</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{player.score} pts</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-5 text-center space-y-2">
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Ready to compete?</div>
              <p className="text-xs text-slate-400">Join other engineers now to secure your spot at the top of the arena.</p>
              <button 
                onClick={() => changeView('register')}
                className="w-full py-2 bg-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-500 text-white transition-colors"
              >
                Sign Up Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-auto bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 NetConfig Arena. Designed for networking professionals, students, and CCNA aspirants.
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-300">Features</a>
            <button onClick={() => changeView('login')} className="hover:text-slate-300">Sign In</button>
            <button onClick={() => changeView('register')} className="hover:text-slate-300">Create Account</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
