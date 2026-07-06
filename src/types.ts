export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type QuestionType = 'command' | 'fill_blank';

export interface BaseQuestion {
  id: string | number;
  type: QuestionType;
  question: string;
  explanation: string;
  promptPrefix?: string; // e.g., "Router(config)#" or "Switch(config-if)#"
}

export interface CommandQuestion extends BaseQuestion {
  type: 'command';
  correctAnswer: string[]; // List of expected lines in exact order
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  answer: string; // The text that fills in the blank
}

export type Question = CommandQuestion | FillBlankQuestion;

export interface Challenge {
  id: string | number;
  title: string;
  creator: string;
  difficulty: Difficulty;
  category: string;
  xpReward: number;
  estimatedTime: number; // in minutes
  rating: number;
  players: number;
  description: string;
  requiredKnowledge?: string[];
  questions: Question[];
}

export interface User {
  id: string | number;
  username: string;
  email: string;
  level: number;
  xp: number;
  rank: number;
  avatar: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  score: number;
  completedChallenges: number;
}

export interface RecentActivity {
  id: string;
  challengeId: string | number;
  challengeTitle: string;
  category: string;
  date: string;
  score: number;
  xpEarned: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface UserStats {
  completedChallenges: number;
  createdChallenges: number;
  averageAccuracy: number;
  totalPlayTimeSeconds: number;
  favoriteCategory: string;
  currentStreakDays: number;
  achievements: string[];
  favoriteChallenges: (string | number)[];
  recentActivity: RecentActivity[];
}

export interface AppSettings {
  theme: 'slate' | 'cyberpunk' | 'classic-terminal' | 'nord';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}
