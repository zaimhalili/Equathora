# XP System Quick Reference

## XP Formula

### Total User XP
```
Total XP = Base XP + Accuracy Bonus + Streak Bonus + Reputation + Perfect Streak Bonus
```

### Component Breakdown

| Component | Formula | Example |
|-----------|---------|---------|
| **Base XP** | `problems_solved × 50` | 10 problems = 500 XP |
| **Accuracy Bonus** | `(correct_answers / total_attempts) × 500` | 8/10 = 400 XP |
| **Streak Bonus** | `current_streak × 10` | 5 days = 50 XP |
| **Reputation** | `reputation points` | 100 points = 100 XP |
| **Perfect Streak Bonus** | `perfect_streak × 20` | 3 streaks = 60 XP |

### Per-Problem XP

| Difficulty | Base XP | First Attempt Bonus | Speed Bonus | Total Max |
|------------|---------|---------------------|-------------|-----------|
| **Easy** | 50 XP | +25 XP | +25 XP | **100 XP** |
| **Medium** | 100 XP | +50 XP | +25 XP | **175 XP** |
| **Hard** | 200 XP | +100 XP | +25 XP | **325 XP** |

**Bonuses:**
- First Attempt Bonus: 50% of base XP (only on first correct submission)
- Speed Bonus: 25 XP (if completed in under 5 minutes)

## Example Calculations

### Example 1: New User
```javascript
solved_problems: 5
correct_answers: 6
total_attempts: 8
current_streak: 2
reputation: 0
perfect_streak: 0

Base XP: 5 × 50 = 250
Accuracy Bonus: (6/8) × 500 = 375
Streak Bonus: 2 × 10 = 20
Reputation: 0
Perfect Streak: 0

Total XP = 645
```

### Example 2: Sansationmediate User
```javascript
solved_problems: 25
correct_answers: 30
total_attempts: 35
current_streak: 7
reputation: 200
perfect_streak: 2

Base XP: 25 × 50 = 1,250
Accuracy Bonus: (30/35) × 500 = 428
Streak Bonus: 7 × 10 = 70
Reputation: 200
Perfect Streak: 2 × 20 = 40

Total XP = 1,988
```

### Example 3: Advanced User
```javascript
solved_problems: 80
correct_answers: 95
total_attempts: 100
current_streak: 15
reputation: 500
perfect_streak: 5

Base XP: 80 × 50 = 4,000
Accuracy Bonus: (95/100) × 500 = 475
Streak Bonus: 15 × 10 = 150
Reputation: 500
Perfect Streak: 5 × 20 = 100

Total XP = 5,225
```

## XP Progression Milestones

| Rank | XP Range | Estimated Profile |
|------|----------|-------------------|
| **Beginner** | 0 - 500 | 0-5 problems, starting out |
| **Learner** | 500 - 1,000 | 5-15 problems, building habits |
| **Solver** | 1,000 - 2,500 | 15-35 problems, consistent practice |
| **Expert** | 2,500 - 5,000 | 35-70 problems, high accuracy |
| **Master** | 5,000 - 10,000 | 70-150 problems, excellent performance |
| **Legend** | 10,000+ | 150+ problems, top performer |

## Ways to Maximize XP

### 1. **Solve More Problems** (Most Impact)
- Each problem = 50 XP minimum
- Focus on variety (Easy → Medium → Hard)
- Prioritize problems you haven't attempted

### 2. **Maintain High Accuracy** (High Impact)
- Up to 500 bonus XP
- Think before submitting
- Use hints wisely
- Review solutions

### 3. **Build Streaks** (Medium Impact)
- 10 XP per day of streak
- Solve at least 1 problem daily
- 30-day streak = 300 XP bonus

### 4. **Earn Reputation** (Medium Impact)
- Achievements award reputation
- Milestones (10, 25, 50, 100 problems)
- Difficulty challenges
- Reputation directly converts to XP

### 5. **Perfect Streaks** (Lower Impact)
- 20 XP per perfect streak count
- Get all problems correct in a session
- Requires high skill level

### 6. **Speed & First Attempt** (Coming Soon)
- First attempt bonus: +50% XP
- Speed bonus: +25 XP for quick solves
- Not yet implemented in current version

## Strategic Tips

### For Beginners:
1. Focus on **volume** (Base XP)
2. Start with Easy problems
3. Build a daily habit (Streak Bonus)
4. Don't worry about accuracy initially

### For Sansationmediate Users:
1. Balance **quantity and quality**
2. Improve accuracy (Accuracy Bonus)
3. Maintain 7+ day streaks
4. Mix difficulty levels
5. Aim for 80%+ accuracy

### For Advanced Users:
1. Prioritize **Hard problems** (200 XP each)
2. Maintain 90%+ accuracy
3. Build long streaks (14+ days)
4. Complete all achievements
5. Help others (future mentor system)

## Leaderboard Ranking

Users are ranked by:
1. **Total XP** (primary)
2. **Reputation** (tiebreaker)
3. **Problems Solved** (second tiebreaker)

### Rank Distribution (Expected)
- Top 10: 5,000+ XP
- Top 50: 2,500+ XP
- Top 100: 1,000+ XP
- Average: 500-1,000 XP

## XP Display Locations

- ✅ **Global Leaderboard** - Main XP display
- ✅ **Top Solvers Leaderboard** - XP with category stats
- ✅ **Profile Page** - Shows reputation (converts to XP)
- 🔄 **Dashboard** - Could show daily XP gains (future)
- 🔄 **Problem Completion** - Could show XP earned (future)
- 🔄 **XP History Graph** - Track XP over time (future)

## API Functions

### Calculate XP:
```javascript
import { calculateUserXP } from './lib/leaderboardService';

const xp = calculateUserXP(userProgress, streakData);
console.log('Total XP:', xp.totalXP);
console.log('Breakdown:', xp.breakdown);
```

### Get Leaderboard:
```javascript
import { getGlobalLeaderboard } from './lib/leaderboardService';

const leaderboard = await getGlobalLeaderboard(100); // Top 100
```

### Get User Rank:
```javascript
import { getCurrentUserRank } from './lib/leaderboardService';

const myRank = await getCurrentUserRank();
console.log('My rank:', myRank.rank);
console.log('My XP:', myRank.xp);
```

## Future XP Features

- [ ] XP multipliers (weekends, events)
- [ ] Bonus XP challenges (daily quests)
- [ ] XP decay for inactivity (optional)
- [ ] XP leagues/divisions
- [ ] XP rewards (unlock features)
- [ ] XP history visualization
- [ ] Predicted XP gain per problem
- [ ] XP comparison with friends

---

**Last Updated:** January 4, 2026  
**Version:** 1.0  
**Status:** ✅ Live
