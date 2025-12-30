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
│   ├── config/        # Shared configuration
│   ├── database/      # Prisma schema & client
│   ├── shared-ui/     # Shared UI components (shadcn/ui)
│   └── types/         # TypeScript types
└── services/
    └── api/           # Main API (NestJS) - Coming soon
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand, React Query
- **Database**: PostgreSQL + Prisma ORM
- **Monorepo**: Turborepo
- **Charts**: Recharts
- **Icons**: Lucide React

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
- AI Coach (Jules) - Coming soon
- **Features**: Mission types (Quick Win, Weekly Challenge, Milestone, 90-Day Goal)

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
```

5. **Generate Prisma Client**
```bash
npm run db:generate
```

6. **Start development servers**
```bash
npm run dev
```

This will start all 4 apps:
- Finance: http://localhost:3001
- Marketing: http://localhost:3002
- Sales: http://localhost:3003
- Product: http://localhost:3004

## 📝 Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps for production
- `npm run lint` - Lint all apps
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio

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

## 🚧 Roadmap

- [x] Turborepo monorepo setup
- [x] Prisma database schema
- [x] Shared UI component library
- [x] Finance app (Dashboard, Offers, Budget)
- [x] Marketing app (Channels, Analytics)
- [x] Sales app (Pipeline, Leaderboard)
- [x] Product app (Missions, Goal Planner, AI Coach UI)
- [ ] NestJS API service
- [ ] AI integration with OpenAI/Anthropic
- [ ] Cross-app event system
- [ ] Authentication & multi-tenancy
- [ ] Real-time updates with WebSockets
- [ ] Testing suite (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Docker deployment
- [ ] Analytics & monitoring

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
