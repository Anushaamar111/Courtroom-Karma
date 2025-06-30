import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Award, TrendingUp, Calendar, User, ArrowLeft } from 'lucide-react';
import { UserStats, Challenge } from '../types';
import { JUDGE_RANKS } from '../data/constants';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  userStats: UserStats;
  challenges: Challenge[];
  onBackToHome: () => void;
  onStartGame: () => void;
  onShowLeaderboard: () => void;
}

export default function Dashboard({ userStats, challenges, onBackToHome, onStartGame, onShowLeaderboard }: DashboardProps) {
  const { user } = useAuth();
  const accuracy = userStats.totalJudgments > 0 
    ? Math.round((userStats.correctJudgments / userStats.totalJudgments) * 100)
    : 0;

  const currentRankIndex = JUDGE_RANKS.findIndex(rank => rank.rank === userStats.rank);
  const nextRank = JUDGE_RANKS[currentRankIndex + 1];
  const progressToNextRank = nextRank 
    ? Math.min(100, (userStats.xp / nextRank.xpRequired) * 100)
    : 100;

  const completedChallenges = challenges.filter(c => c.completed).length;

  // Icon mapping for challenges
  const getChallengeIcon = (challengeId: string) => {
    switch (challengeId) {
      case 'streak_3': return '🔥';
      case 'judge_10': return '⚖️';
      case 'perfect_accuracy': return '🎯';
      default: return '🏆';
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Judge Dashboard</h1>
                <p className="text-sm text-gray-600">Your AITA Courtroom Progress</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onShowLeaderboard}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
              
              <button
                onClick={onStartGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Judging
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-6">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-4 border-amber-500"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-amber-500">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.displayName || 'Guest Judge'}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {userStats.rank}
                </span>
                <span className="text-gray-600">Level {userStats.level}</span>
                <span className="text-gray-600">{userStats.xp} XP</span>
              </div>
              
              {/* Progress to Next Rank */}
              {nextRank && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to {nextRank.rank}</span>
                    <span>{Math.round(progressToNextRank)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressToNextRank}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Judgments */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.totalJudgments}</h3>
                <p className="text-sm text-gray-600">Total Cases</p>
              </div>
            </div>
          </motion.div>

          {/* Accuracy */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{accuracy}%</h3>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
            </div>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</h3>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
            </div>
          </motion.div>

          {/* Best Streak */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.bestStreak}</h3>
                <p className="text-sm text-gray-600">Best Streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Challenges Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Daily Challenges</h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {completedChallenges}/{challenges.length} Completed
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                className={`p-4 rounded-xl border-2 ${
                  challenge.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getChallengeIcon(challenge.id)}</span>
                  <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {challenge.completed && (
                  <div className="mt-2 flex items-center space-x-1 text-green-600">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">+{challenge.reward} XP</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Judge Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-green-600">{userStats.correctJudgments}</h4>
              <p className="text-sm text-gray-600">Correct Verdicts</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-red-600">
                {userStats.totalJudgments - userStats.correctJudgments}
              </h4>
              <p className="text-sm text-gray-600">Incorrect Verdicts</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-amber-600">{userStats.xp}</h4>
              <p className="text-sm text-gray-600">Total XP Earned</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-purple-600">{userStats.level}</h4>
              <p className="text-sm text-gray-600">Judge Level</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
