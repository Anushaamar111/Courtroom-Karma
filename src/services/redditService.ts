import { AITAPost } from '../types';

// Reddit API response interfaces
interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  link_flair_text?: string;
  upvote_ratio: number;
  subreddit: string;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

// Cache for storing fetched posts
let cachedPosts: AITAPost[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback posts in case Reddit API fails
const fallbackPosts: AITAPost[] = [
  {
    id: "fallback_1",
    title: "AITA for using Reddit data instead of mock data?",
    content: "I wanted to make my AITA game more realistic by using actual Reddit posts instead of made-up scenarios. The developer implemented a Reddit API service to fetch real posts from r/AmItheAsshole. Now users can judge real situations that happened to real people. Some might say this is more authentic, others might prefer the curated mock data. AITA for wanting real data?",
    author: "RedditAPIFan",
    score: 9999,
    num_comments: 500,
    created_utc: Date.now() - 3600000,
    permalink: "/r/AmItheAsshole/comments/fallback1/",
    url: "https://reddit.com/r/AmItheAsshole/comments/fallback1/"
  }
];

/**
 * Fetches AITA posts from Reddit's JSON API
 */
export async function fetchRedditAITAPosts(limit: number = 25): Promise<AITAPost[]> {
  // Check cache first
  if (cachedPosts.length > 0 && Date.now() - lastFetchTime < CACHE_DURATION) {
    console.log('📱 Using cached Reddit posts');
    return cachedPosts.slice(0, limit);
  }

  try {
    console.log('🔍 Fetching fresh AITA posts from Reddit...');
    
    // Fetch from Reddit's JSON API
    const response = await fetch(
      `https://www.reddit.com/r/AmItheAsshole/hot.json?limit=${limit * 2}`, // Fetch more to filter
      {
        headers: {
          'User-Agent': 'AITA-Karma-Courtroom/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data: RedditResponse = await response.json();
    
    // Filter and transform posts
    const posts: AITAPost[] = data.data.children
      .map(child => child.data)
      .filter(post => {
        // Filter for actual AITA posts with content
        return post.selftext && 
               post.selftext.length > 100 && 
               post.title.toLowerCase().includes('aita') &&
               !post.title.toLowerCase().includes('[removed]') &&
               !post.title.toLowerCase().includes('[deleted]');
      })
      .slice(0, limit)
      .map((post): AITAPost => ({
        id: post.id,
        title: post.title,
        content: post.selftext,
        author: post.author,
        score: post.score,
        num_comments: post.num_comments,
        created_utc: post.created_utc * 1000, // Convert to milliseconds
        permalink: post.permalink,
        url: post.url
      }));

    if (posts.length === 0) {
      console.warn('⚠️ No valid AITA posts found, using fallback');
      return fallbackPosts;
    }

    // Update cache
    cachedPosts = posts;
    lastFetchTime = Date.now();
    
    console.log(`✅ Successfully fetched ${posts.length} AITA posts from Reddit`);
    return posts;

  } catch (error) {
    console.error('❌ Failed to fetch Reddit posts:', error);
    
    // Return cached posts if available, otherwise fallback
    if (cachedPosts.length > 0) {
      console.log('📱 Using cached posts due to API error');
      return cachedPosts;
    }
    
    console.log('🔄 Using fallback posts due to API error');
    return fallbackPosts;
  }
}

/**
 * Determines the community verdict based on Reddit data
 * This is a simplified version - in reality, we'd need to analyze comments
 */
export function determineRedditVerdict(post: AITAPost): 'YTA' | 'NTA' | 'ESH' | 'NAH' {
  // For now, we'll use a simple heuristic based on score and title
  // In a real implementation, you'd analyze the top comments for verdict keywords
  
  const title = post.title.toLowerCase();
  const score = post.score;
  
  // Simple heuristics (this is not perfect but gives variety)
  if (score < 0) return 'YTA';
  if (title.includes('not invite') || title.includes('refuse') || title.includes('kick out')) {
    return score > 1000 ? 'NTA' : 'YTA';
  }
  if (title.includes('everyone') || title.includes('both')) return 'ESH';
  if (title.includes('accident') || title.includes('mistake')) return 'NAH';
  
  // Default based on score
  return score > 500 ? 'NTA' : 'YTA';
}

/**
 * Refreshes the Reddit posts cache
 */
export function refreshRedditCache(): void {
  cachedPosts = [];
  lastFetchTime = 0;
  console.log('🔄 Reddit cache cleared');
}
