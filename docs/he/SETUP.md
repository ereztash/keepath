# Keepath — מדריך התקנה

## דרישות מוקדמות

- **Node.js 18+** — [(הורדה)](https://nodejs.org/)
- **npm 10+** — מגיע עם Node.js
- **Docker** (אופציונלי) — [(הורדה)](https://docker.com) — לסביבה מקומית בלבד
- **Git** — [(הורדה)](https://git-scm.com/)
- **חשבון Google** — להגדרת OAuth
- **חשבון Anthropic** — כבר יש לך

---

## שלב 1: הורדה ותקנה

### 1. שכפל את הריפוזיטורי
```bash
git clone https://github.com/ereztash/keepath.git
cd keepath
```

### 2. התקן dependencies
```bash
npm install
```

### 3. צור קבצי .env

**קובץ: `apps/web/.env.local`**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepath?schema=public"

# NextAuth
AUTH_SECRET="$(openssl rand -base64 32)"  # חלק בשורה 5 שלמטה
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth — תמלא אחרי שלב 2
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Anthropic
ANTHROPIC_API_KEY="[מפתח ה-API שלך]"
```

**ליצירת AUTH_SECRET:**
```bash
openssl rand -base64 32
```
העתק את התוצאה ל-`AUTH_SECRET` לעיל.

---

## שלב 2: הגדרת Google OAuth

### A. ניצור Project ב-Google Cloud

1. עבור ל-[console.cloud.google.com](https://console.cloud.google.com)
2. לחץ על "Select a Project" (כחול) → "New Project"
3. שם: `Keepath` → Create
4. חכה 30 שניות להיווצרות

### B. הפעלת APIs

1. בחר את ה-Project שנוצר
2. בשורת החיפוש העליונה, הקלד: `Calendar API` → בחר ב- Google Calendar API → Enable
3. חזור לחיפוש, הקלד: `Google+ API` → Enable

### C. יצור OAuth Client ID

1. צד שמאל → **Credentials** (קריד נשיאלס)
2. כחול בעיתון: **+ Create Credentials** → OAuth 2.0 Client ID
3. אם מבקש "Configure OAuth consent screen":
   - בחר **External** → Create
   - Fill in:
     - App name: `Keepath`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Save and Continue → Save and Continue → Back to Credentials
4. שוב: **+ Create Credentials** → OAuth 2.0 Client ID
5. Application type: **Web application**
6. Name: `localhost`
7. **Authorized redirect URIs** → הוסף שני URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://<your-vercel-domain>.vercel.app/api/auth/callback/google
   ```
   (עדלך לא צריך את השניה עדיין)
8. **Create**
9. העתק את Client ID ו-Client Secret לתיקיה `apps/web/.env.local`

### D. הוסף Scopes

1. צד שמאל → **OAuth consent screen**
2. Scopes → **Add or Remove Scopes**
3. חפש ו-**בחר** את כל אלה:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events.readonly`
4. **Update**

---

## שלב 3: Database

### Option A: Docker (מומלץ לפיתוח)

```bash
npm run docker:up
```

זה יחזיר Postgres על `:5432` ו-Redis על `:6379`.

### Option B: Postgres מקומי

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Windows
# הורדה מ- postgresql.org/download/windows
```

אחרי התקנה:
```bash
creatdb keepath
```

### Option C: Managed (לפיתוח הרחוק)
בשלב הDeploy נחזור לזה.

---

## שלב 4: Migrate Database

```bash
npm run db:generate
npm run db:migrate
```

### (אופציונלי) Seed Demo Data

אם רוצה לראות יומן עם אירועים וקטגוריות כבר:
```bash
npm run db:seed
```

יוצור משתמש `demo@keepath.app` עם:
- 4 values (עמוק קריאה, משפחה, בריאות, למידה)
- 13 calendar events מסווגים
- Weekly intentions

---

## שלב 5: הרצה

```bash
npm run dev
```

תראה:
```
▲ Next.js 14.2.5
  Local:        http://localhost:3000
```

פתח http://localhost:3000 בדפדפן.

---

## בדיקה

### מחזור מלא (Happy Path)

1. **Sign In** → "Continue with Google"
   - בחר חשבון Google
   - הרשה Calendar read access
2. **Onboarding** → בחר 3-4 ערכים (פשוט לחץ "Continue to set hours")
3. **Intentions** → קבע שעות לכל ערך (למשל 20h deep work)
4. **Dashboard** → לחץ "Sync calendar" (ישנה עירועי Google Calendar)
5. **Dashboard** → לחץ "AI categorize" (Claude יסווג אירועים)
6. **Dashboard** → ראה Alignment Score
7. **Calendar** → ראה אירועים כמסווגים לערכים
8. **Coach** → כתוב משהו ודבר עם Jules
9. **Reflect** → מלא רטרוספקטיבה שבועית

---

## Troubleshooting

### "Port 3000 is already in use"
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Cannot find module @keepath/database"
```bash
rm -rf node_modules
npm install
npm run db:generate
```

### Google OAuth "redirect_uri_mismatch"
ודא שה-URI בקובץ .env.local תואם בדיוק לGoogle Console:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain/api/auth/callback/google`

### "database does not exist"
```bash
creatdb keepath
npm run db:migrate
```

---

## הצעדים הבאים

✅ Setup מלא

→ קרא [FEATURES.md](./FEATURES.md) כדי להבין מה עושה כל דף

→ קרא [ARCHITECTURE.md](./ARCHITECTURE.md) כדי להבין את הsystem
