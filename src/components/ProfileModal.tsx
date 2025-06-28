import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Target, Zap, Award, TrendingUp, Calendar, User, LogIn, BarChart3 } from 'lucide-react';
import { UserStats, Challenge } from '../types';
import { useAuth } from '../hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  challenges: Challenge[];
  onViewDashboard?: () => void;
}

export default function ProfileModal({ isOpen, onClose, userStats, challenges, onViewDashboard }: ProfileModalProps) {
  const { user, signInWithGoogle } = useAuth();
  
  if (!isOpen) return null;

  const accuracy = userStats.totalJudgments > 0 
    ? Math.round((userStats.correctJudgments / userStats.totalJudgments) * 100)
    : 0;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-16 h-16 rounded-full border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{user.displayName}</h2>
                    <p className="text-blue-100">{userStats.rank}</p>
                    <p className="text-blue-200 text-sm">Level {userStats.level}</p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold">Guest Judge</h2>
                  <p className="text-blue-100">{userStats.rank}</p>
                  <p className="text-blue-200 text-sm">Sign in to save your progress</p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Sign In Button for Guests */}
          {!user && (
            <div className="mt-4">
              <button
                onClick={handleSignIn}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl text-center">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.xp}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.bestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Progress Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Judgments</span>
                  <span className="font-semibold">{userStats.totalJudgments}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Correct Judgments</span>
                  <span className="font-semibold text-green-600">{userStats.correctJudgments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Incorrect Judgments</span>
                  <span className="font-semibold text-red-600">
                    {userStats.totalJudgments - userStats.correctJudgments}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Level</span>
                  <span className="font-semibold">{userStats.level + 1}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Judge Rank</span>
                  <span className="font-semibold">{userStats.rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Challenges */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Daily Challenges
            </h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-4 rounded-xl border-2 ${
                    challenge.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-amber-600 font-medium">
                        +{challenge.reward} XP
                      </span>
                      {challenge.completed && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {challenge.progress}/{challenge.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}