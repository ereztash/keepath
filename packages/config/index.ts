export const config = {
  // App URLs
  apps: {
    finance: process.env.NEXT_PUBLIC_FINANCE_URL || 'http://localhost:3001',
    marketing: process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3002',
    sales: process.env.NEXT_PUBLIC_SALES_URL || 'http://localhost:3003',
    product: process.env.NEXT_PUBLIC_PRODUCT_URL || 'http://localhost:3004',
  },

  // API
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/keepath',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // AI
  ai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  },
};

export default config;
