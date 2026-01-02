# Database Migration Guide - From localStorage to Supabase

This guide explains the complete migration from localStorage-based storage to Supabase database for user progress tracking.

## Setup Instructions

### 1. Run the SQL Schema

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the entire contents of `backend/EquathoraBackend/database_schema.sql`
3. Paste and execute in the SQL Editor
4. Verify all tables are created successfully

### 2. Verify Tables Created

The following tables should now exist:
- `user_progress` - Main progress tracking
- `user_topic_frequency` - Topic statistics
- `user_weekly_progress` - Weekly activity
- `user_difficulty_breakdown` - Easy/Medium/Hard stats
- `user_completed_problems` - Completed problems list
- `user_favorites` - Favorited problems
- `user_streak_data` - Streak tracking
- `user_submissions` - All submission history

### 3. Using the Database Service

The new `databaseService.js` replaces the old localStorage-based `progressStorage.js`.

#### Import the service:
```javascript
import {
    getUserProgress,
    saveUserProgress,
    getCompletedProblems,
    markProblemComplete,
    getFavorites,
    toggleFavorite,
    getStreakData,
    updateStreakData,
    saveSubmission,
    getAchievementProgress
} from '../lib/databaseService';
```

#### Example usage:

**Get user progress:**
```javascript
const progress = await getUserProgress();
console.log(progress.correct_answers, progress.reputation);
```

**Mark problem as complete:**
```javascript
await markProblemComplete('algebra-1', 120, 'medium', 'Algebra');
```

**Toggle favorite:**
```javascript
const isFavorited = await toggleFavorite('geometry-5');
```

**Save submission:**
```javascript
await saveSubmission('trig-3', '42', true, 90);
```

**Get full achievement snapshot:**
```javascript
const achievements = await getAchievementProgress();
// Returns all progress, topics, weekly data, difficulty breakdown
```

### 4. Migration Strategy

**Option A: Clean Start (Recommended for Beta)**
- Simply start using the new database service
- Old localStorage data remains but isn't used
- Users start fresh with the new system

**Option B: Migrate Existing Data**
If you want to preserve existing localStorage data:

1. Create a migration utility:
```javascript
// src/lib/migrateLocalStorageToDatabase.js
import { saveUserProgress, markProblemComplete } from './databaseService';
import { getAchievementProgress as getLocalProgress } from './progressStorage';

export async function migrateUserData() {
    const localData = getLocalProgress();
    
    // Save main progress
    await saveUserProgress({
        total_problems: localData.totalProblems,
        solved_problems: localData.solvedProblems,
        correct_answers: localData.correctAnswers,
        wrong_submissions: localData.wrongSubmissions,
        // ... map all fields
    });
    
    // Mark completed problems
    for (const problemId of localData.solvedProblems) {
        await markProblemComplete(problemId, 0, 'medium', 'Unknown');
    }
    
    console.log('Migration complete!');
}
```

2. Call it once per user on first login after update.

### 5. Update Components

Replace old progressStorage calls with databaseService:

**Before:**
```javascript
import { getAchievementProgress, saveAchievementProgress } from '../lib/progressStorage';
const progress = getAchievementProgress();
```

**After:**
```javascript
import { getAchievementProgress, saveUserProgress } from '../lib/databaseService';
const progress = await getAchievementProgress();
```

### 6. Benefits of Database Storage

✅ **User Account Syncing** - Data follows the user across devices  
✅ **Real-time Updates** - Changes sync immediately  
✅ **Data Security** - Row Level Security ensures users only see their own data  
✅ **Scalability** - No localStorage size limits  
✅ **Backup & Recovery** - Supabase handles backups  
✅ **Advanced Queries** - Can build leaderboards, analytics, etc.  

### 7. Testing

1. **Create a test account** and log in
2. **Complete a problem** - verify it saves to database
3. **Check Supabase Dashboard** → Table Editor → `user_completed_problems`
4. **Log out and log back in** - verify data persists
5. **Try on different device** - data should sync

### 8. Rollback Plan

If issues arise, you can temporarily revert:
1. Keep the old `progressStorage.js` in the repo
2. Switch imports back from `databaseService` to `progressStorage`
3. Redeploy

## API Reference

See `src/lib/databaseService.js` for full API documentation. All functions are async and return Promises.

## Security

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Authentication is handled by Supabase Auth
- No additional backend code needed

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify RLS policies are active
3. Ensure user is authenticated before database calls
4. Check browser console for errors
