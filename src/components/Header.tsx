import React from 'react';
import { Scale, Trophy, Target, User, LogOut, ArrowLeft } from 'lucide-react';
import { UserStats } from '../types';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  userStats: UserStats;
  onProfileClick: () => void;
  onBackToHome?: () => void;
}

export default function Header({ userStats, onProfileClick, onBackToHome }: HeaderProps) {
  const { user, signOut } = useAuth();
  const accuracy = userStats.totalJudgments > 0 
    ? Math.round((userStats.correctJudgments / userStats.totalJudgments) * 100)
    : 0;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-amber-500">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Home</span>
              </button>
            )}
            
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AITA Karma Courtroom</h1>
              <p className="text-sm text-gray-600">Judge • Earn XP • Climb Rankings</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* XP Display */}
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-gray-900">{userStats.xp} XP</span>
              </div>
              <p className="text-xs text-gray-500">{userStats.rank}</p>
            </div>

            {/* Accuracy */}
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-gray-900">{accuracy}%</span>
              </div>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>

            {/* Profile/User Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* User Avatar and Info */}
                  <button
                    onClick={onProfileClick}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                      <p className="text-xs text-gray-500">Level {userStats.level}</p>
                    </div>
                  </button>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}