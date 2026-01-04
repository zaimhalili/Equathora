# Leaderboard System Setup Guide

## Overview
This guide explains the real leaderboard system implementation for Equathora, including XP calculation, ranking algorithms, and database integration.

## ✅ What's Been Implemented

### 1. **XP Calculation System** (`src/lib/leaderboardService.js`)
The system calculates user XP based on multiple factors:

**XP Formula:**
```
Total XP = Base XP + Accuracy Bonus + Streak Bonus + Reputation + Perfect Streak Bonus

Where:
- Base XP = problems_solved × 50
- Accuracy Bonus = (correct_answers / total_attempts) × 500
- Streak Bonus = current_streak × 10
- Reputation XP = reputation points (from achievements)
- Perfect Streak Bonus = perfect_streak × 20
```

**Per-Problem XP:**
- Easy: 50 XP base
- Medium: 100 XP base
- Hard: 200 XP base
- First Attempt Bonus: +50% of base XP
- Speed Bonus: +25 XP (if under 5 minutes)

### 2. **Leaderboard Service Functions**
Located in `src/lib/leaderboardService.js`:

#### Core Functions:
- `calculateUserXP(userProgress, streakData)` - Calculate total XP for a user
- `calculateProblemXP(difficulty, timeSpent, isFirstAttempt)` - Calculate XP for completing a problem
- `getGlobalLeaderboard(limit)` - Get ranked global leaderboard
- `getCurrentUserRank()` - Get current logged-in user's rank
- `getFriendsLeaderboard()` - Get friends leaderboard (placeholder for future friends feature)
- `getTopSolvers(category, limit)` - Get top solvers by category (overall, accuracy, streak)

#### Performance Features:
- `getCachedGlobalLeaderboard(forceRefresh)` - Cached leaderboard (1-minute cache)
- `clearLeaderboardCache()` - Clear cache after updates

### 3. **Updated Components**

#### GlobalLeaderboard (`src/pages/Leaderboards/GlobalLeaderboard.jsx`)
- ✅ Fetches real data from database
- ✅ Shows top 100 players by XP
- ✅ Displays user's current rank
- ✅ Shows problems solved, accuracy, and XP
- ✅ Loading and error states
- ✅ Retry functionality
- ✅ Highlights current user in list

#### TopSolversLeaderboard (`src/pages/Leaderboards/TopSolversLeaderboard.jsx`)
- ✅ Category selector (Overall, Accuracy, Streak)
- ✅ Dynamic sorting based on selected category
- ✅ Shows relevant stats per category
- ✅ Loading and error states
- ✅ User's rank display

### 4. **Ranking Algorithm**
Users are ranked by:
1. **Primary:** Total XP (descending)
2. **Secondary:** Reputation (if XP is tied)
3. **Tertiary:** Problems solved (if still tied)

Rankings update in real-time when leaderboard is fetched.

## 📋 Setup Instructions

### Step 1: Update Database Policies

Run the SQL script in Supabase SQL Editor:

```sql
-- File: backend/EquathoraBackend/leaderboard_setup.sql

-- Allow authenticated users to view leaderboard data
DROP POLICY IF EXISTS "Public users can view leaderboard data" ON user_progress;

CREATE POLICY "Public users can view leaderboard data" ON user_progress
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public users can view streak leaderboard data" ON user_streak_data;

CREATE POLICY "Public users can view streak leaderboard data" ON user_streak_data
FOR SELECT
TO authenticated
USING (true);
```

**Why this is needed:**
- By default, Row Level Security (RLS) only allows users to see their own data
- Leaderboards need to display other users' data
- This policy allows authenticated users to *read* (but not modify) others' progress

### Step 2: Test the Leaderboard

1. **Navigate to Leaderboards:**
   ```
   http://localhost:5173/leaderboards/global
   ```

2. **Expected Behavior:**
   - Loading spinner appears briefly
   - List of users appears sorted by XP
   - Your rank card appears at the bottom (if logged in)
   - Each card shows: name, problems solved, accuracy, XP

3. **Test Different Views:**
   - Global Leaderboard: `/leaderboards/global`
   - Top Solvers: `/leaderboards/top-solvers`
   - Try different categories in Top Solvers (Overall, Accuracy, Streak)

### Step 3: Verify XP Calculations

Check your XP calculation in browser console:

```javascript
// Open browser console (F12)
import { calculateUserXP } from './src/lib/leaderboardService';

// Example data
const userProgress = {
    solved_problems: ['1', '2', '3'],  // 3 problems
    correct_answers: 5,
    total_attempts: 6,
    reputation: 100,
    perfect_streak: 2
};

const streakData = {
    current_streak: 5
};

const xp = calculateUserXP(userProgress, streakData);
console.log('Total XP:', xp.totalXP);
console.log('Breakdown:', xp.breakdown);

// Expected output:
// Total XP: 706
// Breakdown: {
//   baseXP: 150 (3 × 50),
//   accuracyBonus: 416 ((5/6) × 500),
//   streakBonus: 50 (5 × 10),
//   reputationXP: 100,
//   perfectStreakBonus: 40 (2 × 20)
// }
```

## 🔧 Troubleshooting

### Issue: "Failed to load leaderboard data"

**Possible Causes:**
1. Database policies not set correctly
2. No users in database
3. Supabase connection issues

**Solutions:**
1. Run the SQL policies from `leaderboard_setup.sql`
2. Ensure at least one user exists with progress data
3. Check Supabase connection in browser console
4. Click "Retry" button to refresh

