# How to Reset User Data

This guide explains how to reset all user problem-solving data to fix issues with duplicate entries and incorrect statistics.

## When to Use This

- Users showing incorrect solved problem counts (e.g., "13/10 solved")
- Accuracy showing 0% when it shouldn't
- Duplicate problem entries in the database
- Need to start fresh with accurate tracking

## Steps to Reset

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://xllrrsozvqremkenhost.supabase.co
2. Navigate to the **SQL Editor** section in the left sidebar
3. Click **+ New query** button
4. Open the `reset_user_data.sql` file from this directory
5. Copy and paste the entire SQL script into the SQL Editor
6. Click **Run** (or press Ctrl+Enter) to execute the script
7. Verify the output shows all tables have 0 records

### Option 2: Using psql Command Line

If you have direct database access:

```bash
psql -h your-supabase-host -U postgres -d postgres -f reset_user_data.sql
```

## What Gets Reset

The script will clear:
- ✅ All user progress data
- ✅ All completed problem records
- ✅ All submissions
- ✅ All streaks
- ✅ All favorites
- ✅ All difficulty breakdowns
- ✅ All weekly progress
- ✅ All topic frequencies
- ✅ Leaderboard materialized view (if exists)

## What Stays Intact

- ✅ User accounts (auth.users)
- ✅ User profiles
- ✅ Problems and problem groups
- ✅ All other system data

## After Reset

Users will:
1. Start with 0 solved problems
2. Have accurate problem counts (no duplicates)
3. See correct accuracy calculations
4. Appear on leaderboard even with 0 points
5. See correct percentages and statistics

## Code Fixes Applied

The following code fixes were also applied to prevent future issues:

1. **`databaseService.js`**: `getCompletedProblems()` now automatically detects and removes duplicates
2. **`Profile.jsx`**: Fixed accuracy calculation to use `correct_answers/total_attempts` instead of `solved/total`
3. **`leaderboardService.js`**: Updated to show ALL users on leaderboard, even those with 0 points

## Notes

- This operation is **irreversible** - make a backup if needed
- The script runs in a transaction (BEGIN/COMMIT) for safety
- Users will need to re-solve problems to rebuild their stats
- Favorites will need to be re-added by users
