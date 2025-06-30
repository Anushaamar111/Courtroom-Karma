import { collection, query, orderBy, limit, getDocs, where, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db, isDevelopmentMode } from '../config/firebase';
import { UserStats } from '../types';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  rank: string;
  totalJudgments: number;
  correctJudgments: number;
  accuracy: number;
  bestStreak: number;
  position: number;
}

// Mock leaderboard data for development mode
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    uid: 'mock-1',
    displayName: 'Supreme Judge Alex',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    xp: 2150,
    level: 5,
    rank: '👑 Supreme Karma Judge',
    totalJudgments: 215,
    correctJudgments: 172,
    accuracy: 80,
    bestStreak: 15,
    position: 1
  },
  {
    uid: 'mock-2',
    displayName: 'Justice Master Sarah',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    xp: 1890,
    level: 4,
    rank: '🧙 Reddit Justice Wizard',
    totalJudgments: 189,
    correctJudgments: 158,
    accuracy: 84,
    bestStreak: 12,
    position: 2
  },
  {
    uid: 'mock-3',
    displayName: 'Arbitrator Mike',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    xp: 1650,
    level: 4,
    rank: '🧙 Reddit Justice Wizard',
    totalJudgments: 165,
    correctJudgments: 132,
    accuracy: 80,
    bestStreak: 10,
    position: 3
  },
  {
    uid: 'mock-4',
    displayName: 'Judge Emma',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    xp: 1420,
    level: 3,
    rank: '🎓 Senior Arbitrator',
    totalJudgments: 142,
    correctJudgments: 119,
    accuracy: 84,
    bestStreak: 8,
    position: 4
  },
  {
    uid: 'mock-5',
    displayName: 'Courtroom Chris',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    xp: 1200,
    level: 3,
    rank: '🎓 Senior Arbitrator',
    totalJudgments: 120,
    correctJudgments: 96,
    accuracy: 80,
    bestStreak: 7,
    position: 5
  },
  {
    uid: 'mock-6',
    displayName: 'Justice Jessica',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    xp: 980,
    level: 2,
    rank: '⚖️ Junior Justice',
    totalJudgments: 98,
    correctJudgments: 81,
    accuracy: 83,
    bestStreak: 6,
    position: 6
  },
  {
    uid: 'mock-7',
    displayName: 'Rookie Ryan',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    xp: 750,
    level: 2,
    rank: '⚖️ Junior Justice',
    totalJudgments: 75,
    correctJudgments: 57,
    accuracy: 76,
    bestStreak: 5,
    position: 7
  },
  {
    uid: 'mock-8',
    displayName: 'Intern Isabella',
    photoURL: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    xp: 520,
    level: 1,
    rank: '👨‍⚖️ Courtroom Intern',
    totalJudgments: 52,
    correctJudgments: 41,
    accuracy: 79,
    bestStreak: 4,
    position: 8
  }
];

/**
 * Fetches the global leaderboard of top players
 */
export async function fetchLeaderboard(limitCount: number = 50): Promise<LeaderboardEntry[]> {
  if (isDevelopmentMode) {
    console.log('📊 Using mock leaderboard data (development mode)');
    return mockLeaderboardData.slice(0, limitCount);
  }

  try {
    // Query users ordered by XP (descending)
    const usersRef = collection(db, 'userStats');
    const leaderboardQuery = query(
      usersRef,
      where('totalJudgments', '>', 0), // Only include users who have made judgments
      orderBy('xp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(leaderboardQuery);
    const leaderboardData: LeaderboardEntry[] = [];

    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data() as UserStats;
      const accuracy = data.totalJudgments > 0 
        ? Math.round((data.correctJudgments / data.totalJudgments) * 100) 
        : 0;

      leaderboardData.push({
        uid: data.uid,
        displayName: doc.data().displayName || 'Anonymous Judge',
        photoURL: doc.data().photoURL,
        xp: data.xp,
        level: data.level,
        rank: data.rank,
        totalJudgments: data.totalJudgments,
        correctJudgments: data.correctJudgments,
        accuracy,
        bestStreak: data.bestStreak,
        position: index + 1
      });
    });

    console.log(`📊 Fetched ${leaderboardData.length} leaderboard entries`);
    return leaderboardData;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    
    // Return mock data as fallback
    console.log('📊 Using mock leaderboard data (fallback)');
    return mockLeaderboardData.slice(0, limitCount);
  }
}

/**
 * Gets the user's position in the global leaderboard
 */
export async function getUserLeaderboardPosition(userXP: number): Promise<number> {
  if (isDevelopmentMode) {
    // Mock position based on XP
    const betterPlayers = mockLeaderboardData.filter(player => player.xp > userXP);
    return betterPlayers.length + 1;
  }

  try {
    const usersRef = collection(db, 'userStats');
    const higherXPQuery = query(
      usersRef,
      where('xp', '>', userXP),
      where('totalJudgments', '>', 0)
    );

    const querySnapshot = await getDocs(higherXPQuery);
    return querySnapshot.size + 1; // +1 because this user's position is count + 1
  } catch (error) {
    console.error('Failed to get user leaderboard position:', error);
    return 0;
  }
}

/**
 * Gets leaderboard statistics
 */
