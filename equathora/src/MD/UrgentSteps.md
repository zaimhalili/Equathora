# EQUATHORA — Urgent Steps (Bite-Sized Tasks)

> Each task is small enough to complete in one focused session.
> Feed them one-by-one (or a few at a time) to avoid choking.
> Ordered by urgency: CRITICAL → HIGH → MEDIUM → LOW → FUTURE.
>
> **Best Practices:** Always refer to `claude/` standards before making changes:
> - `claude/DATABASE_STANDARDS.md` — Problems table schema, INSERT format, field rules
> - `claude/ENGINEERING_STANDARDS.md` — Tech stack, file naming, component/backend rules
> - `claude/MATH_STANDARDS.md` — LaTeX formatting, problem authoring format
> - `claude/DESIGN_STANDARDS.md` — UI/UX conventions
> - `claude/CONSTITUTION.md` — Overall project principles
>
> **Book Sources (already downloaded — use ONLY these for new problems):**
> - `backend/EquathoraBackend/books/fts.txt` — Hall & Knight "Elementary Algebra" OCR (14,519 lines)
> - `backend/EquathoraBackend/books/ftsHallKnight.txt` — Hall & Knight "Higher Algebra" OCR (18,236 lines)
> - `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` — Pre-extracted hard exercises (904 lines, ~600 problems across 8 chapters)
>
> **ToDo.md Reference:** `src/MD/ToDo.md` — Full roadmap. Line numbers cited as `(ToDo L###)` below.

---

## 🔴 TIER 1 — CRITICAL (Do immediately, data integrity / exploit risks)

### ✅ 1.1 Fix C# Problem model — Change `Id` from `Guid` to `int`
- **File:** `backend/EquathoraBackend/Models/Problem.cs`
- **Task:** ~~Change `public Guid Id` to `public int Id` to match Supabase `SERIAL id`.~~ **DONE.**
- **What was done:** Changed `Guid Id` → `int Id`, added `[Table("problems")]` and `[Column]` annotations for all properties, added all missing Supabase columns (`group_id`, `description`, `accepted_answers`, `hints`, `solution`, `is_premium`, `display_order`, `is_active`, `slug`, `updated_at`). Also updated `Attempt.cs` (`ProblemId` Guid→int), `AttemptRequest.cs`, `ProblemPublicDto.cs`, `ProblemEndpoints.cs`, and `DbSeeder.cs` to match. Build succeeds with 0 errors.
- **Ref:** (ToDo L65-68) schema mismatch details, `claude/DATABASE_STANDARDS.md` for schema

### ✅ 1.2 Fix C# Problem model — Change `Difficulty` from `int` to `string`
- **File:** `backend/EquathoraBackend/Models/Problem.cs`
- **Task:** ~~Change `public int Difficulty` to `public string Difficulty` to match Supabase `VARCHAR difficulty`.~~ **DONE.**
- **What was done:** Completed as part of 1.1. The `Difficulty` property is now `string` with `[Column("difficulty")]` attribute. `ProblemPublicDto` also updated to `string Difficulty`. `DbSeeder` seed data updated from `Difficulty = 1` to `Difficulty = "Easy"`.
- **Ref:** (ToDo L65-68), `claude/DATABASE_STANDARDS.md` `problems` table schema

### ✅ 1.3 Update EF Core mappings after model changes
- **File:** `backend/EquathoraBackend/Data/AppDbContext.cs`
- **Task:** ~~Update EF Core configuration to reflect new types.~~ **DONE.**
- **What was done:** The `Problem` model now uses `[Table]` and `[Column]` data annotations, so EF Core auto-maps correctly. No explicit `OnModelCreating` configuration was needed. `AppDbContext.cs` was already clean (auto-convention based). Build succeeds.
- **Cascading files updated:** `Attempt.cs`, `AttemptRequest.cs`, `ProblemPublicDto.cs`, `ProblemEndpoints.cs`, `DbSeeder.cs`, `/api/problems` endpoint in `Program.cs`.

### 1.4 Create a SQL migration script for schema alignment
- **File:** New file `backend/EquathoraBackend/Migrations/fix_schema_alignment.sql`
- **Task:** Write a migration that documents the C# model ↔ Supabase alignment. Include column type verification queries and any ALTER TABLE statements if columns were missing.
- **Ref:** (ToDo L881-894) schema mismatch fix, `claude/DATABASE_STANDARDS.md` for exact schema

