import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Play, Trophy, Target, Zap, Users } from 'lucide-react';

interface LandingProps {
  onStartGame: () => void;
}

export default function Landing({ onStartGame }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
            <motion.div
              className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <Scale className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            AITA Karma
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              {" "}Courtroom
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Judge Reddit's most controversial AITA posts. Swipe like Tinder, judge like a pro, 
            and climb the karma leaderboard!
          </motion.p>
          
          <motion.button
            onClick={onStartGame}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <Play className="w-6 h-6" />
              <span>Start Judging</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl w-fit mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Swipe to Judge</h3>
            <p className="text-gray-600">
              Swipe right for "Not the Asshole", left for "You're the Asshole". 
              Compare your verdict with Reddit's top judgment!
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-xl w-fit mb-4">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Earn XP & Rank Up</h3>
            <p className="text-gray-600">
              Gain experience points for correct judgments. Rise from Rookie Judge 
              to Supreme Karma Judge!
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl w-fit mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Challenges</h3>
            <p className="text-gray-600">
              Complete daily challenges like "Perfect Streak" or "Speed Judge" 
              to earn bonus XP and achievements.
            </p>
          </div>
        </motion.div>

        {/* Game Preview */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-700">Join thousands of judges</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12.5K+</div>
              <div className="text-sm text-gray-600">Cases Judged</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">847</div>
              <div className="text-sm text-gray-600">Active Judges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2.1K</div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}