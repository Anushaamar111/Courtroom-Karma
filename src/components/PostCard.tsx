import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MessageCircle, Clock, User, ThumbsUp, ThumbsDown, Users, AlertTriangle } from 'lucide-react';
import { AITAPost } from '../types';
import { VERDICTS } from '../data/constants';
import Tooltip from './Tooltip';

interface PostCardProps {
  post: AITAPost;
  onSwipe: (verdict: 'YTA' | 'NTA' | 'ESH' | 'NAH') => void;
  disabled?: boolean;
}

export default function PostCard({ post, onSwipe, disabled = false }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        onSwipe('NTA'); // Swipe right = Not the Asshole
      } else {
        onSwipe('YTA'); // Swipe left = You're the Asshole
      }
    } else {
      x.set(0); // Reset position if not swiped far enough
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleButtonClick = (verdict: 'YTA' | 'NTA' | 'ESH' | 'NAH') => {
    if (!disabled) {
      onSwipe(verdict);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Swipe indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none z-10">
        <motion.div
          className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
          style={{ opacity: useTransform(x, [-200, -50, 0], [1, 0.8, 0]) }}
        >
          YTA
        </motion.div>
        <motion.div
          className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
          style={{ opacity: useTransform(x, [0, 50, 200], [0, 0.8, 1]) }}
        >
          NTA
        </motion.div>
      </div>

      <motion.div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ x, rotate, opacity }}
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Post Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">u/{post.author}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(post.created_utc)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.score}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            {post.title}
          </h2>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className={`text-gray-700 leading-relaxed ${!expanded ? 'line-clamp-6' : ''}`}>
            {post.content}
          </div>
          
          {post.content.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {expanded ? 'Show less' : 'Read more...'}
            </button>
          )}
        </div>

        {/* Post Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.num_comments} comments</span>
              </div>
              <a 
                href={`https://reddit.com${post.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View Original
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                🅡 Real Reddit Post
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Tooltip content={VERDICTS.YTA.label}>
              <button
                onClick={() => handleButtonClick('YTA')}
                disabled={disabled}
                className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">YTA</span>
              </button>
            </Tooltip>
            <Tooltip content={VERDICTS.ESH.label}>
              <button
                onClick={() => handleButtonClick('ESH')}
                disabled={disabled}
                className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">ESH</span>
              </button>
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Tooltip content={VERDICTS.NTA.label}>
              <button
                onClick={() => handleButtonClick('NTA')}
                disabled={disabled}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">NTA</span>
              </button>
            </Tooltip>
            <Tooltip content={VERDICTS.NAH.label}>
              <button
                onClick={() => handleButtonClick('NAH')}
                disabled={disabled}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">NAH</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </div>
  );
}