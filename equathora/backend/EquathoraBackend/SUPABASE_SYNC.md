# Supabase ↔ Backend Sync

This document explains how to wire Supabase (Auth + Postgres) to your backend so users and their stats are stored in your backend Postgres DB.

## 1) Configure connection string
Set `ConnectionStrings:DefaultConnection` in `appsettings.json` (or env var `ConnectionStrings__DefaultConnection`) to point to your Supabase Postgres database. Example:

```
Host=<your-supabase-host>;Port=5432;Database=postgres;Username=postgres;Password=<your-password>;SSL Mode=Require;Trust Server Certificate=true
```

You can place the value in environment variables in production.

## 2) Add migrations and update DB
From the `EquathoraBackend` project folder run:

```bash
dotnet tool install --global dotnet-ef # if not installed
dotnet ef migrations add AddUserStats
dotnet ef database update
```

This will create the `UserStats` table and any pending changes.

## 3) Sync users from Supabase
There are two options:

A) Frontend calls backend after signup/login
- After a successful signUp / signIn with Supabase, call the backend sync endpoint to upsert the user into the backend DB.

Example (JS):

```js
import { supabase } from './supabaseClient';

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const user = session.user;
    await fetch('https://your-backend.example.com/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username ?? null,
        provider: user.app_metadata?.provider ?? null,
        providerId: user.id,
        isEmailVerified: user.email_confirmed_at != null
      })
    });
  }
});
```

B) Supabase Edge Function / Webhook
- Create an Edge Function in Supabase that posts to `https://your-backend.example.com/api/users/sync` when an auth event occurs.

## 4) Recording attempts / solves
Call the backend endpoint to sync attempts (from frontend or server-side) after the user completes a problem:

```
POST /api/users/{userId}/attempts/sync
{
  "ProblemId": "<problem-guid>",
  "UserAnswer": "...",
  "TimeSpentSeconds": 42
}
```

The backend will store a new Attempt and update the `UserStats` aggregates (ProblemsSolved, Attempts, CorrectAttempts, Streaks, Reputation).

## 5) Fetching stats
GET `/api/users/{userId}/stats` returns the `UserStats` object for that user.

## 6) Security
These endpoints currently accept requests without a token. For production, secure them by:
- Requiring a backend JWT (issue via your auth server) or
- Validating Supabase JWTs in the backend, or
- Adding an HMAC/shared-secret header and validating it server-side.


If you want, I can add JWT validation for Supabase tokens (verify the JWT using Supabase JWT public keys) or require a simple shared-secret header — tell me which you'd prefer and I will implement it.
