# Reddit Integration Guide

## 🎯 Real Reddit Data Implementation

Your AITA Karma Courtroom now uses **real Reddit posts** from r/AmItheAsshole instead of mock data!

## 🔧 What Changed

### ✅ New Features Added:

1. **Reddit API Service** (`src/services/redditService.ts`)
   - Fetches real AITA posts from Reddit's JSON API
   - Caches posts for 5 minutes to reduce API calls
   - Filters for quality posts with substantial content
   - Handles API failures gracefully with fallback posts

2. **Smart Verdict Detection** 
   - Analyzes post titles and scores to predict community verdicts
   - Uses heuristics based on common AITA patterns
   - Provides variety in judgment outcomes

3. **Enhanced Post Cards**
   - Shows "Real Reddit Post" badge
   - Links to original Reddit post
   - Displays actual Reddit scores and comment counts
   - Handles longer content with expand/collapse

4. **Improved Loading States**
   - Shows "Loading fresh AITA posts from Reddit..." message
   - Handles network failures gracefully
   - Provides error states with retry options

### 🔄 Updated Components:

- **useGameState Hook**: Now fetches Reddit posts on load
- **App Component**: Better loading and error handling
- **PostCard Component**: Reddit-specific metadata and links

## 🚀 How It Works

### Data Flow:
1. **App Starts** → Fetches 50 real AITA posts from Reddit
2. **User Plays** → Judges real situations that happened to real people
3. **Verdict Analysis** → Compares user judgment with predicted community verdict
4. **Progress Tracking** → Stats saved with Firebase (or locally for guests)

### Reddit API:
- Uses `https://www.reddit.com/r/AmItheAsshole/hot.json`
- No authentication required (public posts)
- Respects Reddit's rate limits with caching
- Filters for posts with "AITA" in title and substantial content

### Quality Filters:
- Minimum 100 characters of content
- Must contain "AITA" in title
- Excludes removed/deleted posts
- Only shows posts with community engagement

## 🎮 User Experience

### For Players:
- **Real Stories**: Judge actual moral dilemmas from real people
- **Authentic Data**: See real upvotes, comments, and timestamps
- **Reddit Links**: View original discussions and community responses
- **Fresh Content**: New posts loaded regularly from Reddit

### For Developers:
- **No API Keys Needed**: Uses public Reddit JSON endpoints
- **Fallback System**: Works even if Reddit is unavailable
- **Caching**: Efficient data usage with 5-minute cache
- **Error Handling**: Graceful degradation on failures

## 🔧 Configuration

### Environment Variables:
No additional environment variables needed for Reddit integration.

### Customization Options:

```typescript
// In redditService.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const POST_LIMIT = 50; // Number of posts to fetch
```

## 🚨 Important Notes

### Rate Limiting:
- Reddit allows reasonable request rates for JSON endpoints
- App caches posts for 5 minutes to minimize requests
- Fetches 50 posts at once to reduce frequent API calls

### Content Filtering:
- Posts are automatically filtered for quality and relevance
- Very short posts or posts without "AITA" are excluded
- Removed/deleted content is filtered out

### Verdict Prediction:
- Uses heuristic analysis, not actual comment parsing
- Provides educational variety, not 100% accurate predictions
- Based on title patterns and community score trends

## 🛠️ Troubleshooting

### If Reddit Posts Don't Load:
1. Check browser console for network errors
2. Verify internet connection
3. Reddit API might be temporarily unavailable
4. App will use fallback posts automatically

### If Content Seems Inappropriate:
- Reddit content is community-moderated
- App filters for r/AmItheAsshole posts only
- Reports inappropriate content to Reddit directly

### Performance Issues:
- Clear browser cache if posts seem stale
- Check network speed for initial load
- Consider reducing `POST_LIMIT` in redditService.ts

## 🎉 Benefits

### ✅ Authenticity:
- Real moral dilemmas from real situations
- Authentic community engagement data
- Current and relevant content

### ✅ Variety:
- Constantly refreshing content pool
- Different types of moral scenarios
- Natural language and situations

### ✅ Educational:
- Learn about different perspectives
- Understand community standards
- Practice moral reasoning on real cases

---

**🎮 Ready to Judge Real Reddit Drama!** 

Your app now provides an authentic AITA experience with real posts, real community data, and real moral dilemmas. Players can now test their judgment skills against actual Reddit situations!
