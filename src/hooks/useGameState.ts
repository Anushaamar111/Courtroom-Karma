import { useState, useEffect } from 'react';
import { GameState, UserStats } from '../types';
import { DAILY_CHALLENGES, JUDGE_RANKS } from '../data/constants';
import { useAuth } from './useAuth';
import { getUserStats, updateUserStats, saveJudgmentRecord } from '../services/userStatsService';
import { fetchRedditAITAPosts, determineRedditVerdict } from '../services/redditService';

const STORAGE_KEY = 'aita-game-state';

const createInitialUserStats = (uid: string = 'guest'): UserStats => ({
  uid,
  totalJudgments: 0,
  correctJudgments: 0,
  currentStreak: 0,
  bestStreak: 0,
  xp: 0,
  level: 0,
  rank: JUDGE_RANKS[0].rank,
  updatedAt: Date.now(),
});

const createInitialGameState = (userStats: UserStats): GameState => ({
  currentPostIndex: 0,
  posts: [], // Will be populated with Reddit posts
  userStats,
  challenges: DAILY_CHALLENGES,
  showVerdict: false
});

export function useGameState() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(createInitialUserStats())
  );
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Load Reddit posts on component mount
  useEffect(() => {
    const loadRedditPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const posts = await fetchRedditAITAPosts(50); // Fetch 50 posts for variety
        setGameState(prev => ({
          ...prev,
          posts
        }));
        console.log(`📋 Loaded ${posts.length} Reddit AITA posts`);
      } catch (error) {
        console.error('Failed to load Reddit posts:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadRedditPosts();
  }, []);

  // Load user stats when user logs in or changes
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingStats(true);
      getUserStats(user.uid)
        .then(stats => {
          setGameState(prev => ({
            ...prev,
            userStats: stats
          }));
        })
        .catch(error => {
          console.error('Failed to load user stats:', error);
        })
        .finally(() => {
          setIsLoadingStats(false);
        });
    } else {
      // Guest user - load from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          const guestStats = createInitialUserStats('guest');
          setGameState(prev => ({
            ...prev,
            userStats: parsedState.userStats || guestStats,
            challenges: parsedState.challenges || DAILY_CHALLENGES
          }));
        } catch (error) {
          console.error('Failed to load game state:', error);
        }
      }
    }
  }, [user]);

  // Save game state to localStorage for guest users
  useEffect(() => {
    if (!user?.uid) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userStats: gameState.userStats,
        challenges: gameState.challenges
      }));
    }
  }, [gameState.userStats, gameState.challenges, user]);

  const makeJudgment = async (userVerdictType: 'YTA' | 'NTA' | 'ESH' | 'NAH') => {
    const currentPost = gameState.posts[gameState.currentPostIndex];
    if (!currentPost) {
      console.error('No current post available');
      return;
    }
    
    const redditVerdictType = determineRedditVerdict(currentPost);
    const isCorrect = userVerdictType === redditVerdictType;
    const xpGained = isCorrect ? 10 : -3;

    const userVerdict = { type: userVerdictType, label: '', description: '' };
    const redditVerdict = { type: redditVerdictType, label: '', description: '' };

    if (user?.uid) {
      // Authenticated user - save to Firebase
      try {
        const updatedStats = await updateUserStats(user.uid, isCorrect, xpGained);
        await saveJudgmentRecord(
          user.uid,
          currentPost.id,
          userVerdict,
          redditVerdict,
          isCorrect,
          xpGained
        );

        setGameState(prev => ({
          ...prev,
          userStats: updatedStats,
          showVerdict: true,
          lastJudgment: {
            userVerdict,
            redditVerdict,
            isCorrect
          }
        }));
      } catch (error) {
        console.error('Failed to save judgment:', error);
        // Fall back to local state update
        updateLocalStats();
      }
    } else {
      // Guest user - update local state
      updateLocalStats();
    }

    function updateLocalStats() {
      setGameState(prev => {
        const newStats = { ...prev.userStats };
        newStats.totalJudgments++;
        
        if (isCorrect) {
          newStats.correctJudgments++;
          newStats.currentStreak++;
          newStats.xp += 10;
          if (newStats.currentStreak > newStats.bestStreak) {
            newStats.bestStreak = newStats.currentStreak;
          }
        } else {
          newStats.currentStreak = 0;
          newStats.xp = Math.max(0, newStats.xp - 3);
        }

        // Update level and rank
        const newLevel = JUDGE_RANKS.findIndex(rank => newStats.xp < rank.xpRequired) - 1;
        newStats.level = Math.max(0, newLevel === -1 ? JUDGE_RANKS.length - 1 : newLevel);
        newStats.rank = JUDGE_RANKS[newStats.level].rank;
        newStats.updatedAt = Date.now();

        // Update challenges
        const updatedChallenges = prev.challenges.map(challenge => {
          if (challenge.completed) return challenge;

          let newProgress = challenge.progress;
          
          switch (challenge.id) {
            case 'streak_3':
              newProgress = newStats.currentStreak;
              break;
            case 'judge_10':
              newProgress = newStats.totalJudgments;
              break;
            case 'perfect_accuracy':
              if (isCorrect && newStats.correctJudgments === newStats.totalJudgments) {
                newProgress = newStats.totalJudgments;
              } else if (!isCorrect) {
                newProgress = 0;
              }
              break;
          }

          const completed = newProgress >= challenge.target;
          if (completed && !challenge.completed) {
            newStats.xp += challenge.reward;
          }

          return { ...challenge, progress: newProgress, completed };
        });

        return {
          ...prev,
          userStats: newStats,
          challenges: updatedChallenges,
          showVerdict: true,
          lastJudgment: {
            userVerdict,
            redditVerdict,
            isCorrect
          }
        };
      });
    }
  };

  const nextPost = () => {
    setGameState(prev => ({
      ...prev,
      currentPostIndex: (prev.currentPostIndex + 1) % prev.posts.length,
      showVerdict: false,
      lastJudgment: undefined
    }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    const initialStats = createInitialUserStats(user?.uid || 'guest');
    setGameState(createInitialGameState(initialStats));
  };

  return {
    gameState,
    makeJudgment,
    nextPost,
    resetGame,
    isLoadingStats,
    isLoadingPosts
  };
}