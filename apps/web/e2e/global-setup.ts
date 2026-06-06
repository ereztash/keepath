import { execSync } from 'child_process';

async function globalSetup() {
  // Reset database to clean state
  console.log('\n[E2E] Resetting database...');
  try {
    execSync('npm run db:reset -- --skip-generate', { stdio: 'inherit' });
    execSync('npm run db:generate', { stdio: 'inherit' });
    console.log('[E2E] Database reset complete');
  } catch (err) {
    console.error('[E2E] Database reset failed');
    // Don't fail setup, tests might still work with existing DB
  }
}

export default globalSetup;
