import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isDevelopmentMode } from '../config/firebase';

interface LoginProps {
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose?.();
    } catch (error) {
      console.error('Login failed:', error);
      // You could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <motion.button
        onClick={onClose}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </motion.button>

      <motion.div
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white text-3xl">⚖️</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AITA Karma Courtroom
          </h1>
          {isDevelopmentMode && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-2">
              🚀 Development Mode
            </div>
          )}
          <p className="text-gray-600">
            {isDevelopmentMode 
              ? "Mock authentication enabled - no real login required!"
              : "Sign in to save your progress and compete with others!"
            }
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {isDevelopmentMode ? "Continue (Mock Login)" : "Continue with Google"}
                </span>
              </>
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isDevelopmentMode 
                ? "This is a demo version. Check FIREBASE_SETUP.md for real authentication."
                : "By signing in, you agree to our Terms of Service and Privacy Policy"
              }
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDevelopmentMode ? "Development Features" : "Why Sign In?"}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {isDevelopmentMode ? (
                <>
                  <li>• Mock authentication system</li>
                  <li>• Local progress storage</li>
                  <li>• No real Firebase needed</li>
                  <li>• Perfect for testing</li>
                </>
              ) : (
                <>
                  <li>• Save your progress and stats</li>
                  <li>• Compete on leaderboards</li>
                  <li>• Unlock achievements</li>
                  <li>• Track your judgment accuracy</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
