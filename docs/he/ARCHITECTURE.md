# Keepath — ארכיטקטורה וDISTRIBUTIONION

## ברוק

**Keepath** היא אפליקציית ווב חד-עמודית מודרנית לניהול זמן אישי.

### טכנולוגיות ליבה

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14, React 18, TypeScript | Vercel-native, fast, modern |
| **Backend** | Next.js API Routes | No separate server needed |
| **Database** | PostgreSQL + Prisma ORM | Reliable, type-safe queries |
| **Auth** | NextAuth v5 + Google OAuth | Simple, secure, no password management |
| **AI** | Anthropic Claude Sonnet 4.6 | Fast, smart categorization |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, component-ready |
| **State** | React Query + Zustand | Smart caching + simple state |
| **Monorepo** | Turborepo + npm workspaces | Shared code, easy deployment |

---

## מבנה הקבצים

```
keepath/
├── apps/
│   └── web/              # Single Next.js app (frontend + API)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (app)/        # Protected routes
│       │   │   │   ├── dashboard/page.tsx
│       │   │   │   ├── intentions/page.tsx
│       │   │   │   ├── calendar/page.tsx
│       │   │   │   ├── missions/page.tsx
│       │   │   │   ├── coach/page.tsx
│       │   │   │   └── reflect/page.tsx
│       │   │   ├── api/          # REST endpoints
│       │   │   │   ├── auth/     # NextAuth
│       │   │   │   ├── values/
│       │   │   │   ├── intentions/
│       │   │   │   ├── calendar/
│       │   │   │   ├── missions/
│       │   │   │   ├── coach/
│       │   │   │   └── checkin/
│       │   │   ├── page.tsx      # Root redirect
│       │   │   ├── signin/page.tsx
│       │   │   ├── onboarding/page.tsx
│       │   │   ├── layout.tsx
│       │   │   ├── providers.tsx # Providers: SessionProvider, QueryClient
│       │   │   └── globals.css
│       │   ├── lib/
│       │   │   ├── auth.ts       # NextAuth config + Google OAuth
│       │   │   ├── google-calendar.ts  # Sync calendar events
│       │   │   ├── categorize.ts # Claude categorizes events
│       │   │   ├── alignment.ts  # Compute alignment score
│       │   │   ├── dates.ts      # Week utilities
│       │   │   └── anthropic.ts  # Claude client
│       │   ├── components/
│       │   │   ├── nav.tsx       # Sidebar navigation
│       │   │   └── alignment-ring.tsx  # SVG ring visualization
│       │   ├── types/
│       │   │   └── next-auth.d.ts # Type augmentation
│       │   └── middleware.ts # NextAuth middleware
│       └── .env.example
│
├── packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma  # 9 models + enums
│   │   ├── index.ts           # Prisma Client singleton
│   │   ├── seed.ts            # Demo data
│   │   └── package.json
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   ├── shared-ui/
│   │   ├── components/
│   │   │   └── [shadcn components + custom]
│   │   ├── lib/
│   │   │   └── utils.ts       # formatCurrency, formatNumber, cn()
│   │   └── index.tsx
│   └── config/
│       └── index.ts           # Config object
│
├── docs/
│   └── he/
│       ├── SETUP.md
│       ├── FEATURES.md
│       └── ARCHITECTURE.md    # This file
│
├── .github/
│   └── workflows/
│       └── ci.yml             # Build + type check
│
├── docker-compose.yml         # PostgreSQL + Redis
├── package.json               # Root workspace
├── tsconfig.json
├── turbo.json
└── README.md
```

---

## Data Models (Prisma)

### User (מזוהה)
```prisma
model User {
  id              String
  email           String @unique
  name            String?
  emailVerified   DateTime?
  image           String?
  
  // Relations
  values          Value[]              # life values
  intentions      WeeklyIntention[]    # plans
  events          CalendarEvent[]      # synced from Google
  missions        Mission[]            # todos
  checkIns        WeeklyCheckIn[]      # Friday reflections
  conversations   Conversation[]       # chats with Jules
  googleConnection GoogleConnection?   # OAuth token
}
```

### Value (ערך חיים)
```prisma
model Value {
  id          String
  name        String          # "Deep Work", "Family", etc.
  color       String          # "#6366f1"
  icon        String          # "Brain", "Heart", etc.
  isActive    Boolean
  
  // Relations
  intentions     WeeklyIntention[]         # hours per week
  categorizations EventCategorization[]    # events assigned
}
```

