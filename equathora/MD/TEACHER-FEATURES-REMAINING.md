# Teacher features: remaining work

## Current state

- The application form collects educator details and saves applications to `mentor_applications`.
- The teacher dashboard has Overview, Students, Exercises, and Mistakes log sections.
- Dashboard classes, assignments, students, and sample mistakes are currently browser-local demo data. They are not connected to shared classroom or student activity services.
- The Mistakes log can filter sample entries and mark them reviewed; it does not yet receive students' real mistakes or AI analysis.

## Still needed

1. **Application review:** Admin view to review applicants, set pending/accepted/declined status, and notify applicants of decisions. Only accepted educators should receive teacher access.
2. **Real classroom data:** Persist classes, enrollment/invites, assignments, submissions, and class membership in Supabase with teacher-scoped RLS. Replace the dashboard's sample/localStorage source.
3. **Teacher reporting:** Compute progress and topic analytics from real student attempts; add useful empty, loading, and error states.
4. **Student mistake history:** Store mistakes from actual attempts and let students review their own history.
5. **AI-assisted mistake log:** Have the server analyze repeated incorrect attempts, store the problem/attempt context, misconception category, explanation, and confidence, then associate the result with the student and their class. Let teachers filter, review, and resolve class mistakes; keep student records private with RLS and avoid presenting uncertain AI guesses as facts.
6. **Study plans and notifications:** Generate and track personalized practice plans, assignment reminders, and teacher alerts from real progress.

## Suggested AI mistake flow

Student attempt → validate and save attempt → server-side AI analysis for repeated or meaningful errors → save a structured mistake record → show it in the student's private history and the relevant teacher's class log → teacher reviews or resolves it → optionally share teacher feedback with the student.

Keep AI calls and provider credentials server-side. Add rate limits, retries, retention rules, and a way to correct or dismiss mistaken classifications before relying on them for student decisions.