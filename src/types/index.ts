export interface AITAPost {
  id: string;
  title: string;
  content: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
}

export interface Comment {
  body: string;
  score: number;
  author: string;
  created_utc: number;
}

export interface Verdict {
  type: 'YTA' | 'NTA' | 'ESH' | 'NAH';
  label: string;
  description: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface UserStats {
  uid: string;
  totalJudgments: number;
  correctJudgments: number;
  currentStreak: number;
  bestStreak: number;
  xp: number;
  level: number;
  rank: string;
  updatedAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
}

export interface GameState {
  currentPostIndex: number;
  posts: AITAPost[];
  userStats: UserStats;
  challenges: Challenge[];
  showVerdict: boolean;
  lastJudgment?: {
    userVerdict: Verdict;
    redditVerdict: Verdict;
    isCorrect: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}