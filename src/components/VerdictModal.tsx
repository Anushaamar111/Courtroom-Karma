import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ArrowRight, BarChart3 } from 'lucide-react';
import { VERDICTS } from '../data/constants';

interface VerdictModalProps {
  isOpen: boolean;
  onClose: () => void;
  userVerdict: 'YTA' | 'NTA' | 'ESH' | 'NAH';
  redditVerdict: 'YTA' | 'NTA' | 'ESH' | 'NAH';
  isCorrect: boolean;
  xpGained: number;
  onNextPost: () => void;
  onBackToHome?: () => void;
}

export default function VerdictModal({
  isOpen,
  onClose,
  userVerdict,
  redditVerdict,
  isCorrect,
  xpGained,
  onNextPost,
  onBackToHome
}: VerdictModalProps) {
  if (!isOpen) return null;

  const userVerdictData = VERDICTS[userVerdict];
  const redditVerdictData = VERDICTS[redditVerdict];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className={`p-6 text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
          <div className="flex items-center justify-center space-x-3">
            {isCorrect ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </h2>
              <p className="text-sm opacity-90">
                {isCorrect ? 'Great judgment!' : 'Better luck next time'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Your Verdict */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Your Verdict</h3>
                <span className="text-2xl font-bold text-blue-600">{userVerdict}</span>
              </div>
              <p className="text-sm text-gray-600">{userVerdictData.label}</p>
            </div>

            {/* Reddit's Verdict */}
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Reddit's Verdict</h3>
                <span className="text-2xl font-bold text-orange-600">{redditVerdict}</span>
              </div>
              <p className="text-sm text-gray-600">{redditVerdictData.label}</p>
            </div>

            {/* XP Gained/Lost */}
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className={`w-5 h-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '+' : '-'}{Math.abs(xpGained)} XP
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {/* Primary Actions Row */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
              >
                View Stats
              </button>
              <button
                onClick={onNextPost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Next Case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Back to Dashboard Button */}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}