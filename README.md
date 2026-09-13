# Jhulki Haute Couture Apparel

Bespoke luxury clothing website built with **Angular 21** frontend and **Next.js 15 API** backend powered by **Supabase PostgreSQL** & **Prisma ORM**.

---

## 🚀 Quick Vercel Deployment Instructions

### 1. Deploy Next.js Backend API
1. Push repository to GitHub or run Vercel CLI (`vercel` inside `nextjs-backend`).
2. In Vercel Project Settings -> **Root Directory**, set to `nextjs-backend`.
3. Copy `nextjs-backend/.env.example` to `nextjs-backend/.env` and fill in your own values (see below), then add the same **Environment Variables** in the Vercel Project Settings:
   - `DATABASE_URL`: your Supabase connection pooler string. Find it in the Supabase dashboard under **Project Settings > Database > Connection pooling** — use the pooler host on port `6543` with `pgbouncer=true`.
   - `JWT_SECRET`: a long, random secret used to sign auth tokens (e.g. generate one with `openssl rand -base64 48`). Never reuse an example or previously-committed value.

   Note: `DIRECT_URL` is intentionally not used by this project — all database access goes through the connection pooler.
4. Deploy! Your API URL will be `https://your-backend.vercel.app`.

---

### 2. Deploy Angular Frontend UI
1. In Vercel Project Settings -> **Root Directory**, set to `frontend`.
2. Build Settings (auto-detected via `vercel.json`):
   - Build Command: `npm run build`
   - Output Directory: `dist/frontend/browser`
3. Add **Environment Variable**:
   - `API_URL`: the deployed backend base URL including `/api` (e.g. `https://your-backend.vercel.app/api`).

   Angular compiles to a static bundle, so this cannot be read by the browser at runtime.
   The `prebuild` hook runs `scripts/set-env.js`, which writes
   `src/environments/environment.ts` from `API_URL` before `ng build`. If `API_URL` is unset
   the script falls back to a default so the build still succeeds — check the build log for
   `[set-env]` to see which value was used. Changing the backend URL means editing the
   Vercel variable and redeploying, not editing source.
4. Deploy! Your UI URL will be `https://your-frontend.vercel.app`.

---

## 🔑 Accounts

No demo accounts are provisioned. Create your own users via the app's sign-up flow (or `prisma/seed.ts`) against your own database.
