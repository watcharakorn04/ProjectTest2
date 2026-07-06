import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Award, 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  CheckCircle, 
  XCircle,
  Home,
  Check
} from 'lucide-react';

export const ResultScreen: React.FC = () => {
  const { recentResult, playChallenge, changeView, soundEffect, settings } = useApp();

  const [copied, setCopied] = useState(false);

  if (!recentResult) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-4 max-w-lg mx-auto">
        <p className="text-slate-400 text-sm">No recent result available. Head back to challenges.</p>
        <button 
          onClick={() => changeView('browse')} 
          className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold text-xs"
        >
          Browse Challenges
        </button>
      </div>
    );
  }

  const handleShare = () => {
    soundEffect('click');
    const text = `🏆 Just completed NetConfig Arena challenge: "${recentResult.challengeTitle}"!
🔥 Score: ${recentResult.score} pts
⭐ Accuracy: ${recentResult.accuracy}%
⏳ Time Spent: ${Math.floor(recentResult.timeSpentSeconds / 60)}m ${recentResult.timeSpentSeconds % 60}s
🎮 Level up to LV ${Math.max(1, Math.floor(recentResult.newXp / 1000))} with Rank #${recentResult.newRank}!
Play NetConfig Arena now to master networking commands in your browser!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isLevelUp = Math.floor(recentResult.newXp / 1000) > Math.floor(recentResult.oldXp / 1000);
  const rankImproved = recentResult.newRank < recentResult.oldRank;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 font-sans" id="result-screen-root">
      
      {/* Dynamic Celebration Header */}
      <div className="text-center space-y-3 relative py-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2 relative">
          <Trophy size={42} className="animate-bounce" />
          <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-400" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Lab Phase Authorized</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Successfully verified configuration sequences for <span className="text-white font-semibold">"{recentResult.challengeTitle}"</span>.
        </p>
      </div>

      {/* Primary Score Box */}
      <div 
        className={`
          bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl
          ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/20' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/20 font-mono' : ''}
          ${settings.theme === 'nord' ? 'bg-[#3B4252] border-[#4C566A]' : ''}
        `}
      >
        <div className="grid grid-cols-2 gap-4">
          
          {/* Points Earned */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Final Score</span>
            <p className="text-2xl font-black text-blue-400 leading-none">{recentResult.score}</p>
            <span className="text-[10px] text-slate-500 block">points calculated</span>
          </div>

          {/* XP Reward */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">XP Received</span>
            <p className="text-2xl font-black text-emerald-400 leading-none">+{recentResult.xpEarned}</p>
            <span className="text-[10px] text-slate-500 block">experience points</span>
          </div>

        </div>

        {/* Level Up alert bar if applied */}
        {isLevelUp && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold text-center animate-pulse flex items-center justify-center gap-1.5">
            <span>🎉 LEVEL UP DETECTED! You have climbed to LEVEL {Math.floor(recentResult.newXp / 1000)} 🎉</span>
          </div>
        )}

        {/* Rank Change Box */}
        <div className="mt-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Leaderboard Standing</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Rank</span>
            <span className="text-white font-semibold">#{recentResult.oldRank}</span>
            <ArrowRight size={12} className="text-slate-500" />
            <span className={`font-bold text-sm ${rankImproved ? 'text-green-400' : 'text-blue-400'}`}>
              #{recentResult.newRank} {rankImproved && '▲'}
            </span>
          </div>
        </div>

      </div>

      {/* Detailed metrics summary */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Award size={14} className="text-cyan-400" /> Verification Statistics
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accuracy</span>
            <div className={`text-base font-bold ${recentResult.accuracy >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
              {recentResult.accuracy}%
            </div>
          </div>

          <div className="space-y-1 text-center border-x border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Time Spent</span>
            <div className="text-base font-bold text-white font-mono">
              {formatTime(recentResult.timeSpentSeconds)}
            </div>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mistakes</span>
            <div className={`text-base font-bold ${recentResult.mistakesCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {recentResult.mistakesCount}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex justify-around text-xs">
          <span className="flex items-center gap-1 text-slate-400">
            <CheckCircle size={14} className="text-green-500" />
            <strong className="text-white">{recentResult.correctAnswersCount}</strong> correct commands
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <XCircle size={14} className="text-red-500" />
            <strong className="text-white">{recentResult.mistakesCount}</strong> syntax errors
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          id="share-results-btn"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400 animate-pulse" />
              <span className="text-green-400 font-bold">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>Share Config Stats</span>
            </>
          )}
        </button>

        <button
          onClick={() => playChallenge(recentResult.challengeId)}
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/10 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          id="replay-challenge-btn"
        >
          <RefreshCw size={14} />
          <span>Replay configuration</span>
        </button>

        <button
          onClick={() => changeView('dashboard')}
          className="py-3 px-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold"
          id="back-to-dashboard-results-btn"
        >
          <Home size={14} />
          <span>Dashboard</span>
        </button>
      </div>

    </div>
  );
};
