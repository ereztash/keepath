import { test, expect } from '@playwright/test';

test.describe('Investor Demo Flow', () => {
  test('complete weekly alignment workflow', async ({ page }) => {
    // ======== STEP 1: Sign In ========
    test.step('navigate to sign in', async () => {
      await page.goto('/signin');
      await expect(page.locator('text=Continue with Google')).toBeVisible();
    });

    // Note: In real E2E we'd need to mock/test Google OAuth
    // For now, this test documents the flow structure
    // In CI, use NextAuth testing utils or mock authentication

    test.step('should redirect to onboarding if no values', async () => {
      // Assuming signed in
      await page.goto('/');
      // Either redirect to /dashboard or /onboarding depending on values
      const url = page.url();
      const isOnboarding = url.includes('onboarding');
      const isDashboard = url.includes('dashboard');
      expect(isOnboarding || isDashboard).toBeTruthy();
    });

    // ======== STEP 2: Onboarding ========
    test.step('select values in onboarding', async () => {
      await page.goto('/onboarding');

      // Select suggested values
      const deepWorkBtn = page.locator('button:has-text("Deep Work")');
      const familyBtn = page.locator('button:has-text("Family")');
      const healthBtn = page.locator('button:has-text("Health")');
      const learningBtn = page.locator('button:has-text("Learning")');

      await deepWorkBtn.click();
      await expect(deepWorkBtn).toHaveClass(/border-indigo-500/);

      await familyBtn.click();
      await expect(familyBtn).toHaveClass(/border-indigo-500/);

      await healthBtn.click();
      await expect(healthBtn).toHaveClass(/border-indigo-500/);

      await learningBtn.click();
      await expect(learningBtn).toHaveClass(/border-indigo-500/);

      // Save
      const saveBtn = page.locator('button:has-text("Continue to set hours")');
      await expect(saveBtn).toBeEnabled();
      await saveBtn.click();
    });

    // ======== STEP 3: Set Intentions ========
    test.step('set weekly intentions', async () => {
      await expect(page).toHaveURL(/\/intentions/);

      // Set hours for each value
      const deepWorkInput = page.locator('input[value="5"]').first(); // assumes 5 is default
      await deepWorkInput.clear();
      await deepWorkInput.fill('20');

      const familyInput = page.locator('input').nth(1);
      await familyInput.clear();
      await familyInput.fill('15');

      const healthInput = page.locator('input').nth(2);
      await healthInput.clear();
      await healthInput.fill('5');

      const learningInput = page.locator('input').nth(3);
      await learningInput.clear();
      await learningInput.fill('4');

      // Save
      const saveBtn = page.locator('button:has-text("Save & go to dashboard")');
      await saveBtn.click();
    });

    // ======== STEP 4: Dashboard ========
    test.step('view dashboard with alignment ring', async () => {
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator('text=This week')).toBeVisible();

      // Alignment ring should be visible
      const ring = page.locator('svg').first();
      await expect(ring).toBeVisible();
    });

    test.step('sync calendar', async () => {
      const syncBtn = page.locator('button:has-text("Sync calendar")');
      await expect(syncBtn).toBeVisible();

      // Note: Real test would mock the Google Calendar API
      // or use a test Google account with pre-populated events

      // This test documents the button exists and is clickable
      await expect(syncBtn).toBeEnabled();
    });

    test.step('categorize events with AI', async () => {
      const aiBtn = page.locator('button:has-text("AI categorize")');
      await expect(aiBtn).toBeVisible();
      await expect(aiBtn).toBeEnabled();

      // Note: Real test would mock Anthropic API responses
    });

    // ======== STEP 5: Calendar View ========
    test.step('view calendar with categorized events', async () => {
      const navLink = page.locator('a:has-text("Calendar")');
      await navLink.click();
      await expect(page).toHaveURL(/\/calendar/);
      await expect(page.locator('text=Your week')).toBeVisible();
    });

    // ======== STEP 6: Missions ========
    test.step('create and complete a mission', async () => {
      const navLink = page.locator('a:has-text("Missions")');
      await navLink.click();
      await expect(page).toHaveURL(/\/missions/);

      const input = page.locator('input[placeholder*="next mission"]');
      await input.fill('Write blog post on time tracking');
      const addBtn = page.locator('button:has-text("Add")');
      await addBtn.click();

      await expect(page.locator('text=Write blog post on time tracking')).toBeVisible();

      // Mark complete
      const circle = page.locator('button[title*=""]').first();
      await circle.click();
      await expect(page.locator('text="+25 XP"')).toBeVisible();
    });

    // ======== STEP 7: Coach ========
    test.step('chat with Jules coach', async () => {
      const navLink = page.locator('a:has-text("Coach")');
      await navLink.click();
      await expect(page).toHaveURL(/\/coach/);

      // Initial Jules message visible
      await expect(page.locator('text=I\'m Jules')).toBeVisible();

      // Send message
      const input = page.locator('input[placeholder*="Tell Jules"]');
      await input.fill('Why did I miss my deep work hours?');
      const sendBtn = page.locator('button:has-text("Send") svg').first();
      await sendBtn.click();

      // User message appears
      await expect(page.locator('text=Why did I miss my deep work hours?')).toBeVisible();

      // Note: Real test would mock streaming response
    });

    // ======== STEP 8: Reflect ========
    test.step('complete weekly reflection', async () => {
      const navLink = page.locator('a:has-text("Reflect")');
      await navLink.click();
      await expect(page).toHaveURL(/\/reflect/);

      // Set mood
      const moodSlider = page.locator('input[type="range"]').first();
      await moodSlider.fill('7');

      // Add wins
      const winsInput = page.locator('input[placeholder*="proud"]');
      await winsInput.fill('Completed deep work sessions');
      const addWinBtn = page.locator('button:has-text("Add")').first();
      await addWinBtn.click();

      // Add blockers
      const blockersInput = page.locator('input[placeholder*="got in the way"]');
      await blockersInput.fill('Too many meetings');
      const addBlockerBtn = page.locator('button:has-text("Add")').nth(1);
      await addBlockerBtn.click();

      // Save
      const saveBtn = page.locator('button:has-text("Save reflection")');
      await saveBtn.click();

      // Verify save notification
      await expect(page.locator('text=Reflection saved')).toBeVisible();
    });

    // ======== Final Check ========
    test.step('complete flow summary', async () => {
      // Navigate back to dashboard
      const dashLink = page.locator('a:has-text("Dashboard")');
      await dashLink.click();
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify alignment ring is visible
      const ring = page.locator('svg').first();
      await expect(ring).toBeVisible();

      console.log('✅ Demo flow complete!');
    });
  });
});
