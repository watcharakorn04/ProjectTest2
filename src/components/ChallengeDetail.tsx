import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Star, 
  Bookmark, 
  CheckCircle, 
  Play, 
  Layers,
  HelpCircle
} from 'lucide-react';

export const ChallengeDetail: React.FC = () => {
  const { challenges, selectedChallengeId, userStats, toggleFavorite, playChallenge, changeView, settings } = useApp();

  const challenge = challenges.find(c => c.id === selectedChallengeId);

  if (!challenge) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <p className="text-slate-400">Challenge not found.</p>
        <button onClick={() => changeView('browse')} className="px-4 py-2 bg-blue-600 rounded-lg text-white">
          Back to browser
        </button>
      </div>
    );
  }

  const isFavorite = userStats.favoriteChallenges.includes(challenge.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12" id="challenge-detail-root">
      
      {/* Back to Browser */}
      <button
        onClick={() => changeView('browse')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        id="detail-back-to-browser-btn"
      >
        <ArrowLeft size={16} />
        <span>Back to Challenges</span>
      </button>

      {/* Main card panel */}
      <div 
        className={`
          bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl
          ${settings.theme === 'cyberpunk' ? 'bg-[#1e122b] border-pink-500/20' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-[#0f1f0f] border-green-500/20 font-mono' : ''}
          ${settings.theme === 'nord' ? 'bg-[#3B4252] border-[#4C566A]' : ''}
        `}
      >
        {/* Banner with accent overlay */}
        <div className="h-32 bg-gradient-to-r from-blue-600/20 via-cyan-600/10 to-indigo-600/20 relative p-6 flex items-end">
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={() => toggleFavorite(challenge.id)}
              className={`p-2.5 rounded-xl border backdrop-blur transition-all cursor-pointer
                ${isFavorite 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }
              `}
              id="detail-favorite-toggle"
            >
              <Bookmark size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider
              ${challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : ''}
              ${challenge.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : ''}
              ${challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : ''}
              ${challenge.difficulty === 'Expert' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : ''}
            `}>
              {challenge.difficulty} Difficulty
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              {challenge.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{challenge.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{challenge.description}</p>
            <p className="text-xs text-slate-500">
              Lab developed by <span className="text-slate-300 font-semibold">{challenge.creator}</span> • {challenge.players} engineers played
            </p>
          </div>

          {/* Metadata quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-lg text-emerald-400 border border-slate-800">
                <Award size={20} />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">XP Reward</div>
                <div className="text-sm font-extrabold text-emerald-400">+{challenge.xpReward} XP</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-lg text-blue-400 border border-slate-800">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Estimated Time</div>
                <div className="text-sm font-extrabold text-white">{challenge.estimatedTime} Minutes</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-lg text-amber-400 border border-slate-800">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">User Rating</div>
                <div className="text-sm font-extrabold text-white">{challenge.rating} / 5.0</div>
              </div>
            </div>
          </div>

          {/* Required Knowledge Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={16} className="text-blue-400" /> Required Knowledge & Pre-requisites
            </h3>
            
            <ul className="space-y-2.5">
              {challenge.requiredKnowledge && challenge.requiredKnowledge.length > 0 ? (
                challenge.requiredKnowledge.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>Basic command structure validation knowledge</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>Understanding of Cisco command line variables and keywords</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Questions summary preview */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} className="text-cyan-400" /> Challenge Questions Break-down
            </h3>
            
            <div className="text-xs text-slate-400">
              This lab contains <span className="text-white font-semibold">{challenge.questions.length}</span> individual questions. You must complete each question correctly to secure full experience points.
            </div>

            <div className="space-y-2 pt-2">
              {challenge.questions.map((q, idx) => (
                <div key={q.id} className="flex items-center gap-3 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                  <span className="w-5 h-5 bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center rounded font-extrabold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 truncate">
                    <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mr-2 bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {q.type === 'command' ? 'CLI Command Writing' : 'Fill Blank'}
                    </span>
                    <span className="text-slate-300">{q.question}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => playChallenge(challenge.id)}
              className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              id="detail-start-play-btn"
            >
              <Play size={16} fill="currentColor" />
              <span>Initiate Configuration Lab</span>
            </button>
            
            <button
              onClick={() => changeView('browse')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm border border-slate-700/50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
