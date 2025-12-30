# Keepath Setup Guide

Complete setup instructions for the Keepath monorepo.

## Quick Start (5 minutes)

### Option 1: Using Docker (Recommended)

1. **Start the database**
```bash
docker-compose up -d
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp packages/database/.env.example packages/database/.env
```

4. **Run migrations**
```bash
npm run db:migrate
npm run db:generate
```

5. **Start all apps**
```bash
npm run dev
```

Visit:
- Finance: http://localhost:3001
- Marketing: http://localhost:3002
- Sales: http://localhost:3003
- Product: http://localhost:3004

### Option 2: Local PostgreSQL

1. **Install PostgreSQL** (if not installed)
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

2. **Create database**
```bash
createdb keepath
```

3. **Follow steps 2-5 from Option 1**

## Detailed Setup

### Environment Variables

Each app can have its own `.env.local` file, but the main database configuration is in `packages/database/.env`:

```bash
# packages/database/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepath?schema=public"
```

For production, update with your production database URL.

### Database Management

**Run migrations:**
```bash
npm run db:migrate
```

**Generate Prisma Client:**
```bash
npm run db:generate
```

**Open Prisma Studio (Database GUI):**
```bash
npm run db:studio
```

**Create a new migration:**
```bash
cd packages/database
npx prisma migrate dev --name your_migration_name
```

### Development Workflow

**Start all apps:**
```bash
npm run dev
```

**Start specific app:**
```bash
cd apps/finance && npm run dev
```

**Build for production:**
```bash
npm run build
```

**Lint all apps:**
```bash
npm run lint
```

**Format code:**
```bash
npm run format
```

## Troubleshooting

### Port already in use

If you get "Port already in use" errors:

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in package.json
# apps/finance/package.json: "dev": "next dev -p 3005"
```

### Database connection errors

1. Verify PostgreSQL is running:
```bash
# Docker
docker ps | grep postgres

# Local
psql -U postgres -l
```

2. Check DATABASE_URL in `packages/database/.env`

3. Reset database (WARNING: deletes all data):
```bash
cd packages/database
npx prisma migrate reset
```

### Prisma Client errors

Regenerate the Prisma Client:
```bash
npm run db:generate
```

### Module not found errors

Clear cache and reinstall:
```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

## Seeding Test Data (Optional)

To add test data, create a seed script:

```bash
# packages/database/seed.ts
import { prisma } from './index';

async function main() {
  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Company',
      settings: {},
    },
  });

  // Create user
  await prisma.user.create({
    data: {
      email: 'demo@keepath.com',
      name: 'Demo User',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  // Add more seed data...
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
cd packages/database
npx tsx seed.ts
```

## Production Deployment

### Build all apps
```bash
npm run build
```

### Deploy to Vercel (recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy each app
cd apps/finance && vercel
cd apps/marketing && vercel
cd apps/sales && vercel
cd apps/product && vercel
```

### Environment Variables for Production
Set these in your hosting platform:

- `DATABASE_URL` - Production PostgreSQL URL
- `OPENAI_API_KEY` - For AI features
- `REDIS_URL` - For caching (optional)

## Next Steps

1. ✅ Setup complete - apps are running
2. 📝 Explore each app's features
3. 🗄️ Add test data via Prisma Studio
4. 🎨 Customize UI components in `packages/shared-ui`
5. 🚀 Build new features
6. 🧪 Add tests
7. 📊 Setup analytics
8. 🤖 Integrate AI features

## Getting Help

- Check the main README.md
- Review Prisma schema in `packages/database/prisma/schema.prisma`
- Explore shared components in `packages/shared-ui`
- Open an issue on GitHub

Happy coding! 🎉