### 1.5 Fix proof-problem validation exploit — identify affected problems
- **File:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` + seed SQL files
- **Task:** Search seed files for all problems where `accepted_answers` contains `'Proof required'`, `'proof'`, or `'proved'`. List all ~25 affected problem IDs. These come from the Hall & Knight extraction.
- **Ref:** (ToDo L70-73) proof exploit description, (ToDo L243-255) proof problem fix options

### 1.6 Fix proof-problem validation — update answerValidation.js
- **File:** `src/lib/answerValidation.js`
- **Task:** Add a check: if a problem's `accepted_answers` only contains proof-type placeholders (`'Proof required'`, `'proof'`, `'proved'`), mark it as a proof-type problem that **cannot** be scored by text match. Either (a) reject all answers with a "This is a proof problem — scoring not supported yet" message, or (b) flag these problems as unscored.
- **Ref:** (ToDo L70-73, L896-928) answer validation pipeline, `claude/ENGINEERING_STANDARDS.md` error handling rules

### 1.7 Fix proof-problem validation — update seed data
- **File:** `backend/EquathoraBackend/seed_110_hard_problems_hallknight.sql`
- **Task:** For all ~25 proof problems, change `accepted_answers` to `'{}'` (empty array) and set a comment marking them as `problem_type = 'proof'` (column will be added in task 3.4). Alternatively, convert to multi-part problems with verifiable intermediate answers sourced from the original Hall & Knight book solutions at `books/ftsHallKnight.txt`.
- **Ref:** (ToDo L243-255) three options for proof problems

---

## 🟠 TIER 2 — HIGH PRIORITY (Broken features & foundation for growth)

### 2.1 Fix achievement bug — `snowflake` ("Cool Under Pressure")
- **File:** `src/data/achievements.js`
- **Task:** Find the `'snowflake'` achievement. Its description says "without hints" but the condition only checks `hardProblems >= 10`. Add a condition that also checks the user has **not** used hints on those hard problems.
- **Ref:** (ToDo L75-80) achievement bugs, `claude/ENGINEERING_STANDARDS.md` component rules

### 2.2 Fix achievement bug — `night-owl` and `early-riser` timing
- **File:** `src/data/achievements.js`
- **Task:** These achievements check the current render time (`new Date()`) instead of the actual problem solve timestamp. Fix them to check the timestamp when the problem was actually solved (from `user_submissions` or progress data).
- **Ref:** (ToDo L75-80)

### 2.3 Fix achievement bug — `speed-demon` calculation
- **File:** `src/data/achievements.js`
- **Task:** `'speed-demon'` computes a global average time instead of per-problem time. Fix it to use per-problem solve time (from Timer component data).
- **Ref:** (ToDo L80)

### 2.4 Remove console.log statements from production code (batch 1 — components/)
- **Files:** All files in `src/components/`
- **Task:** Search for and remove all `console.log(...)` statements. Replace any that serve as error logging with proper error handling or remove silently.
- **Ref:** (ToDo L90, L1027-1030), `claude/ENGINEERING_STANDARDS.md` error handling rules

### 2.5 Remove console.log statements (batch 2 — pages/)
- **Files:** All files in `src/pages/`
- **Task:** Same as 2.4 but for page files.

### 2.6 Remove console.log statements (batch 3 — lib/, utils/, data/, hooks/)
- **Files:** All files in `src/lib/`, `src/utils/`, `src/data/`, `src/hooks/`
- **Task:** Same as 2.4 but for utility/library files.

### 2.7 Remove duplicate `motion` dependency
- **File:** `package.json`
- **Task:** Check if both `framer-motion` and `motion` are installed. Remove the `motion` package (keep `framer-motion` — locked in `claude/ENGINEERING_STANDARDS.md` tech stack). Update any imports referencing `motion` to use `framer-motion`.
- **Ref:** (ToDo L91), `claude/ENGINEERING_STANDARDS.md` tech stack table

### 2.8 Replace remaining `alert()` calls with toast notifications
- **Files:** Search across `src/` for `alert(`
- **Task:** Find and replace the ~4 remaining `alert()` calls with the existing toast/notification system.
- **Ref:** (ToDo L1034)

### 2.9 Identify and remove unused hooks
- **Files:** `src/hooks/`
- **Task:** List all hooks, check which ones are imported anywhere. Remove the ~3 unused hooks.
- **Ref:** (ToDo L1031), `claude/ENGINEERING_STANDARDS.md` project structure

### 2.10 Identify and remove unused lib files
- **Files:** `src/lib/`
- **Task:** Check which lib files are never imported. Remove the ~2 unused ones.
- **Ref:** (ToDo L1032)

### 2.11 Remove legacy local problems data file
- **File:** `src/data/problems.js`
- **Task:** Check if this file (50 local problems) is still imported anywhere. If it's only a legacy fallback, remove it. Update any imports to use the database service instead.
- **Ref:** (ToDo L1036-1037)

### 2.12 Remove duplicate AuthController.cs
- **File:** `backend/EquathoraBackend/Controllers/AuthController.cs`
- **Task:** Verify this duplicates the minimal API auth endpoints in `Program.cs`. If so, delete it. Per `claude/ENGINEERING_STANDARDS.md`: "Minimal API endpoints preferred over controllers for new routes."
- **Ref:** (ToDo L1038-1039)

### 2.13 Clean up empty/stub pages (More.jsx, Discover.jsx, Premium.jsx)
- **Files:** `src/pages/More.jsx`, `src/pages/Discover.jsx`, `src/pages/Premium.jsx`
- **Task:** If these pages are empty/commented-out, either add a "Coming Soon" placeholder or remove them from the router and sidebar navigation.
- **Ref:** (ToDo L1035)

---

## 🟡 TIER 3 — HIGH PRIORITY (Schema & data improvements for scaling)

### 3.1 Add `difficulty_score` column to problems table
- **File:** New migration file or `database_schema.sql`
- **Task:** `ALTER TABLE problems ADD COLUMN difficulty_score INT CHECK (difficulty_score BETWEEN 1 AND 100);`
- **Ref:** (ToDo L229-241) difficulty calibration, (ToDo L845-846) schema definition, `claude/DATABASE_STANDARDS.md`

### 3.2 Assign difficulty_score to base problems (IDs 1-100)
- **File:** New SQL update script
- **Task:** Write UPDATE statements to assign a 1-100 difficulty_score to each of the 100 base problems. Use guidelines from (ToDo L229-241): single-step = 10-20, multi-step = 30-50, complex multi-technique = 60-80. **Source problems from existing seed files only.**

### 3.3 Assign difficulty_score to Hall & Knight problems (IDs 101-210)
- **File:** New SQL update script
- **Task:** Same as 3.2 but for the 110 Hall & Knight problems. Cross-reference `books/hallknight_hard_exercises.txt` chapter difficulty. Most should be 70-100.
- **Ref:** (ToDo L229-241), `books/hallknight_hard_exercises.txt` (lines 7-904 for chapter breakdown)

### 3.4 Add `problem_type` and `problem_category` columns
- **File:** New migration
- **Task:** 
  ```sql
  ALTER TABLE problems ADD COLUMN problem_type VARCHAR(50) DEFAULT 'computation';
  ALTER TABLE problems ADD COLUMN problem_category VARCHAR(50) DEFAULT 'general';
  ```
- **Ref:** (ToDo L318-336) problem types, (ToDo L434-435) column definitions, `claude/DATABASE_STANDARDS.md`

### 3.5 Classify existing problems by category
- **File:** New SQL update script
- **Task:** Set `problem_category` for all 210 problems: IDs 1-100 → `'general'`, IDs 101-210 → `'olympiad'`. Set `problem_type` for proof problems → `'proof'`, rest → `'computation'`.
- **Ref:** (ToDo L318-336)

### 3.6 Add metadata columns to problems table (batch 1)
- **File:** New migration
- **Task:**
  ```sql
  ALTER TABLE problems ADD COLUMN estimated_time_minutes INT;
  ALTER TABLE problems ADD COLUMN concepts TEXT[];
  ALTER TABLE problems ADD COLUMN prerequisites INT[];
  ALTER TABLE problems ADD COLUMN source VARCHAR(255);
  ALTER TABLE problems ADD COLUMN tags TEXT[];
  ```
- **Ref:** (ToDo L329-336, L838-878) full column spec, `claude/DATABASE_STANDARDS.md`

### 3.7 Add metadata columns to problems table (batch 2 — analytics & monetization)
- **File:** New migration
- **Task:**
  ```sql
  ALTER TABLE problems ADD COLUMN difficulty_rating INT DEFAULT 1000;
  ALTER TABLE problems ADD COLUMN solve_count INT DEFAULT 0;
  ALTER TABLE problems ADD COLUMN attempt_count INT DEFAULT 0;
  ALTER TABLE problems ADD COLUMN premium_tier VARCHAR(20) DEFAULT 'free';
  ALTER TABLE problems ADD COLUMN token_cost INT DEFAULT 0;
  ALTER TABLE problems ADD COLUMN explanation TEXT;
  ```
- **Ref:** (ToDo L847-878) analytics/monetization columns

### 3.8 Create `domains` table
- **File:** New migration
- **Task:** Create `domains` table and seed 6 domains: Algebra, Geometry, Trigonometry, Calculus, Discrete Mathematics, Statistics & Probability.
- **Ref:** (ToDo L400-407) table definition, `claude/DATABASE_STANDARDS.md`

### 3.9 Create `tracks` table
- **File:** New migration
- **Task:** Create `tracks` table. Seed initial Algebra tracks: Foundations, Equations & Inequalities, Polynomials & Factoring, Advanced Algebra, Competition Algebra.
- **Ref:** (ToDo L410-420) table definition

### 3.10 Create `units` table
- **File:** New migration
- **Task:** Create `units` table. Seed units for the Algebra tracks.
- **Ref:** (ToDo L423-430) table definition

### 3.11 Add `unit_id` FK to problems table + assign existing problems
- **File:** New migration
- **Task:** `ALTER TABLE problems ADD COLUMN unit_id INT REFERENCES units(id);` Then write UPDATE statements mapping existing 210 problems to appropriate units.
- **Ref:** (ToDo L433-443)

### 3.12 Create `user_unit_mastery` table
- **File:** New migration
- **Task:**
  ```sql
  CREATE TABLE user_unit_mastery (
    user_id UUID REFERENCES auth.users(id),
    unit_id INT REFERENCES units(id),
    problems_attempted INT DEFAULT 0,
    problems_correct INT DEFAULT 0,
    mastery_score DECIMAL(5,2) DEFAULT 0,
    last_practiced TIMESTAMPTZ,
    next_review_date TIMESTAMPTZ,
    PRIMARY KEY (user_id, unit_id)
  );
  ```
- **Ref:** (ToDo L510-523) mastery model, `claude/DATABASE_STANDARDS.md`

---

## 🟢 TIER 4 — MEDIUM PRIORITY (Frontend features & engagement)

### 4.1 Make Tracks page dynamic — fetch tracks from database
- **File:** `src/pages/Tracks.jsx`
- **Task:** Replace the hardcoded 3 polynomial tracks with a dynamic fetch from the new `tracks` table via Supabase. Display all active tracks grouped by domain.
- **Ref:** (ToDo L86-88, L1071-1073), `claude/ENGINEERING_STANDARDS.md` component rules, `claude/DESIGN_STANDARDS.md`

### 4.2 Make Tracks page dynamic — add track card component
- **File:** `src/pages/Tracks.jsx` or new `src/components/TrackCard.jsx`
- **Task:** Create a reusable card component for each track showing: name, domain, difficulty range, problem count, user progress %, and lock/unlock state.
- **Ref:** `claude/DESIGN_STANDARDS.md`, `claude/ENGINEERING_STANDARDS.md` styling rules (Tailwind only)

### 4.3 Connect mathPathData.js skill tree — map nodes to units
- **File:** `src/data/mathPathData.js`
- **Task:** Refactor the 20-node DAG so each node's `id` maps to a real `unit_id` in the database. Add a `unitId` field to each node.
- **Ref:** (ToDo L82-84, L627-638, L1296)

### 4.4 Connect skill tree — color nodes by mastery level
- **File:** Component rendering the skill tree
- **Task:** Fetch `user_unit_mastery` for the current user. Color each node: gray (not started), blue (in progress), yellow (practiced), green (proficient), gold (mastered).
- **Ref:** (ToDo L627-638)

### 4.5 Connect skill tree — make nodes clickable
- **File:** Skill tree component
- **Task:** Clicking a skill tree node navigates to that unit's problem list. Show a padlock icon on locked nodes.

### 4.6 Build dependency graph service
- **File:** New `src/lib/dependencyGraph.js`
- **Task:** Create a service with `getAvailableUnits(userId)` — loads units + prerequisites, checks mastery ≥ 80%, returns `{ unlocked: [], locked: [], next_recommended: [] }`.
- **Ref:** (ToDo L930-947) dependency graph engine

### 4.7 Implement unit unlock UI
- **Files:** Problem group/unit list pages
- **Task:** Locked units show grayed out with a padlock and "Complete [Unit X] at 80% to unlock" message.
- **Ref:** (ToDo L607-622) unlock system

### 4.8 Implement streak freeze — database table
- **File:** New migration
- **Task:** Create `streak_freezes` table and add `streak_freezes_available INT DEFAULT 1` to user_progress.
- **Ref:** (ToDo L553-582) streak system improvements

### 4.9 Implement streak freeze — logic in progressStorage.js
- **File:** `src/lib/progressStorage.js`
- **Task:** When checking daily streak, if user missed yesterday: check freeze availability, consume if yes, preserve streak.
- **Ref:** (ToDo L553-582)

### 4.10 Implement streak freeze — UI in Settings page
- **File:** Settings page
- **Task:** Show current freeze count. Free tier: auto-replenish 1/month. Premium: unlimited.
- **Ref:** (ToDo L556-562)

### 4.11 Fix streak data sync — use Supabase as source of truth
- **File:** `src/lib/progressStorage.js`
- **Task:** Currently streaks are in localStorage (device-specific). Change to always sync to Supabase `user_streak_data` first, cache locally.
- **Ref:** (ToDo L573-577)

### 4.12 Improve Daily Challenge selection
- **File:** `src/pages/Dashboard.jsx`
- **Task:** Replace random selection with curated rotation: Mon=Easy, Tue=Medium, Wed=Hard, Thu=Olympiad, Fri=Bridge, Sat/Sun=Special.
- **Ref:** (ToDo L640-655)

### 4.13 Add Daily Challenge leaderboard
- **File:** `src/pages/Dashboard.jsx` + `src/lib/leaderboardService.js`
- **Task:** Leaderboard ranking users by solve-time for today's daily challenge problem. Display top 10.
- **Ref:** (ToDo L1126-1128)

### 4.14 Add diagnostic onboarding quiz page
- **File:** New `src/pages/OnboardingQuiz.jsx`
- **Task:** 10 diagnostic problems (2 Easy, 3 Medium, 3 Hard, 2 Olympiad). Calculate starting skill_rating. **Source problems from `books/fts.txt` (elementary) and `books/hallknight_hard_exercises.txt` (advanced).**
- **Ref:** (ToDo L497-504) onboarding flow, `claude/MATH_STANDARDS.md` for LaTeX

### 4.15 Wire onboarding quiz into signup flow
- **Files:** Auth flow, router
- **Task:** After first signup, redirect to OnboardingQuiz. On completion, save the result and redirect to the recommended unit.
- **Ref:** (ToDo L497-504)

---

## 🔵 TIER 5 — MEDIUM-LOW PRIORITY (Content extraction from books & validation)

> **CRITICAL NOTE:** All new problems MUST be extracted from the already-downloaded books.
> Do NOT invent problems. Use the source material below.

### 5.0 Book Extraction Strategy — Quick Free Methods
Before seeding problems, consider these extraction approaches (fastest → most thorough):

**Method A — Direct regex extraction from `hallknight_hard_exercises.txt` (fastest)**
- File is already pre-extracted: 904 lines, ~600 problems, 8 chapters
- Chapters: Complex Numbers (L7), Binomial Theorem (L55), Inequalities (L130), Convergency (L193), Summation of Series (L242), Probability (L333), Determinants (L533), Theory of Equations (L643)
- Parse with regex: lines starting with `\d+\.` are problem statements
- Python script at `tools/extract_ocr_exercises.py` already exists — extend it

**Method B — OCR text mining from `ftsHallKnight.txt` (18,236 lines)**
- Full "Higher Algebra" textbook OCR — contains problems WITH solutions (answers in "ANSWERS" sections at chapter ends)
- Search for "EXAMPLES" headers to find exercise blocks, then "ANSWERS" for solutions
- Procedure: `grep -n "EXAMPLES\|ANSWERS\|EXERCISE" books/ftsHallKnight.txt` to locate sections
- Cross-reference answer sections with problem numbers for full problem+solution pairs

**Method C — Elementary Algebra from `fts.txt` (14,519 lines)**
- Full "Elementary Algebra for Schools" OCR — ideal source for Easy/Medium problems
- Contains foundational topics: arithmetic, basic algebra, equations, factoring, fractions, surds, quadratics
- Same extraction method as Method B — search for "EXERCISE" and "ANSWERS" sections
- **This is the best source for the missing Easy "concept-introduction" problems**

**Method D — AI-assisted batch extraction (recommended for scale)**
- Feed 200-line chunks of `fts.txt` or `ftsHallKnight.txt` to Claude/GPT
- Prompt: "Extract each numbered exercise as a JSON object with: `number`, `statement`, `chapter`, `difficulty_estimate`. Format math as LaTeX."
- Then manually verify answers against the "ANSWERS" section of the same book
- Follow `claude/MATH_STANDARDS.md` for all LaTeX formatting
- Follow `claude/DATABASE_STANDARDS.md` INSERT template for SQL output

**Method E — Extend existing Python extractor**
- File: `tools/extract_ocr_exercises.py` — already handles some OCR parsing
- Also: `tools/test_normalize.py` — normalisation utilities
- Extend to output SQL INSERT statements matching `claude/DATABASE_STANDARDS.md` format

### 5.1 Extract Easy problems from Elementary Algebra (batch 1 — 25 problems)
- **Source:** `backend/EquathoraBackend/books/fts.txt` (Elementary Algebra)
- **Task:** Extract 25 Easy problems from early chapters (arithmetic, basic equations, simple factoring). Use Method C or D above. Each needs: title, description (LaTeX), answer, accepted_answers, hints (4-tier per `claude/MATH_STANDARDS.md`), solution steps.
- **Ref:** (ToDo L1078-1082) H8 task, `claude/MATH_STANDARDS.md` problem authoring format, `claude/DATABASE_STANDARDS.md` INSERT template

### 5.2 Extract Easy problems from Elementary Algebra (batch 2 — 25 problems)
- **Source:** `backend/EquathoraBackend/books/fts.txt`
- **Task:** Extract 25 more Easy problems from: surds, simple inequalities, quadratic intro, ratio/proportion chapters.
- **Ref:** (ToDo L1078-1082)

### 5.3 Extract bridge problems from Higher Algebra (batch 1 — 15 problems)
- **Source:** `backend/EquathoraBackend/books/ftsHallKnight.txt` early chapters (before the advanced material)
- **Task:** Extract 15 Medium problems from the less advanced chapters of Higher Algebra. These bridge the gap between Elementary Algebra (Easy) and the hard exercises (Olympiad). Look for chapters on: Ratio, Proportion, Variation, Arithmetical Progression, Geometrical Progression.
- **Ref:** (ToDo L1084-1087) H9 task, (ToDo L133-146) bridge problem rationale

### 5.4 Extract bridge problems from Higher Algebra (batch 2 — 15 problems)
- **Source:** `backend/EquathoraBackend/books/ftsHallKnight.txt`
- **Task:** Extract 15 more Medium-Hard bridge problems from intermediate chapters: Permutations & Combinations, Binomial Theorem (positive integer index), partial fractions.
- **Ref:** (ToDo L1084-1087)

### 5.5 Improve answer validation — add answer_type support
- **File:** `src/lib/answerValidation.js`
- **Task:** Add an `answer_type` check. If `'numeric'`, use numeric comparison with configurable tolerance. If `'set'`, sort elements before comparing. If `'proof'`, show "proof problems are unscored" message.
- **Ref:** (ToDo L896-928) answer validation improvements, `claude/ENGINEERING_STANDARDS.md`

### 5.6 Improve answer validation — add set comparison
- **File:** `src/lib/answerValidation.js`
- **Task:** Add `compareSetAnswers(userAnswer, correctAnswer)` function: parse comma-separated values, sort both, compare after normalization.
- **Ref:** (ToDo L912-914)

### 5.7 Improve answer validation — add client-side CAS fallback
- **File:** `src/lib/answerValidation.js` or `src/utils/mathNetService.js`
- **Task:** Add `algebrite` or `math.js` as a client-side algebraic equivalence checker when backend Math.NET is unavailable.
- **Ref:** (ToDo L918-924), check `claude/ENGINEERING_STANDARDS.md` before adding new dependencies

### 5.8 Add database indexes for performance
- **File:** New migration
- **Task:**
  ```sql
  CREATE INDEX idx_problems_topic ON problems(topic);
  CREATE INDEX idx_problems_group_order ON problems(group_id, display_order);
  CREATE INDEX idx_problems_unit ON problems(unit_id);
  CREATE INDEX idx_problems_category ON problems(problem_category);
  CREATE INDEX idx_problems_difficulty ON problems(difficulty_score);
  ```
- **Ref:** (ToDo L950-960), `claude/DATABASE_STANDARDS.md`

---

## ⚪ TIER 6 — LOW PRIORITY (Advanced features, new content domains)

### 6.1 Implement Stripe subscription — backend webhook
- **File:** New endpoint in `backend/EquathoraBackend/`
- **Task:** Stripe webhook for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
- **Ref:** (ToDo L697-810) monetization section, `claude/ENGINEERING_STANDARDS.md` backend rules

### 6.2 Implement Stripe subscription — frontend Premium page
- **File:** `src/pages/Premium.jsx`
- **Task:** Build comparison page: Free / Scholar($7.99) / Olympiad($14.99). Stripe Checkout integration.
- **Ref:** (ToDo L709-751) tier details

### 6.3 Implement Stripe subscription — paywall enforcement
- **Files:** `src/lib/problemService.js`
- **Task:** Check user's `premium_tier` when loading problems. Locked state + upgrade prompt for premium problems.
- **Ref:** (ToDo L775-797)

### 6.4 Mark existing problems with premium_tier values
- **File:** New SQL update script
- **Task:** Easy → `'free'`, Medium general → 50/50 `'free'`/`'scholar'`, Hard general → `'scholar'`, Hall & Knight → `'olympiad'`.
- **Ref:** (ToDo L798-810)

### 6.5 Build admin problem editor — page scaffold
- **File:** New `src/pages/AdminProblemEditor.jsx`
- **Task:** Admin-only page with LaTeX-aware form, live MathJax preview. Follow `claude/DESIGN_STANDARDS.md` and `claude/ENGINEERING_STANDARDS.md`.
- **Ref:** (ToDo L987-1009)

### 6.6 Build admin problem editor — save to Supabase
- **File:** `src/pages/AdminProblemEditor.jsx`
- **Task:** Wire form to Supabase insert/update. Include accepted answers tester. Follow `claude/DATABASE_STANDARDS.md` INSERT format.
- **Ref:** (ToDo L987-1009)

### 6.7 Extract Geometry problems from Hall & Knight (batch 1 — 20 Easy)
- **Source:** `backend/EquathoraBackend/books/fts.txt` (Elementary Algebra has some geometric application problems)
- **Task:** Extract 20 Easy geometry-related problems. Note: Hall & Knight is algebra-focused, so look for: area/perimeter word problems, geometric series applications, and algebraic geometry foundations.
- **Ref:** (ToDo L449-454) geometry track target, `claude/MATH_STANDARDS.md`
- **Alternative:** If insufficient geometry in source books, flag for future textbook acquisition (e.g., public domain Euclid's Elements OCR).

### 6.8 Extract problems from Higher Algebra — Summation of Series (30 Medium)
- **Source:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` lines 242-332 (Chapter XXIX)
- **Task:** Extract and format 30 Medium problems from the Summation of Series chapter. These are ideal medium-difficulty algebra practice.
- **Ref:** `claude/DATABASE_STANDARDS.md` INSERT format, `claude/MATH_STANDARDS.md` LaTeX rules

### 6.9 Extract problems from Higher Algebra — Probability (30 Medium-Hard)
- **Source:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` lines 333-532 (Chapter XXXII — 200 lines!)
- **Task:** Extract and format 30 probability problems. This is the richest chapter in the extracted file.
- **Ref:** (ToDo L465-468) probability track target

### 6.10 Extract problems from Higher Algebra — Theory of Equations (20 Hard)
- **Source:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` lines 643-904 (Chapter XXXV)
- **Task:** Extract 20 Hard problems. Cross-reference answers from `books/ftsHallKnight.txt` answer sections.

### 6.11 Extract Trigonometry-adjacent problems from Elementary Algebra
- **Source:** `backend/EquathoraBackend/books/fts.txt`
- **Task:** Search for chapters on: surds (related to trig identities), complex number basics, quadratic discriminants. Extract 15 Easy-Medium problems.
- **Note:** Hall & Knight books are algebra-focused. True trigonometry will require a separate public domain source. See **6.28** for alternatives.

### 6.12 Extract problems from Higher Algebra — Determinants (25 Medium-Hard)
- **Source:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` lines 533-642 (Chapter XXXIII)
- **Task:** Extract 25 determinant problems. These map to the Linear Algebra track.
- **Ref:** (ToDo L459-462) linear algebra target

### 6.13 Extract problems from Higher Algebra — Inequalities (20 Medium-Hard)
- **Source:** `backend/EquathoraBackend/books/hallknight_hard_exercises.txt` lines 130-192 (Chapter XIX)
- **Task:** Extract 20 inequality problems. These bridge algebra and olympiad preparation.

### 6.14 Implement Elo-based adaptive difficulty — rating service
- **File:** New `src/lib/adaptiveDifficultyService.js`
- **Task:** Implement `calculateNewRatings(userRating, problemRating, isCorrect)` using Elo formula.
- **Ref:** (ToDo L584-606) Elo system design

### 6.15 Implement Elo-based adaptive difficulty — recommendation engine
- **File:** `src/lib/adaptiveDifficultyService.js`
- **Task:** `getRecommendedProblems(userId, count, topicFilter)` — return problems where `|user_rating - problem_rating| < 150`.
- **Ref:** (ToDo L584-606)

### 6.16 Implement Elo-based adaptive difficulty — wire into problem pages
- **Files:** `src/pages/Learn.jsx`, `src/pages/ProblemGroup.jsx`
- **Task:** After each solve, call `calculateNewRatings()` and update ratings. Show "Recommended for you" section.
- **Ref:** (ToDo L584-606)

### 6.17 Implement token economy — database tables
- **File:** New migration
- **Task:** Create `token_transactions` table. Add `token_balance INT DEFAULT 0` to user_progress.
- **Ref:** (ToDo L756-773) token system

### 6.18 Implement token economy — earn/spend logic
- **File:** New `src/lib/tokenService.js`
- **Task:** `earnTokens()`, `spendTokens()`, `getBalance()` with all rules from (ToDo L758-772).
- **Ref:** (ToDo L756-773)

### 6.19 Implement token economy — UI integration
- **Files:** Navbar, Dashboard, Problem page
- **Task:** Show token balance, spend buttons on locked problems, earn section on dashboard.
- **Ref:** (ToDo L756-773), `claude/DESIGN_STANDARDS.md`

### 6.20 Build Weekly Challenge system
- **File:** New `src/pages/WeeklyChallenge.jsx`
- **Task:** 5 problems released Monday, deadline Sunday. Separate leaderboard. **Source problems from `books/hallknight_hard_exercises.txt`** rotating chapters weekly.
- **Ref:** (ToDo L655-661)

### 6.21 Add spaced repetition review system
- **File:** New `src/lib/spacedRepetitionService.js`
- **Task:** Leitner/SM-2 algorithm using `next_review_date` in `user_unit_mastery`.
- **Ref:** (ToDo L504-506)

### 6.22 Add 20 new achievements (bring total to 50)
- **File:** `src/data/achievements.js`
- **Task:** Topic mastery, perfect units, speed runs, 365-day streak, competition wins, track completions. Rebalance: Legendary ≤ 15%.
- **Ref:** (ToDo L666-693) achievement improvements

### 6.23 Implement problem pagination + server-side filtering
- **Files:** `src/lib/problemService.js`, backend endpoints
- **Task:** Replace `getAllProblems()` with paginated fetch. Add infinite scroll to Learn.jsx.
- **Ref:** (ToDo L950-960)

### 6.24 Build 1v1 Duel mode (scaffold)
- **File:** New `src/pages/Duel.jsx`
- **Task:** Supabase Realtime duel. Best of 5.
- **Ref:** (ToDo L663-667)

### 6.25 Extract Coordinate Geometry problems from books (50 problems in 3 batches)
- **Source:** `backend/EquathoraBackend/books/fts.txt` + `ftsHallKnight.txt`
- **Task:** Search for "coordinate" / "distance" / "midpoint" / "locus" / "equation of line" in OCR text. Extract problems with solutions.
- **Ref:** (ToDo L455-457)

### 6.26 Extract Functions problems from books (40 problems in 2 batches)
- **Source:** `backend/EquathoraBackend/books/ftsHallKnight.txt` (search for "function" / "domain" / "range" / "inverse")
- **Task:** Extract problems dealing with function concepts. Hall & Knight has function material in later chapters.
- **Ref:** (ToDo L458-459)

### 6.27 Extract Calculus-adjacent problems from books (20 problems)
- **Source:** `backend/EquathoraBackend/books/ftsHallKnight.txt` (chapters on Limiting Values, Convergency)
- **Task:** Extract 20 problems on limits, convergency, vanishing fractions — these are pre-calculus. Full calculus track will need a separate source book.
- **Ref:** (ToDo L463-465), `hallknight_hard_exercises.txt` lines 193-241 (Convergency chapter)

### 6.28 Future book sources for missing topics
> **These are public domain books freely available for OCR/extraction.** Add to `books/` folder when ready.
> - **Geometry:** Euclid's "Elements" (public domain), S.L. Loney's "Plane Trigonometry" part on geometry
> - **Trigonometry:** S.L. Loney's "Plane Trigonometry" (1893, public domain) — the definitive companion to Hall & Knight
> - **Calculus:** Silvanus Thompson's "Calculus Made Easy" (1914, public domain) — ideal for Easy/Medium problems
> - **Statistics:** Yule & Kendall's early editions (check public domain status)
> - **Number Theory:** Hardy & Wright "An Introduction to the Theory of Numbers" excerpts
> - **All available at:** Project Gutenberg, Internet Archive, or Google Books (pre-1928 editions)

---

## 📋 Quick Reference — Task Count by Tier

| Tier | Priority | Task Count | Focus |
|------|----------|-----------|-------|
| 🔴 1 | CRITICAL | 7 (3 ✅ done) | Schema fix, exploit fix |
| 🟠 2 | HIGH | 13 | Bug fixes, dead code cleanup |
| 🟡 3 | HIGH | 12 | Schema extensions, new tables |
| 🟢 4 | MEDIUM | 15 | Frontend features, engagement |
| 🔵 5 | MEDIUM-LOW | 9 | Book extraction, validation, indexes |
| ⚪ 6 | LOW | 28 | Monetization, more extractions, advanced features |
| **Total** | | **84** (3 completed) | |

---

## 💡 How to Use This File

1. **Start from Tier 1** — tasks 1.1-1.3 are done. Feed 1.4-1.7 next.
2. **Move to Tier 2** — these are independent fixes, can be done in any order.
3. **Tier 3 must be done in order** — tables depend on each other (3.8 → 3.9 → 3.10 → 3.11).
4. **Tier 5** — read section 5.0 first for book extraction strategy before starting problem seeding.
5. **Tiers 4-6** — pick based on what matters most to you.
6. **Mark tasks done** as you complete them by adding `✅` after `###`.
7. **Always consult `claude/` folder** before making changes (especially `DATABASE_STANDARDS.md` for SQL and `MATH_STANDARDS.md` for LaTeX).
