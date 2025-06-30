import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Target, Zap, User, ArrowLeft, Crown, RefreshCw } from 'lucide-react';
import { subscribeToLeaderboard, subscribeToLeaderboardStats, getUserLeaderboardPosition, LeaderboardEntry } from '../services/leaderboardService';
import { useAuth } from '../hooks/useAuth';

interface LeaderboardProps {
  onBackToHome: () => void;
  userStats?: {
    xp: number;
    totalJudgments: number;
    correctJudgments: number;
    bestStreak: number;
  };
}

export default function Leaderboard({ onBackToHome, userStats }: LeaderboardProps) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number>(0);
  const [stats, setStats] = useState({ totalPlayers: 0, topXP: 0, averageAccuracy: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Set up real-time leaderboard listener
    const unsubscribeLeaderboard = subscribeToLeaderboard((leaderboardData) => {
      setLeaderboard(leaderboardData);
      setLoading(false);
    }, 50);

    // Set up real-time stats listener
    const unsubscribeStats = subscribeToLeaderboardStats((statsData) => {
      setStats(statsData);
    });

    // Get user position if they have stats
    if (userStats?.xp) {
      getUserLeaderboardPosition(userStats.xp).then(setUserPosition);
    }

    // Cleanup listeners on unmount
    return () => {
      unsubscribeLeaderboard();
      unsubscribeStats();
    };
  }, [userStats?.xp]);

  // Update user position when leaderboard or user stats change
  useEffect(() => {
    if (userStats?.xp && leaderboard.length > 0) {
      getUserLeaderboardPosition(userStats.xp).then(setUserPosition);
    }
  }, [leaderboard, userStats?.xp]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // For real-time data, we don't need to manually refresh
    // The listeners will automatically update the data
    // Just simulate a refresh for UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{position}</span>;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Home</span>
              </button>
              
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Global Leaderboard</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Top AITA Judges Worldwide</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
              title="Force refresh position (data updates automatically)"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Update Position</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</h3>
            <p className="text-sm text-gray-600">Total Players</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.topXP.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Highest XP</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.averageAccuracy}%</h3>
            <p className="text-sm text-gray-600">Avg Accuracy</p>
          </motion.div>
        </div>

        {/* User's Position (if logged in and has stats) */}
        {user && userStats && userPosition > 0 && (
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl p-6 mb-8 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">Your Ranking</h3>
                  <p className="text-blue-100">#{userPosition} out of {stats.totalPlayers} players</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userStats.xp.toLocaleString()} XP</div>
                <div className="text-blue-100 text-sm">
                  {Math.round((userStats.correctJudgments / userStats.totalJudgments) * 100)}% accuracy
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Trophy className="w-6 h-6 text-amber-500 mr-2" />
              Top Players
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level & Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Streak</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.uid}
                    className={`hover:bg-gray-50 transition-colors ${
                      user?.uid === entry.uid ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankBadgeColor(entry.position)}`}>
                        {getRankIcon(entry.position)}
                        <span className="ml-2">#{entry.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {entry.photoURL ? (
                          <img 
                            src={entry.photoURL} 
                            alt={entry.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.displayName}
                            {user?.uid === entry.uid && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Level {entry.level}</div>
                      <div className="text-xs text-gray-500">{entry.rank}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.xp.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.totalJudgments}</div>
                      <div className="text-xs text-green-600">{entry.correctJudgments} correct</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        entry.accuracy >= 80 ? 'text-green-600' : 
                        entry.accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {entry.accuracy}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-900">{entry.bestStreak}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No players yet</h3>
              <p className="text-gray-600">Be the first to make some judgments and claim the top spot!</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
