import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Challenge, LeaderboardEntry, UserStats, AppSettings, RecentActivity, Question
} from '../types';
import { DEFAULT_CHALLENGES } from '../data/defaultChallenges';

interface AppContextType {
  user: User | null;
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  userStats: UserStats;
  settings: AppSettings;
  currentView: string;
  selectedChallengeId: string | number | null;
  recentResult: {
    challengeId: string | number;
    challengeTitle: string;
    score: number;
    xpEarned: number;
    accuracy: number;
    timeSpentSeconds: number;
    correctAnswersCount: number;
    mistakesCount: number;
    oldXp: number;
    newXp: number;
    oldRank: number;
    newRank: number;
  } | null;
  login: (username: string) => boolean;
  register: (username: string, email: string) => boolean;
  logout: () => void;
  createChallenge: (challenge: Omit<Challenge, 'id' | 'creator' | 'rating' | 'players'>) => void;
  toggleFavorite: (id: string | number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  changeView: (view: string, id?: string | number | null) => void;
  playChallenge: (id: string | number) => void;
  finishChallenge: (score: number, accuracy: number, timeSpentSeconds: number, correctCount: number, mistakesCount: number) => void;
  soundEffect: (type: 'success' | 'click' | 'error' | 'level-up') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'slate',
  fontSize: 'base',
  soundEnabled: true,
  notificationsEnabled: true,
  language: 'en'
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "NetworkKing", xp: 9450, score: 12800, completedChallenges: 122 },
  { rank: 2, username: "PacketWizard", xp: 9020, score: 12110, completedChallenges: 110 },
  { rank: 3, username: "CLIHero", xp: 8875, score: 11840, completedChallenges: 98 },
  { rank: 4, username: "RouterRanger", xp: 5120, score: 7100, completedChallenges: 62 },
  { rank: 5, username: "SubnetSamurai", xp: 3200, score: 4800, completedChallenges: 44 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('net_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const stored = localStorage.getItem('net_challenges');
    return stored ? JSON.parse(stored) : DEFAULT_CHALLENGES;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const stored = localStorage.getItem('net_leaderboard');
    return stored ? JSON.parse(stored) : DEFAULT_LEADERBOARD;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem('net_user_stats');
    if (stored) return JSON.parse(stored);
    return {
      completedChallenges: 0,
      createdChallenges: 0,
      averageAccuracy: 0,
      totalPlayTimeSeconds: 0,
      favoriteCategory: 'N/A',
      currentStreakDays: 1,
      achievements: ['First Login'],
      favoriteChallenges: [],
      recentActivity: []
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem('net_settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | number | null>(null);
  const [recentResult, setRecentResult] = useState<AppContextType['recentResult']>(null);

  // Persistence triggers
  useEffect(() => {
    if (user) {
      localStorage.setItem('net_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('net_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('net_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('net_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('net_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('net_settings', JSON.stringify(settings));
  }, [settings]);

  // Audio helper
  const soundEffect = (type: 'success' | 'click' | 'error' | 'level-up') => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'level-up') {
        // Arpeggio
        osc.type = 'sine';
        const freqs = [261.63, 329.63, 392.00, 523.25]; // C major
        freqs.forEach((f, i) => {
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
        });
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      // Audio context block safely ignored
    }
  };

  // Auth
  const login = (username: string): boolean => {
    if (!username.trim()) return false;
    soundEffect('click');
    const existingLeaderboardEntry = leaderboard.find(l => l.username.toLowerCase() === username.toLowerCase());
    
    const loggedUser: User = {
      id: existingLeaderboardEntry ? username : Math.random().toString(36).substr(2, 9),
      username,
      email: `${username.toLowerCase()}@example.com`,
      level: existingLeaderboardEntry ? Math.max(1, Math.floor(existingLeaderboardEntry.xp / 1000)) : 1,
      xp: existingLeaderboardEntry ? existingLeaderboardEntry.xp : 0,
      rank: existingLeaderboardEntry ? existingLeaderboardEntry.rank : leaderboard.length + 1,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`
    };

    setUser(loggedUser);

    // If user is not in leaderboard, add them
    if (!existingLeaderboardEntry) {
      const newEntry: LeaderboardEntry = {
        rank: leaderboard.length + 1,
        username,
        xp: 0,
        score: 0,
        completedChallenges: 0
      };
      const updatedLeaderboard = [...leaderboard, newEntry];
      recalculateRanks(updatedLeaderboard, loggedUser.id, username);
    } else {
      recalculateRanks(leaderboard, loggedUser.id, username);
    }

    setCurrentView('dashboard');
    return true;
  };

  const register = (username: string, email: string): boolean => {
    if (!username.trim() || !email.trim()) return false;
    soundEffect('click');

    const loggedUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      level: 1,
      xp: 0,
      rank: leaderboard.length + 1,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`
    };

    setUser(loggedUser);

    const newEntry: LeaderboardEntry = {
      rank: leaderboard.length + 1,
      username,
      xp: 0,
      score: 0,
      completedChallenges: 0
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry];
    recalculateRanks(updatedLeaderboard, loggedUser.id, username);
    setCurrentView('dashboard');
    return true;
  };

  const logout = () => {
    soundEffect('click');
    setUser(null);
    setCurrentView('landing');
    setRecentResult(null);
    setSelectedChallengeId(null);
  };

  // Helper to sync ranks inside leaderboard
  const recalculateRanks = (list: LeaderboardEntry[], activeUserId: string | number, activeUsername: string) => {
    // Sort by XP descending, then score descending
    const sorted = [...list].sort((a, b) => b.xp - a.xp || b.score - a.score);
    const withRanks = sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
    
    setLeaderboard(withRanks);

    // Update active user's rank if they are logged in
    const myEntry = withRanks.find(e => e.username.toLowerCase() === activeUsername.toLowerCase());
    if (myEntry && user) {
      setUser(prev => prev ? { ...prev, rank: myEntry.rank, xp: myEntry.xp, level: Math.max(1, Math.floor(myEntry.xp / 1000)) } : null);
    }
  };

  // Create challenge
  const createChallenge = (challengeData: Omit<Challenge, 'id' | 'creator' | 'rating' | 'players'>) => {
    soundEffect('success');
    const newChallenge: Challenge = {
      ...challengeData,
      id: 200 + challenges.length,
      creator: user ? user.username : 'Anonymous',
      rating: 5.0,
      players: 0
    };

    setChallenges(prev => [...prev, newChallenge]);
    
    setUserStats(prev => {
      const createdCount = prev.createdChallenges + 1;
      const achievements = [...prev.achievements];
      if (createdCount === 1 && !achievements.includes('Challenge Creator')) {
        achievements.push('Challenge Creator');
      }
      return {
        ...prev,
        createdChallenges: createdCount,
        achievements
      };
    });

    setCurrentView('dashboard');
  };

  const toggleFavorite = (id: string | number) => {
    soundEffect('click');
    setUserStats(prev => {
      const isFav = prev.favoriteChallenges.includes(id);
      const favoriteChallenges = isFav
        ? prev.favoriteChallenges.filter(favId => favId !== id)
        : [...prev.favoriteChallenges, id];
      return {
        ...prev,
        favoriteChallenges
      };
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    soundEffect('click');
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const changeView = (view: string, id: string | number | null = null) => {
    soundEffect('click');
    setCurrentView(view);
    if (id !== null) {
      setSelectedChallengeId(id);
    }
  };

  const playChallenge = (id: string | number) => {
    soundEffect('click');
    setSelectedChallengeId(id);
    setCurrentView('play-challenge');
  };

  // Complete a challenge & update user XP, rankings, stats
  const finishChallenge = (
    score: number, 
    accuracy: number, 
    timeSpentSeconds: number,
    correctCount: number,
    mistakesCount: number
  ) => {
    if (!selectedChallengeId) return;

    const challenge = challenges.find(c => c.id === selectedChallengeId);
    if (!challenge) return;

    const earnedXp = Math.floor(challenge.xpReward * (accuracy / 100));
    const oldXp = user ? user.xp : 0;
    const newXp = oldXp + earnedXp;

    const oldLevel = user ? user.level : 1;
    const newLevel = Math.max(1, Math.floor(newXp / 1000));
    
    if (newLevel > oldLevel) {
      soundEffect('level-up');
    } else {
      soundEffect('success');
    }

    // Record activity
    const activity: RecentActivity = {
      id: Math.random().toString(36).substr(2, 9),
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      category: challenge.category,
      date: new Date().toLocaleDateString(),
      score,
      xpEarned: earnedXp,
      accuracy,
      timeSpentSeconds
    };

    // Increment challenge dynamic metadata
    setChallenges(prev => prev.map(c => {
      if (c.id === challenge.id) {
        return {
          ...c,
          players: c.players + 1
        };
      }
      return c;
    }));

    const oldRank = user ? user.rank : leaderboard.length;

    // Update leaderboard and ranks
    const currentUsername = user ? user.username : 'Player';
    const updatedLeaderboard = leaderboard.map(entry => {
      if (entry.username.toLowerCase() === currentUsername.toLowerCase()) {
        const isNewCompletion = !userStats.recentActivity.some(act => act.challengeId === challenge.id);
        return {
          ...entry,
          xp: entry.xp + earnedXp,
          score: entry.score + score,
          completedChallenges: entry.completedChallenges + (isNewCompletion ? 1 : 0)
        };
      }
      return entry;
    });

    // Check if player is on leaderboard at all (just in case they logged in as something else)
    const exists = updatedLeaderboard.some(e => e.username.toLowerCase() === currentUsername.toLowerCase());
    let finalLeaderboard = updatedLeaderboard;
    if (!exists) {
      finalLeaderboard = [...updatedLeaderboard, {
        rank: leaderboard.length + 1,
        username: currentUsername,
        xp: earnedXp,
        score: score,
        completedChallenges: 1
      }];
    }

    // Sort and rank
    const sorted = [...finalLeaderboard].sort((a, b) => b.xp - a.xp || b.score - a.score);
    const withRanks = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    setLeaderboard(withRanks);

    const myNewEntry = withRanks.find(e => e.username.toLowerCase() === currentUsername.toLowerCase());
    const newRank = myNewEntry ? myNewEntry.rank : oldRank;

    // Update state user
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        xp: newXp,
        level: newLevel,
        rank: newRank
      } : null);
    }

    // Update user stats
    setUserStats(prev => {
      const nextRecent = [activity, ...prev.recentActivity];
      const nextCompleted = prev.completedChallenges + 1;
      
      // Calculate overall accuracy
      const totalAcc = prev.recentActivity.reduce((acc, curr) => acc + curr.accuracy, 0) + accuracy;
      const avgAccuracy = Math.round(totalAcc / nextRecent.length);

      // Favorite category
      const categories = nextRecent.map(r => r.category);
      const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      let favoriteCategory = prev.favoriteCategory;
      let maxCount = 0;
      (Object.entries(categoryCounts) as [string, number][]).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteCategory = cat;
        }
      });

      // Achievements triggers
      const achievements = [...prev.achievements];
      if (nextCompleted >= 1 && !achievements.includes('First Challenge Completed')) {
        achievements.push('First Challenge Completed');
      }
      if (accuracy === 100 && !achievements.includes('100% Accuracy')) {
        achievements.push('100% Accuracy');
      }
      if (newLevel >= 5 && !achievements.includes('Level 5 Engineer')) {
        achievements.push('Level 5 Engineer');
      }
      if (newRank <= 3 && !achievements.includes('Top 3 Competitor')) {
        achievements.push('Top 3 Competitor');
      }

      return {
        ...prev,
        completedChallenges: nextCompleted,
        averageAccuracy: avgAccuracy,
        totalPlayTimeSeconds: prev.totalPlayTimeSeconds + timeSpentSeconds,
        favoriteCategory,
        achievements
      };
    });

    setRecentResult({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      score,
      xpEarned: earnedXp,
      accuracy,
      timeSpentSeconds,
      correctAnswersCount: correctCount,
      mistakesCount,
      oldXp,
      newXp,
      oldRank,
      newRank
    });

    setCurrentView('results');
  };

  return (
    <AppContext.Provider value={{
      user,
      challenges,
      leaderboard,
      userStats,
      settings,
      currentView,
      selectedChallengeId,
      recentResult,
      login,
      register,
      logout,
      createChallenge,
      toggleFavorite,
      updateSettings,
      changeView,
      playChallenge,
      finishChallenge,
      soundEffect
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