### WeeklyIntention (תכנון שבועי)
```prisma
model WeeklyIntention {
  id          String
  weekStart   DateTime        # Monday of the week
  targetHours Float           # "20 hours this week"
  notes       String?
  
  // Relations
  user        User
  value       Value
}
```

### CalendarEvent (אירוע מיומן)
```prisma
model CalendarEvent {
  id              String
  googleEventId   String      # From Google Calendar API
  title           String      # "Team standup"
  startTime       DateTime
  endTime         DateTime
  durationMinutes Int
  
  // Relations
  categorizations EventCategorization[]   # assigned to values
}
```

### EventCategorization (הקצאה לערך)
```prisma
model EventCategorization {
  id          String
  confidence  Float  @default(1.0)  # 0.9 = AI, 1.0 = manual
  reasoning   String?               # "Team standup → Deep Work"
  isManual    Boolean @default(false)
  
  // Relations
  event       CalendarEvent
  value       Value
}
```

### AlignmentScore (ציון השתלבות)
```prisma
model AlignmentScore {
  id              String
  weekStart       DateTime
  overallScore    Float              # 0-100
  breakdown       Json               # array of per-value scores
  totalActualHours Float
  totalTargetHours Float
  computedAt      DateTime
}
```

### Mission (משימה)
```prisma
model Mission {
  id          String
  title       String
  status      MissionStatus   # PENDING | IN_PROGRESS | COMPLETED | CANCELLED
  xpReward    Int
  priority    Priority        # LOW | MEDIUM | HIGH | URGENT
  dueDate     DateTime?
  completedAt DateTime?
}
```

### WeeklyCheckIn (רטרוספקטיבה)
```prisma
model WeeklyCheckIn {
  id          String
  weekStart   DateTime
  mood        Int             # 1-10
  wins        Json            # array of strings
  blockers    Json
  learnings   Json
  reflection  String?         # free-form text
}
```

### Conversation & Message (שיחה עם Jules)
```prisma
model Conversation {
  id       String
  title    String?           # first user message
  messages Message[]
}

model Message {
  id              String
  conversationId  String
  role            String      # "user" | "assistant"
  content         String      # message text
  createdAt       DateTime
}
```

### GoogleConnection (Token)
```prisma
model GoogleConnection {
  userId       String      @unique
  accessToken  String      # for API calls
  refreshToken String      # to renew token
  expiresAt    DateTime
  scope        String      # what permissions user granted
  lastSyncedAt DateTime?   # when calendar last synced
}
```

---

## API Routes (REST Endpoints)

### Authentication
- `POST /api/auth/callback/google` — NextAuth OAuth callback
- `GET /api/auth/session` — Get current session

### Values
- `GET /api/values` — List user's values
- `POST /api/values` — Create new value
- `PATCH /api/values/[id]` — Update value
- `DELETE /api/values/[id]` — Deactivate value

### Intentions
- `GET /api/intentions?week=2024-01-01` — Get week's intentions
- `POST /api/intentions` — Create/update intention

### Calendar
- `POST /api/calendar/sync` — Sync events from Google
- `POST /api/calendar/categorize` — Claude categorizes uncategorized
- `GET /api/calendar/events?week=...` — List week's events
- `PATCH /api/calendar/events/[id]` — Reassign event to different value

### Missions
- `GET /api/missions` — List missions
- `POST /api/missions` — Create mission
- `PATCH /api/missions/[id]` — Update (status, title, etc.)
- `DELETE /api/missions/[id]` — Delete mission

### Jules Coach
- `POST /api/coach` — Stream chat response (Server-Sent Events)

### Check-in
- `GET /api/checkin?week=...` — Get Friday reflection
- `POST /api/checkin` — Save/update reflection

### Alignment
- `GET /api/alignment?week=...` — Compute alignment score

---

## Authentication Flow

```
1. User visits http://localhost:3000
   ↓
2. Middleware checks auth (src/middleware.ts)
   ↓
3. NOT AUTHENTICATED → Redirect to /signin
   ↓
4. User clicks "Continue with Google"
   ↓
5. NextAuth redirects to Google OAuth
   ↓
6. User authorizes + grants Calendar scopes
   ↓
7. Google redirects back to /api/auth/callback/google
   ↓
8. NextAuth saves:
      - User (email, name)
      - Session (JWT cookie)
      - GoogleConnection (tokens for API)
   ↓
9. Redirect to / (redirects to /dashboard or /onboarding)
```