export async function getLeaderboardStats(): Promise<{
  totalPlayers: number;
  topXP: number;
  averageAccuracy: number;
}> {
  if (isDevelopmentMode) {
    return {
      totalPlayers: mockLeaderboardData.length,
      topXP: Math.max(...mockLeaderboardData.map(p => p.xp)),
      averageAccuracy: Math.round(
        mockLeaderboardData.reduce((sum, p) => sum + p.accuracy, 0) / mockLeaderboardData.length
      )
    };
  }

  try {
    const leaderboard = await fetchLeaderboard(100);
    return {
      totalPlayers: leaderboard.length,
      topXP: leaderboard[0]?.xp || 0,
      averageAccuracy: leaderboard.length > 0 
        ? Math.round(leaderboard.reduce((sum, p) => sum + p.accuracy, 0) / leaderboard.length)
        : 0
    };
  } catch (error) {
    console.error('Failed to get leaderboard stats:', error);
    return { totalPlayers: 0, topXP: 0, averageAccuracy: 0 };
  }
}

/**
 * Creates a real-time listener for the leaderboard
 * Returns an unsubscribe function to clean up the listener
 */
export function subscribeToLeaderboard(
  callback: (leaderboard: LeaderboardEntry[]) => void,
  limitCount: number = 50
): () => void {
  if (isDevelopmentMode) {
    // For development, simulate real-time updates with mock data
    callback(mockLeaderboardData.slice(0, limitCount));
    
    // Simulate updates every 10 seconds with slight variations
    const interval = setInterval(() => {
      const updatedMockData = mockLeaderboardData.map(entry => ({
        ...entry,
        xp: entry.xp + Math.floor(Math.random() * 10) - 5, // Random +/- 5 XP
      })).sort((a, b) => b.xp - a.xp).map((entry, index) => ({
        ...entry,
        position: index + 1
      }));
      
      callback(updatedMockData.slice(0, limitCount));
    }, 10000);

    return () => clearInterval(interval);
  }

  try {
    const usersRef = collection(db, 'userStats');
    const leaderboardQuery = query(
      usersRef,
      where('totalJudgments', '>', 0), // Only include users who have made judgments
      orderBy('xp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(leaderboardQuery, (querySnapshot) => {
      try {
        const leaderboardData: LeaderboardEntry[] = [];
        
        querySnapshot.docs.forEach((doc, index) => {
          const data = doc.data() as UserStats;
          const accuracy = data.totalJudgments > 0 
            ? Math.round((data.correctJudgments / data.totalJudgments) * 100) 
            : 0;

          leaderboardData.push({
            uid: data.uid,
            displayName: doc.data().displayName || 'Anonymous Judge',
            photoURL: doc.data().photoURL,
            xp: data.xp,
            level: data.level,
            rank: data.rank,
            totalJudgments: data.totalJudgments,
            correctJudgments: data.correctJudgments,
            accuracy,
            bestStreak: data.bestStreak,
            position: index + 1
          });
        });

        console.log(`🔄 Real-time leaderboard update: ${leaderboardData.length} entries`);
        callback(leaderboardData);
      } catch (error) {
        console.error('Error processing leaderboard snapshot:', error);
      }
    }, (error) => {
      console.error('Leaderboard listener error:', error);
      // Fallback to mock data on error
      callback(mockLeaderboardData.slice(0, limitCount));
    });

    return unsubscribe;
  } catch (error) {
    console.error('Failed to set up leaderboard listener:', error);
    // Fallback to mock data
    callback(mockLeaderboardData.slice(0, limitCount));
    return () => {}; // Return empty cleanup function
  }
}

/**
 * Creates a real-time listener for leaderboard stats
 */
export function subscribeToLeaderboardStats(
  callback: (stats: { totalPlayers: number; topXP: number; averageAccuracy: number }) => void
): () => void {
  if (isDevelopmentMode) {
    const mockStats = {
      totalPlayers: mockLeaderboardData.length,
      topXP: Math.max(...mockLeaderboardData.map(p => p.xp)),
      averageAccuracy: Math.round(
        mockLeaderboardData.reduce((sum, p) => sum + p.accuracy, 0) / mockLeaderboardData.length
      )
    };
    callback(mockStats);
    
    // Simulate stats updates
    const interval = setInterval(() => {
      callback({
        ...mockStats,
        totalPlayers: mockStats.totalPlayers + Math.floor(Math.random() * 3) - 1 // +/- 1 player
      });
    }, 15000);

    return () => clearInterval(interval);
  }

  try {
    const usersRef = collection(db, 'userStats');
    const statsQuery = query(
      usersRef,
      where('totalJudgments', '>', 0),
      orderBy('xp', 'desc'),
      limit(100) // Get top 100 for stats calculation
    );

    const unsubscribe = onSnapshot(statsQuery, (querySnapshot) => {
      try {
        const players: LeaderboardEntry[] = [];
        
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data() as UserStats;
          const accuracy = data.totalJudgments > 0 
            ? Math.round((data.correctJudgments / data.totalJudgments) * 100) 
            : 0;

          players.push({
            uid: data.uid,
            displayName: doc.data().displayName || 'Anonymous Judge',
            photoURL: doc.data().photoURL,
            xp: data.xp,
            level: data.level,
            rank: data.rank,
            totalJudgments: data.totalJudgments,
            correctJudgments: data.correctJudgments,
            accuracy,
            bestStreak: data.bestStreak,
            position: 0 // Not needed for stats
          });
        });

        const stats = {
          totalPlayers: players.length,
          topXP: players[0]?.xp || 0,
          averageAccuracy: players.length > 0 
            ? Math.round(players.reduce((sum, p) => sum + p.accuracy, 0) / players.length)
            : 0
        };

        console.log(`📊 Real-time stats update: ${stats.totalPlayers} players`);
        callback(stats);
      } catch (error) {
        console.error('Error processing stats snapshot:', error);
      }
    }, (error) => {
      console.error('Stats listener error:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Failed to set up stats listener:', error);
    return () => {};
  }
}
