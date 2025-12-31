# Keepath - Modular Business Management System

A comprehensive modular monorepo with 4 specialized business applications: Finance, Marketing, Sales, and Product.

## 🏗️ Architecture

```
keepath/
├── apps/
│   ├── finance/       # Financial management (port 3001)
│   ├── marketing/     # Marketing channels & analytics (port 3002)
│   ├── sales/         # Sales pipeline & tracking (port 3003)
│   └── product/       # Missions, goals & AI coach (port 3004)
├── packages/
│   ├── api-client/    # API client & services
│   ├── config/        # Shared configuration
│   ├── database/      # Prisma schema & client
│   ├── shared-ui/     # Shared UI components (shadcn/ui)
│   └── types/         # TypeScript types
└── services/
    ├── api/           # NestJS REST API (port 4000)
    └── ai-engine/     # AI/LLM integration service (port 4001)
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: NestJS, Express
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query
- **Database**: PostgreSQL + Prisma ORM
- **Monorepo**: Turborepo
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions

## 📦 Applications

### 1. Finance App (Port 3001)
- Dashboard with revenue, profit, expenses, runway
- Offers management with profit calculations
- Budget tracker by category
- **Features**: Real-time profit margin calculations, expense tracking

### 2. Marketing App (Port 3002)
- Channels dashboard with CPL and conversion metrics
- Marketing funnel visualization
- Channel performance analytics
- **Features**: Auto-calculated conversion rates and CPL

### 3. Sales App (Port 3003)
- Sales dashboard with key metrics
- Pipeline management
- Team leaderboard
- **Features**: Win rate tracking, deal size analytics

### 4. Product App (Port 3004)
- Gamified missions system with XP rewards
- Weekly goal planner with 5-tab workflow
- AI Coach (Jules) - Powered by Claude/GPT-4
- **Features**: Mission types (Quick Win, Weekly Challenge, Milestone, 90-Day Goal)

## 🔌 Services

### API Service (Port 4000)
- **NestJS REST API** with full CRUD operations
- **Swagger Documentation** at `/api`
- **Modules**: Finance, Marketing, Sales, Missions, Team
- **Features**: Rate limiting, validation, error handling

### AI Engine (Port 4001)
- **Jules AI Coach** - Context-aware business advisor
- **Mission Suggestions** - AI-generated tasks based on data
- **Metrics Analysis** - Intelligent insights
- **Streaming Chat** - Real-time AI responses

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd keepath
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Database**

Create a PostgreSQL database:
```bash
createdb keepath
```

Copy the environment file:
```bash
cp packages/database/.env.example packages/database/.env
```

Update `packages/database/.env` with your database URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepath?schema=public"
```

4. **Run Prisma migrations**
```bash
npm run db:migrate
npm run db:generate
```

5. **Seed database with demo data**
```bash
npm run db:seed
```

6. **Start all services**

Start frontend apps:
```bash
npm run dev:apps
```

Start API (in separate terminal):
```bash
npm run dev:api
```

Start AI Engine (in separate terminal, optional):
```bash
npm run dev:ai
```

**OR** start everything at once:
```bash
npm run dev
```

This will start:
- Finance: http://localhost:3001
- Marketing: http://localhost:3002
- Sales: http://localhost:3003
- Product: http://localhost:3004
- API: http://localhost:4000 (Swagger: http://localhost:4000/api)
- AI Engine: http://localhost:4001

## 📝 Available Scripts

**Development:**
- `npm run dev` - Start all apps in development mode
- `npm run dev:apps` - Start only frontend apps
- `npm run dev:api` - Start API service
- `npm run dev:ai` - Start AI engine

**Build & Test:**
- `npm run build` - Build all apps for production
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint all apps
- `npm run format` - Format code with Prettier

**Database:**
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with demo data
- `npm run db:reset` - Reset database (WARNING: deletes all data)
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:push` - Push schema changes without migrations

**Docker:**
- `npm run docker:up` - Start PostgreSQL & Redis containers
- `npm run docker:down` - Stop containers

**Utilities:**
- `npm run clean` - Clean all node_modules and build outputs

## 🗄️ Database Schema

The system uses a multi-tenant architecture with the following models:

- **User** - User accounts with role-based access
- **Organization** - Multi-tenant support
- **Mission** - Gamified tasks with XP rewards
- **Offer** - Products/services with profit calculations
- **TeamMember** - Team members with KPI tracking
- **MarketingChannel** - Marketing channels with metrics
- **Sale** - Sales records with status tracking
- **Process** - Business processes
- **WeeklyCheckIn** - Weekly reflections and goals

## 🎨 UI Components

The shared UI library includes:

- **StatCard** - Metric cards with trend indicators
- **StatusBadge** - Status badges with variants
- **EmptyState** - Empty state placeholders
- **Button, Card** - Base shadcn/ui components
- **Utility functions** - Currency, number, percentage formatters

## 🔐 Environment Variables

Create a `.env.local` file in each app directory for app-specific variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepath"

# API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# AI (for Product app)
OPENAI_API_KEY="your-key-here"
ANTHROPIC_API_KEY="your-key-here"
```

## ✅ What's Included

- [x] **Turborepo monorepo** setup
- [x] **Prisma database schema** with 8 models
- [x] **Shared UI component library** with shadcn/ui
- [x] **4 Next.js apps**: Finance, Marketing, Sales, Product
- [x] **NestJS REST API** with Swagger docs
- [x] **AI Engine** with OpenAI/Anthropic integration
- [x] **Jules AI Coach** - Context-aware business advisor
- [x] **API Client package** with services for all endpoints
- [x] **Event Bus** for cross-app communication
- [x] **Aggregation service** with caching
- [x] **Testing infrastructure** (Jest + Supertest)
- [x] **CI/CD pipeline** (GitHub Actions)
- [x] **Database seed script** with demo data
- [x] **Docker Compose** for local development
- [x] **Comprehensive documentation**

## 🚧 Future Enhancements

- [ ] Authentication & authorization (NextAuth.js)
- [ ] Multi-tenancy & user management
- [ ] Real-time updates with WebSockets
- [ ] E2E testing with Playwright
- [ ] Performance monitoring & analytics
- [ ] Advanced AI features (document analysis, forecasting)
- [ ] Mobile apps (React Native)
- [ ] Third-party integrations (Stripe, Slack, etc.)

## 🤝 Contributing

This is a modular system designed for easy extension. Each app is independent but shares common packages.

To add a new app:
1. Create a new Next.js app in `apps/`
2. Add it to the workspace in root `package.json`
3. Import shared packages as needed

## 📄 License

MIT

## 🆘 Support

For questions or issues, please open a GitHub issue.

---

Built with ❤️ using modern web technologies
