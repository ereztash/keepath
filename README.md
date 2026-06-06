# 🧭 Keepath

**Stay on the path that actually matters to you.**

> A personal time alignment coach that reads your Google Calendar, learns what you say matters most, and shows you if you're actually investing your time there. No productivity hype. Just honest mirrors.

---

## 🎯 The Idea

1. **Connect Google Calendar** — read-only access
2. **Define your values** — what actually matters (Family, Deep Work, Health, etc.)
3. **Set weekly intentions** — how many hours you intend to invest in each
4. **See your alignment** — calendar events auto-categorized by AI, compared against intentions
5. **Talk to Jules** — an honest AI coach who notices the gaps
6. **Reflect weekly** — capture wins, blockers, learnings

**The result:** A weekly alignment score (0-100) that answers: "Did I actually spend time on what I said matters?"

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes (same deployment) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth v5 + Google OAuth |
| **AI** | Anthropic Claude Sonnet 4.6 |
| **State** | React Query + Zustand |
| **Monorepo** | Turborepo + npm workspaces |
| **Deploy** | Vercel (single click) |

---

## 🚀 Quick Start

### 1. Local Setup (5 minutes)

```bash
git clone https://github.com/ereztash/keepath.git
cd keepath
npm install

# Start Postgres (Docker) or use local database
npm run docker:up

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed  # Optional: demo data

# Run dev server
npm run dev
```

**Visit:** `http://localhost:3000`

### 2. Configure Credentials

Create `apps/web/.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepath?schema=public"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ANTHROPIC_API_KEY=""
```

👉 See [docs/he/SETUP.md](docs/he/SETUP.md) for detailed Google OAuth setup.

### 3. Test the Flow

```
✓ Sign in → Onboarding → Intentions → Dashboard → Sync → AI Categorize → Result
```

👉 See [docs/he/FEATURES.md](docs/he/FEATURES.md) for feature walkthrough.

---

## 📦 Project Structure

```
keepath/
├── apps/web/                    # Single Next.js app
│   ├── src/app/                 # Pages + API routes
│   │   ├── (app)/               # Protected routes
│   │   │   ├── dashboard/       # Alignment score
│   │   │   ├── intentions/      # Weekly planning
│   │   │   ├── calendar/        # Event view
│   │   │   ├── missions/        # Todo list
│   │   │   ├── coach/           # Jules AI chat
│   │   │   └── reflect/         # Friday check-in
│   │   ├── api/                 # REST endpoints
│   │   ├── signin/              # Google OAuth
│   │   └── onboarding/          # Value selection
│   ├── src/lib/                 # Business logic
│   │   ├── auth.ts              # NextAuth config
│   │   ├── google-calendar.ts   # Calendar sync
│   │   ├── categorize.ts        # Claude AI
│   │   └── alignment.ts         # Score calculation
│   └── e2e/                     # Playwright tests
│
├── packages/
│   ├── database/                # Prisma ORM
│   │   └── prisma/schema.prisma # 9 models
│   ├── types/                   # TypeScript interfaces
│   ├── shared-ui/               # Reusable components
│   └── config/                  # Shared config
│
├── docs/he/                     # Hebrew documentation
│   ├── SETUP.md                 # Install & config
│   ├── FEATURES.md              # Feature guide
│   └── ARCHITECTURE.md          # Technical deep-dive
│
├── DEPLOY.md                    # Production guide
└── README.md                    # This file
```

👉 See [docs/he/ARCHITECTURE.md](docs/he/ARCHITECTURE.md) for detailed tech breakdown.

---

## 📊 Project Status

### ✅ Complete (MVP Ready)

- [x] **Auth:** NextAuth + Google OAuth with Calendar scopes
- [x] **Database:** Prisma schema with 9 models (User, Value, CalendarEvent, etc.)
- [x] **Frontend:** 6 full-featured pages + responsive UI
- [x] **API:** 15+ REST endpoints
- [x] **AI:** Claude integration for event categorization + Jules coach
- [x] **Build:** Next.js production build passes
- [x] **Tests:** Playwright E2E framework (demo flow spec)
- [x] **CI/CD:** GitHub Actions with build + test pipeline
- [x] **Docs:** Hebrew setup, features, architecture guides