---

## Calendar Sync Flow

```
1. User clicks "Sync calendar" on dashboard
   ↓
2. POST /api/calendar/sync
   ↓
3. Fetch GoogleConnection tokens
   ↓
4. Call googleapis.calendar.events.list()
   ↓
5. For each event:
   - Check if already in DB (by googleEventId)
   - Insert new or update existing
   ↓
6. Update lastSyncedAt timestamp
   ↓
7. Return count of synced events
   ↓
8. Frontend shows "Synced X events"
```

---

## AI Categorization Flow

```
1. User clicks "AI categorize" on dashboard
   ↓
2. POST /api/calendar/categorize
   ↓
3. Fetch uncategorized events + user's values
   ↓
4. For each event, call Claude Sonnet 4.6:
   
   Prompt:
   "User values: Family (❤️), Deep Work (🧠), Health (💪)
    Event: Team standup, 30min, 10am Monday
    Which value does this serve? Respond with JSON:
    {valueId, confidence 0-1, reasoning}"
   
   ↓
5. Parse Claude response
   ↓
6. Create EventCategorization record
   ↓
7. Return count categorized
```

---

## Alignment Score Calculation

```
For each value:
  targetHours = user's intention
  actualHours = sum of event durations
  score = min(actualHours / targetHours, 1.0) * 100
  
  Example:
    Value: "Deep Work"
    Intended: 20h
    Actual: 18h
    Score: (18/20) * 100 = 90%

Overall alignment:
  average of all value scores
  
  Example with 4 values:
    Deep Work: 90%
    Family: 80%
    Health: 40%
    Learning: 0%
    Overall: (90+80+40+0)/4 = 52.5% → 52/100
```

---

## Deployment (Vercel)

### What Vercel does
- Watches GitHub branch `main`
- On push: runs CI (build, type-check)
- On success: deploys to `keepath.vercel.app`
- Stores secrets (GOOGLE_CLIENT_ID, etc.) in env vars

### Steps
1. Push to main
2. Vercel builds `apps/web`
3. Runs migrations on Vercel Postgres
4. App live at `keepath.vercel.app`

### Production checklist
- [ ] DATABASE_URL points to production DB (Neon, Supabase, etc.)
- [ ] GOOGLE_CLIENT_SECRET in Vercel env
- [ ] ANTHROPIC_API_KEY in Vercel env
- [ ] AUTH_SECRET (32 random chars) in Vercel env
- [ ] Google Console: OAuth redirect URI updated
- [ ] Test full flow on production URL

---

## Performance & Caching

### Frontend
- React Query: 30s staleTime for data
- Next.js: automatic code splitting
- Tailwind: production build minified
- Images: optimized with next/image (none currently used)

### Backend
- Database queries: indexed on frequently-used fields
  - CalendarEvent: startTime, userId
  - Value: userId
  - WeeklyIntention: userId + weekStart
- No explicit caching layer (Redis available if needed)

### AI
- Claude calls: ~500ms per event (serial, not parallel)
- Streaming: partial responses shown in real-time
- No caching of AI responses (always fresh)

---

## Security Considerations

### Auth
- NextAuth handles JWT signing (AUTH_SECRET)
- Google OAuth tokens stored encrypted in DB
- Middleware enforces auth on all routes except /signin

### API
- All endpoints check session user
- Queries filter by userId (user can't access others' data)
- No public endpoints

### AI
- Claude never sees user email or full names
- Only calendar event titles + user-defined value names sent
- No multi-tenant concerns (single user per session)

### Database
- Credentials in .env files (never committed)
- Backups on managed provider (Vercel Postgres, Neon, etc.)
- No PII beyond email

---

## Future Improvements

- [ ] Multi-user sharing (let another person see your alignment)
- [ ] Recurring tasks (weekly missions)
- [ ] Mobile app (React Native)
- [ ] Slack integration (get weekly digest)
- [ ] Calendar notifications ("you're off track")
- [ ] Advanced charts (Recharts is ready, not used)
- [ ] Dark mode (Tailwind config supports it)
- [ ] Internationalization (i18n for Hebrew/English)
- [ ] Analytics (see trends over time)

---

## Questions?

Refer back to [SETUP.md](./SETUP.md) or [FEATURES.md](./FEATURES.md).
