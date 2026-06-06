# Keepath

**Stay on the path that matters to you.**

Keepath connects to your Google Calendar, asks what you actually want to invest your time in, and uses AI to show you whether your week matched your intentions. It is a calm, honest mirror — not a productivity hype tool.

## How it works

1. **Sign in with Google** — read-only access to your calendar
2. **Define your values** — Family, Deep Work, Health, whatever matters
3. **Set weekly intentions** — how many hours per value this week
4. **AI categorizes** your calendar events against your values (Claude Sonnet 4.6)
5. **See your alignment score** — planned vs actual, per value
6. **Talk to Jules**, your time alignment coach, when you want to dig in
7. **Friday reflection** — what worked, what got in the way

## Stack

- **Next.js 14** (App Router) — single deployable, Vercel-native
- **NextAuth v5** with Google provider + Calendar scopes
- **Prisma** + **PostgreSQL**
- **Anthropic Claude Sonnet 4.6** for AI categorization + Jules coach (streaming)
- **Tailwind CSS** for UI
- **Turborepo** monorepo

## Architecture

```
keepath/
├── apps/
│   └── web/              # Next.js app (frontend + API routes)
├── packages/
│   ├── database/         # Prisma schema + client
│   ├── shared-ui/        # Reusable UI primitives
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared config
└── docker-compose.yml    # Postgres + Redis for local dev
```

All backend logic lives in Next.js API routes inside `apps/web/src/app/api/`. No separate API service — deploys cleanly to Vercel.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start local Postgres
```bash
docker-compose up -d
```

### 3. Set env vars
```bash
cp apps/web/.env.example apps/web/.env.local
cp packages/database/.env.example packages/database/.env
```

Fill in:
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console (enable Calendar API, add `calendar.readonly` scope)
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `AUTH_SECRET` — run `openssl rand -base64 32`

### 4. Migrate the database
```bash
npm run db:generate
npm run db:migrate
```

### 5. (Optional) Seed demo data
```bash
npm run db:seed
```

### 6. Run the app
```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on Vercel, set root to `apps/web`
3. Set environment variables (same as `.env.local`)
4. Use a managed Postgres (Neon / Supabase / Vercel Postgres) for `DATABASE_URL`
5. Update Google OAuth authorized redirect URI to `https://<your-domain>/api/auth/callback/google`

## License

MIT