### ⏳ Blocked by You

- [ ] **Google OAuth:** Needs your Google Cloud credentials (free tier ok)
- [ ] **Database:** Needs production DB (Neon/Vercel/Supabase free tier)
- [ ] **Anthropic:** Needs your API key (you said you have this)
- [ ] **Deployment:** Ready for Vercel (you have account?)

### 🚀 Next Steps

1. **Setup credentials** → Google OAuth + env vars
2. **Deploy to Vercel** → See [DEPLOY.md](DEPLOY.md)
3. **Test investor demo** → Full happy path
4. **Iterate** → Gather feedback, push to main → auto-deploys

---

## 🛣️ Roadmap

### Demo Ready (This Week?)
- [ ] ✅ Google OAuth working
- [ ] ✅ Database migrated
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Full flow tested

### Production Ready (Next Month?)
- [ ] Multi-user test (10-20 people)
- [ ] Mobile responsiveness verified
- [ ] Error handling robustness
- [ ] Performance monitoring
- [ ] Analytics (see if users actually use it)

### Long-term Ideas
- [ ] Multi-user sharing (see others' alignment)
- [ ] Slack integration (weekly digest)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (trends over time)
- [ ] Recurring missions (weekly automation)

---

## 📖 Documentation

**For you (in Hebrew):**
- 🇮🇱 [SETUP.md](docs/he/SETUP.md) — Step-by-step installation
- 🇮🇱 [FEATURES.md](docs/he/FEATURES.md) — What each page does
- 🇮🇱 [ARCHITECTURE.md](docs/he/ARCHITECTURE.md) — How it works under the hood

**For deployment:**
- 📦 [DEPLOY.md](DEPLOY.md) — Production guide (Vercel, databases, env vars)

**In English (main README):**
- 📄 This file (overview + tech stack)

---

## 🔐 Security & Privacy

- **Auth:** NextAuth handles JWTs, Google OAuth is industry-standard
- **Data:** Only your email + calendar event titles stored
- **API:** All endpoints require authentication
- **AI:** Claude never sees your email, only event titles + value names
- **Database:** Credentials in `.env` (never committed)

---

## 🧪 Testing

### E2E Tests
```bash
cd apps/web
npm run test:e2e          # Run headless
npm run test:e2e:headed   # Visual mode
npm run test:e2e:ui       # Interactive UI
```

### Local Development
```bash
npm run dev          # Start dev server
npm run lint         # Check code
npm run format       # Format code
npm run db:studio    # Visual database browser
```

---

## 💬 The Pitch (For Investors)

**Problem:** People say "family matters" but spend 0 hours with family. They say "deep work" but context-switch all day. No tool shows this gap.

**Solution:** Keepath connects to your calendar, asks what matters, and shows you—weekly—if you're lying to yourself.

**Why now:** 
- Gen-Z & millennial guilt about time management (post-remote-work chaos)
- AI makes real-time categorization possible (no manual logging)
- Google Calendar is ubiquitous (network effect)

**Why we'll win:**
- Not another productivity app (we're anti-productivity)
- Honest (no motivation, just mirrors)
- Data-driven (calendar is truth)
- Habit-forming (weekly score gamification)

**Use case:** Manager at tech company realizes they're managing instead of coding → aligns time → gets 4h/week back for deep work.

---

## 📧 Support

**Questions?**
- Check [docs/he/SETUP.md](docs/he/SETUP.md) for installation
- Check [docs/he/FEATURES.md](docs/he/FEATURES.md) for feature questions
- Check [docs/he/ARCHITECTURE.md](docs/he/ARCHITECTURE.md) for technical questions

**Found a bug?**
- Open an issue on GitHub
- Run `npm run test:e2e` to verify

---

## 📄 License

MIT — Build on it, learn from it, improve it.

---

**Built with ❤️ by Erez**

*"The best time to plant a tree was 20 years ago. The second best time is this week."*