### Issue: Leaderboard shows empty

**Check:**
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM user_progress;
SELECT COUNT(*) FROM user_streak_data;
```

If counts are 0, users need to solve problems first.

### Issue: XP values seem incorrect

**Verify data:**
```sql
SELECT 
    user_id,
    array_length(solved_problems, 1) as solved_count,
    correct_answers,
    total_attempts,
    reputation,
    perfect_streak
FROM user_progress
LIMIT 10;
```

Check if:
- `solved_problems` array has data
- `correct_answers` and `total_attempts` are populated
- Values match expected XP calculation

### Issue: Current user doesn't appear in leaderboard

**Check authentication:**
```javascript
// In browser console
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

If session is null, user needs to log in.

### Issue: Policies error (406 or 403)

Run this to check existing policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('user_progress', 'user_streak_data');
```

Expected policies:
- `Public users can view leaderboard data` (SELECT, authenticated)
- `Public users can view streak leaderboard data` (SELECT, authenticated)
- `Users can view own progress` (SELECT, authenticated)
- `Users can insert own progress` (INSERT, authenticated)
- `Users can update own progress` (UPDATE, authenticated)

## 🚀 Performance Optimization (Optional)

### For Large User Bases (1000+ users):

1. **Add XP Column to Database:**
   ```sql
   ALTER TABLE user_progress ADD COLUMN total_xp INTEGER DEFAULT 0;
   ```

2. **Create Calculation Function:**
   ```sql
   -- See leaderboard_setup.sql for full function
   CREATE OR REPLACE FUNCTION calculate_user_xp(p_user_id UUID)
   RETURNS INTEGER AS $$ ... $$;
   ```

3. **Create Materialized View:**
   ```sql
   CREATE MATERIALIZED VIEW leaderboard_view AS
   SELECT ... -- See leaderboard_setup.sql
   ```

4. **Schedule Periodic Refresh:**
   - Use pg_cron extension
   - Refresh every 5 minutes
   - See `leaderboard_setup.sql` for details

### Current Approach:
- ✅ **On-the-fly calculation** (current implementation)
- Pros: Always accurate, no stale data
- Cons: Slightly slower for large user bases
- **Recommendation:** Fine for < 1000 users

## 📊 XP System Balance

### Average XP Values:
- **Beginner** (5 problems, 70% accuracy): ~500 XP
- **Intermediate** (20 problems, 80% accuracy): ~1800 XP
- **Advanced** (50 problems, 90% accuracy): ~4500 XP
- **Expert** (100+ problems, 95% accuracy): ~9000+ XP

### Ways to Earn XP:
1. ✅ **Solve Problems** - 50 XP per easy, 100 per medium, 200 per hard
2. ✅ **Maintain Accuracy** - Up to 500 bonus XP
3. ✅ **Build Streaks** - 10 XP per day of current streak
4. ✅ **Earn Reputation** - From achievements and milestones
5. ✅ **Perfect Streaks** - 20 XP per perfect streak count
6. 🔄 **First Attempt Bonus** - 50% extra XP (coming soon)
7. 🔄 **Speed Bonus** - 25 XP for quick solves (coming soon)

## 🔮 Future Enhancements

### Planned Features:
- [ ] Weekly leaderboard (reset weekly)
- [ ] Topic-specific leaderboards (Algebra, Geometry, etc.)
- [ ] Friends leaderboard (requires friends system)
- [ ] Leaderboard achievements (Top 10, Top 100, etc.)
- [ ] Historical rank tracking (see progress over time)
- [ ] Leaderboard notifications (moved up ranks)
- [ ] Season-based competitions
- [ ] Regional leaderboards

### Integration with Existing Features:
- ✅ Profile page already displays XP (via reputation)
- 🔄 Dashboard could show XP gains today
- 🔄 Achievements could award XP bonuses
- 🔄 Problem completion could show XP earned

## 📝 Notes

### Data Privacy:
- Only authenticated users can see leaderboard
- User emails are not displayed publicly
- Avatars and display names are shown
- Users can customize display name in profile settings

### Caching:
- Leaderboard is cached for 1 minute
- Cache automatically clears after updates
- Force refresh available via button
- Reduces database load significantly

### Database Queries:
- Optimized with indexes on user_id
- Joins user_progress + user_streak_data
- Sorts in JavaScript (not SQL) for flexibility
- Limit default: 100 users (configurable)

## ✅ Completion Checklist

- [x] XP calculation system implemented
- [x] Leaderboard service created
- [x] GlobalLeaderboard component updated
- [x] TopSolversLeaderboard component updated
- [x] Database policies documented
- [x] SQL setup script created
- [ ] **Database policies executed** (You need to do this in Supabase)
- [ ] **Leaderboards tested** (Test after running SQL)
- [ ] Friends leaderboard (Requires friends system - future task)

## 🎯 Next Steps

1. **Run SQL Setup:**
   - Go to Supabase Dashboard
   - SQL Editor
   - Paste and run policy statements from `leaderboard_setup.sql`

2. **Test Leaderboards:**
   - Navigate to `/leaderboards/global`
   - Verify data loads correctly
   - Check your rank appears
   - Test Top Solvers categories

3. **Update ToDo.txt:**
   - Mark "Connect Real Leaderboard Data" as ✓ completed

4. **Next Priority Task:**
   - Friend System Implementation (for Friends Leaderboard)
   - Or move to next item in roadmap

---

**Implementation Date:** January 4, 2026  
**Status:** ✅ Ready for testing (pending SQL execution)
