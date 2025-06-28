import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, isDevelopmentMode } from '../config/firebase';
import { UserStats, Verdict } from '../types';

// Local storage key for development mode
const DEV_STATS_KEY = 'dev-user-stats';

const createInitialStats = (uid: string): UserStats => ({
  uid,
  totalJudgments: 0,
  correctJudgments: 0,
  currentStreak: 0,
  bestStreak: 0,
  xp: 0,
  level: 1,
  rank: 'Novice Judge',
  updatedAt: Date.now(),
});

export const getUserStats = async (uid: string): Promise<UserStats> => {
  if (isDevelopmentMode) {
    // Development mode - use localStorage
    const saved = localStorage.getItem(DEV_STATS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to parse dev stats:', error);
      }
    }
    const initialStats = createInitialStats(uid);
    localStorage.setItem(DEV_STATS_KEY, JSON.stringify(initialStats));
    return initialStats;
  }

  try {
    const statsRef = doc(db, 'userStats', uid);
    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
      // Create initial stats if they don't exist
      const initialStats = createInitialStats(uid);

      await setDoc(statsRef, {
        ...initialStats,
        updatedAt: serverTimestamp(),
      });

      return initialStats;
    }

    return {
      ...statsSnap.data() as UserStats,
      updatedAt: statsSnap.data()?.updatedAt?.toMillis?.() || Date.now(),
    };
  } catch (error) {
    console.error('Failed to get user stats from Firestore:', error);
    
    // Fallback to localStorage if Firestore fails
    const fallbackKey = `user-stats-${uid}`;
    const saved = localStorage.getItem(fallbackKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (parseError) {
        console.error('Failed to parse fallback stats:', parseError);
      }
    }
    
    // Return initial stats as last resort
    const initialStats = createInitialStats(uid);
    localStorage.setItem(fallbackKey, JSON.stringify(initialStats));
    return initialStats;
  }
};

export const updateUserStats = async (
  uid: string, 
  isCorrect: boolean, 
  xpGained: number
): Promise<UserStats> => {
  const currentStats = await getUserStats(uid);

  const newTotalJudgments = currentStats.totalJudgments + 1;
  const newCorrectJudgments = currentStats.correctJudgments + (isCorrect ? 1 : 0);
  const newCurrentStreak = isCorrect ? currentStats.currentStreak + 1 : 0;
  const newBestStreak = Math.max(currentStats.bestStreak, newCurrentStreak);
  const newXp = Math.max(0, currentStats.xp + xpGained);
  const newLevel = Math.floor(newXp / 100) + 1;

  // Determine rank based on level
  let newRank = 'Novice Judge';
  if (newLevel >= 50) newRank = 'Supreme Justice';
  else if (newLevel >= 40) newRank = 'Chief Justice';
  else if (newLevel >= 30) newRank = 'Senior Judge';
  else if (newLevel >= 20) newRank = 'Experienced Judge';
  else if (newLevel >= 10) newRank = 'Competent Judge';
  else if (newLevel >= 5) newRank = 'Junior Judge';

  const updatedStats: UserStats = {
    ...currentStats,
    totalJudgments: newTotalJudgments,
    correctJudgments: newCorrectJudgments,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    xp: newXp,
    level: newLevel,
    rank: newRank,
    updatedAt: Date.now(),
  };

  if (isDevelopmentMode) {
    // Development mode - save to localStorage
    localStorage.setItem(DEV_STATS_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  }

  try {
    const statsRef = doc(db, 'userStats', uid);
    await updateDoc(statsRef, {
      ...updatedStats,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update stats in Firestore:', error);
    
    // Fallback to localStorage if Firestore fails
    const fallbackKey = `user-stats-${uid}`;
    localStorage.setItem(fallbackKey, JSON.stringify(updatedStats));
  }

  return updatedStats;
};

export const saveJudgmentRecord = async (
  uid: string,
  postId: string,
  userVerdict: Verdict,
  redditVerdict: Verdict,
  isCorrect: boolean,
  xpGained: number
) => {
  if (isDevelopmentMode) {
    // Development mode - just log the judgment
    console.log('📝 Judgment recorded (dev mode):', {
      uid,
      postId,
      userVerdict: userVerdict.type,
      redditVerdict: redditVerdict.type,
      isCorrect,
      xpGained
    });
    return;
  }

  const judgmentRef = doc(db, 'judgments', `${uid}_${postId}_${Date.now()}`);
  
  await setDoc(judgmentRef, {
    uid,
    postId,
    userVerdict: userVerdict.type,
    redditVerdict: redditVerdict.type,
    isCorrect,
    xpGained,
    timestamp: serverTimestamp(),
  });
};
