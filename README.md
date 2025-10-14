# Flexi Pay Connect

## Monorepo structure

```
/ (repo root)
├─ frontend/               # Vite + React app
│  ├─ src/
│  ├─ public/
│  ├─ dist/
│  ├─ vite.config.ts
│  └─ package.json
└─ backend/
   └─ supabase/            # Supabase project (SQL, edge functions)
      ├─ migrations/
      ├─ functions/
      └─ config.toml
```

The frontend app has been moved to `frontend/`. The Supabase backend is in `backend/supabase`.

## Frontend (Vite + React)

- Node.js 18+ recommended
- Commands (run inside `frontend/`):

```sh
cd frontend
npm install
npm run dev
# build
npm run build
# preview built assets
npm run preview
```

Deploy the frontend to any static host (e.g., Netlify, Vercel, Cloudflare Pages, S3 + CloudFront). The production build is emitted to `frontend/dist/`.

## Backend (Supabase)

The backend is a Supabase project containing SQL migrations and Edge Functions.

- Location: `backend/supabase`
- Requirements: Supabase CLI (`npm i -g supabase`)

Typical commands (run from `backend/supabase`):

```sh
# Start local Supabase stack
supabase start

# Link to a remote Supabase project (once)
supabase link --project-ref <your-project-ref>

# Push database schema
supabase db push

# Deploy all functions
supabase functions deploy --project-ref <your-project-ref>
```

Edge Functions live in `backend/supabase/functions/*`. Update any environment variables and secrets in your Supabase project settings.

## Frontend <-> Backend configuration

The frontend uses Supabase via `@supabase/supabase-js` and expects `VITE_` env vars at build time:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Define these in a `.env` file inside `frontend/` for local dev, and in your hosting provider settings for production.

Example `frontend/.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Deployment overview

- Frontend: Build and deploy `frontend/dist/` to your static host. Ensure the `VITE_` env vars are configured in the host.
- Backend: Deploy migrations and edge functions to your Supabase project using the CLI. Configure secrets and any third‑party API keys (e.g., payments) in Supabase.

## Notes

- If you previously referenced files in `supabase/`, update paths to `backend/supabase/`.
- CI/CD users can create separate workflows: one for frontend (`cd frontend && npm ci && npm run build`) and one for backend (`cd backend/supabase && supabase functions deploy && supabase db push`).
