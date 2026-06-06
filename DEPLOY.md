# Keepath — Deployment Guide

## 🌱 Deploying to Production

This guide walks you through deploying Keepath to Vercel for the investor demo or production use.

### Prerequisites

- [ ] GitHub repository (already set up)
- [ ] Vercel account (free tier is fine)
- [ ] Production PostgreSQL database
- [ ] Google Cloud OAuth credentials
- [ ] Anthropic API key

---

## Step 1: Choose a Database

You need PostgreSQL for production. Pick one:

### Option A: Vercel Postgres (Easiest)
- Go to [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
- Click "Create**
- Select your project (next step)
- Copy the `POSTGRES_PRISMA_URL`

**Pros:** Integrates with Vercel, one-click setup  
**Cons:** Small free tier (5GB)

### Option B: Neon (Generous Free Tier)
- Go to [neon.tech](https://neon.tech)
- Sign up (free)
- Create a project
- Copy the "Connection string" (PostgreSQL)
- Copy as `DATABASE_URL`

**Pros:** 3 projects, 3 GB storage free  
**Cons:** Slightly longer setup

### Option C: Supabase (Free Tier PostgreSQL)
- Go to [supabase.com](https://supabase.com)
- Sign up
- Create a new project
- Copy the "Connection string" > URI
- Replace `[YOUR-PASSWORD]` with your password

**Pros:** Includes auth, storage, realtime (extras we don't need)  
**Cons:** Account deletion after 1 year of inactivity

---

## Step 2: Deploy to Vercel

### A. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up)
2. Click **Add New** > **Project**
3. Click **Import Git Repository**
4. Paste: `https://github.com/ereztash/keepath`
5. Click **Import**

### B. Configure Build Settings

1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `apps/web`
3. **Build Command:** `npm run build` (default)
4. **Install Command:** `npm ci` (default)
5. **Environment Variables:** (next step)

### C. Set Environment Variables

In Vercel project settings, add these variables:

```
DATABASE_URL="postgresql://..."    (from your DB provider)
NEXTAUTH_URL="https://keepath-1a2b3c.vercel.app"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
ANTHROPIC_API_KEY="..."
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### D. Deploy

Click **Deploy**. Vercel will:
1. Build the app (~2 min)
2. Run Playwright E2E tests (~5 min)
3. Deploy to `https://keepath-XXXXX.vercel.app`
4. Show deployment URL when done

---

## Step 3: Run Migrations

Vercel doesn't auto-run migrations. Do this once:

### Option A: Vercel Postgres Storage
```bash
# In Vercel dashboard:
# Settings > Storage > Postgres > Connect
# Then in your local terminal:
npm run db:migrate
```

### Option B: Manual Migration

If using Neon or Supabase, run migrations from your machine:

```bash
export DATABASE_URL="..."  # from your provider
npm install
npm run db:generate
npm run db:migrate
```

Then optionally seed demo data:
```bash
npm run db:seed
```

---

## Step 4: Update Google OAuth

Google OAuth redirect URI must match your deployed domain.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your Keepath project
3. APIs & Services > Credentials > Your OAuth client
4. **Authorized redirect URIs**, add:
   ```
   https://keepath-XXXXX.vercel.app/api/auth/callback/google
   ```
   (Replace `XXXXX` with your Vercel domain)
5. **Save**

---

## Step 5: Verify Deployment

### ✅ Quick Test

1. Visit `https://keepath-XXXXX.vercel.app`
2. Click "Continue with Google"
3. Sign in with a Google account
4. Choose values (onboarding)
5. Set hours
6. View dashboard

### ✅ Full Demo Flow

```
✓ Sign in (Google OAuth)
✓ Onboarding (choose 4 values)
✓ Intentions (set hours per value)
✓ Dashboard (view alignment ring)
✓ Sync Calendar (if Google account has events)
✓ AI Categorize (Claude categorizes)
✓ Calendar view (see categorized events)
✓ Missions (create & complete)
✓ Coach (chat with Jules)
✓ Reflect (Friday check-in)
```

---

## Step 6: Share with Investors

Once deployed:

**URL:** `https://keepath-XXXXX.vercel.app`

**Demo account (if seeded):** `demo@keepath.app` (you can sign in with Google)

**Share:** Send link + password (if using auth) or have them create their own Google account

---

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is copied exactly
- Verify IP whitelist (Neon / Supabase) includes Vercel's IP range
- Neon: Settings > IP Whitelist > Add IP `0.0.0.0/0` (allow all, secure enough for demo)

### "Google OAuth redirect_uri mismatch"
- Ensure Google Console has the exact Vercel domain
- Format: `https://keepath-XXXXX.vercel.app/api/auth/callback/google`
- No trailing slash

### "ANTHROPIC_API_KEY is missing"
- Check Vercel environment variables
- Make sure key is copied from [console.anthropic.com](https://console.anthropic.com)
- Restart deployment after adding

### "Calendar sync not working"
- If using Google OAuth on `localhost`, signed-in account won't work on production URL
- Sign in with a different Google account on production
- That account must have events in Google Calendar to see sync work

### "Slow performance"
- First load might be slow (cold start)
- Subsequent loads cached by Vercel
- If persistently slow, check database query times

---

## Production Checklist

- [ ] Database created and running
- [ ] `DATABASE_URL` in Vercel
- [ ] Migrations run successfully
- [ ] Google OAuth credentials in Vercel
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] `ANTHROPIC_API_KEY` in Vercel
- [ ] Google Console: redirect URI updated
- [ ] Full demo flow tested on production URL
- [ ] Shared URL with stakeholders
- [ ] Database backups enabled (on your DB provider)

---

## Next Steps

After successful deployment:

1. **Monitor:** Check Vercel dashboard for errors
2. **Iterate:** Push changes to `main` branch, Vercel auto-deploys
3. **Scale:** If growth happens, consider:
   - Upgrade database (Neon/Supabase tier)
   - Add caching (Redis)
   - Monitor API usage

---

## Cost Estimate

**For demo/small use:**

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel** | Unlimited | Free* |
| **Neon** | 3 projects, 3GB | Free |
| **Supabase** | 1 project, 1GB | Free |
| **Google** | Free tier | Free |
| **Anthropic** | Pay-as-you-go | ~$0.50/week (demo) |
| **Total** | - | **~$0/month** |

*Vercel charges for high bandwidth/builds, but free for single developer small projects.

---

## Questions?

Refer to:
- [SETUP.md](docs/he/SETUP.md) — Local setup
- [FEATURES.md](docs/he/FEATURES.md) — Feature walkthrough
- [ARCHITECTURE.md](docs/he/ARCHITECTURE.md) — System design
