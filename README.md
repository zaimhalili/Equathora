# Equathora

Equathora is a modern mathematics learning platform focused on daily practice, progress tracking, and a polished student experience.

This repository contains:
- A React + Vite frontend (in `equathora/`)
- An ASP.NET Core backend (in `equathora/backend/EquathoraBackend/`)

![Equathora](equathora/src/assets/logo/EquathoraLogoFull.png)

## Product highlights

- Authentication and profiles (Supabase Auth)
- Daily practice problems with structured progress tracking
- Math input via MathLive
- Dashboards, achievements, and leaderboards
- Responsive UI with a component-driven layout

## Architecture

- Frontend: React + Vite + Tailwind CSS
- Backend: ASP.NET Core (.NET 9)
- Data/Auth: Supabase (Auth + Postgres)

The frontend talks to Supabase directly for user/session and core data. A separate ASP.NET backend is included for API-style endpoints and can be used for server-side logic.

## Repository layout

```
.
├─ README.md
└─ equathora/
   ├─ src/                          # Frontend source
   ├─ public/
   ├─ vite.config.js                # Dev server + proxy config
   ├─ package.json
   └─ backend/
      └─ EquathoraBackend/          # ASP.NET Core backend
```

## Getting started (local development)

### Prerequisites

- Node.js 18+ (recommended)
- .NET SDK 9.0+ (for the backend)

### 1) Frontend

From the repo root:

```bash
cd equathora
npm install
```

Create `equathora/.env.local`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

Run the dev server:

```bash
npm run dev
```

### 2) Backend (optional)

From the repo root:

```bash
cd equathora/backend/EquathoraBackend
dotnet restore
dotnet run
```

The backend is configured to run on `http://localhost:5104` by default. The Vite dev server proxies `/api` and `/mathproblem` to that backend (see `equathora/vite.config.js`).

## Configuration

### Supabase

Frontend configuration is read from:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

For authentication behavior and production setup guidance (SMTP, redirect URLs, templates), see `equathora/AUTH_SETUP.md`.

### Backend settings

Backend settings live under `equathora/backend/EquathoraBackend/appsettings*.json`.

For production, avoid committing secrets and prefer environment variables or .NET user-secrets for:
- Database connection strings
- JWT signing keys

## Common operations

### Frontend scripts

```bash
cd equathora
npm run dev
npm run build
npm run preview
npm run lint
```

### Resetting user progress data (Supabase)

If you need to reset user problem-solving state (duplicates, incorrect stats), follow:

- `equathora/backend/EquathoraBackend/RESET_INSTRUCTIONS.md`

## Deployment

- Frontend: build with `npm run build` and deploy the `equathora/dist/` output (Vercel is supported; see `equathora/vercel.json`).
- Backend: deploy as a standard ASP.NET Core app (Azure App Service, container, or any .NET host). Ensure CORS, connection strings, and JWT configuration are set via environment variables.

## Support & troubleshooting

- If the app fails on startup with “Missing Supabase environment variables”, ensure `equathora/.env.local` is present and restart the dev server.
- Auth setup and email verification behavior: see `equathora/AUTH_SETUP.md`.

## License

No license file is currently included in this repository. If you intend to open-source the project, add a license file at the repo root.
