import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Header from './components/Header';
import PostCard from './components/PostCard';
import VerdictModal from './components/VerdictModal';
import ProfileModal from './components/ProfileModal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useGameState } from './hooks/useGameState';
import { useAuth } from './hooks/useAuth';

type AppView = 'landing' | 'game' | 'login' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { gameState, makeJudgment, nextPost, isLoadingStats, isLoadingPosts } = useGameState();
  const { user, loading: authLoading } = useAuth();

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleStartGame = () => {
    setCurrentView('game');
  };

  const handleSwipe = (verdict: 'YTA' | 'NTA' | 'ESH' | 'NAH') => {
    makeJudgment(verdict);
  };

  const handleNextPost = () => {
    nextPost();
  };

  const handleProfileClick = () => {
    if (!user) {
      setCurrentView('login');
    } else {
      setShowProfileModal(true);
    }
  };

  const currentPost = gameState.posts[gameState.currentPostIndex];
  const xpGained = gameState.lastJudgment?.isCorrect ? 10 : -3;

  // If no posts are available, show error state
  if (!isLoadingPosts && gameState.posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Available</h2>
          <p className="text-gray-600 mb-4">
            We couldn't load any AITA posts from Reddit. This might be due to network issues or API limitations.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no current post available, show loading
  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your next case...</p>
        </div>
      </div>
    );
  }

  // Show loading screen while auth is loading or posts are loading
  if (authLoading || isLoadingStats || isLoadingPosts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoadingPosts ? 'Loading fresh AITA posts from Reddit...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return <Login onClose={handleBackToHome} />;
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        userStats={gameState.userStats}
        challenges={gameState.challenges}
        onBackToHome={handleBackToHome}
        onStartGame={handleStartGame}
      />
    );
  }

  if (currentView === 'landing') {
    return <Landing onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Header 
        userStats={gameState.userStats} 
        onProfileClick={handleProfileClick}
        onBackToHome={handleBackToHome}
      />
      
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Instructions */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Case #{gameState.currentPostIndex + 1}
            </h2>
            <p className="text-gray-600">
              Swipe left for YTA, right for NTA, or use the buttons below
            </p>
          </motion.div>

          {/* Post Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState.currentPostIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard
                post={currentPost}
                onSwipe={handleSwipe}
                disabled={gameState.showVerdict}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm text-gray-600">
                XP: {gameState.userStats.xp}
              </span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Streak: {gameState.userStats.currentStreak}
              </span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {Math.round((gameState.userStats.correctJudgments / Math.max(gameState.userStats.totalJudgments, 1)) * 100)}% Accuracy
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Verdict Modal */}
      <AnimatePresence>
        {gameState.showVerdict && gameState.lastJudgment && (
          <VerdictModal
            isOpen={gameState.showVerdict}
            onClose={() => setShowProfileModal(true)}
            userVerdict={gameState.lastJudgment.userVerdict.type}
            redditVerdict={gameState.lastJudgment.redditVerdict.type}
            isCorrect={gameState.lastJudgment.isCorrect}
            xpGained={xpGained}
            onNextPost={handleNextPost}
            onBackToHome={handleBackToDashboard}
          />
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            userStats={gameState.userStats}
            challenges={gameState.challenges}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;