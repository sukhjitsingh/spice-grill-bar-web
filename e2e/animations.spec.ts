import { expect, test } from '@playwright/test';

test.describe('Sheet (mobile nav) animation', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport — Sheet only visible on mobile

  test('opens and closes with animation', async ({ page }) => {
    await page.goto('/');

    // The hamburger menu trigger is inside the mobile nav section of Header.tsx
    // Button has a Menu icon and sr-only "Open menu" text
    const trigger = page.getByRole('button', { name: /open menu/i });
    await trigger.click();

    // SheetContent uses Radix Dialog — data-state transitions from closed -> open
    const sheetContent = page.locator('[role="dialog"]');
    await expect(sheetContent).toBeVisible({ timeout: 5000 });
    await expect(sheetContent).toHaveAttribute('data-state', 'open');

    // Close the sheet — SheetClose renders as the only button inside the dialog
    // (Radix does not add a data-radix-dialog-close attribute in this version)
    const closeButton = sheetContent.locator('button').first();
    await expect(closeButton).toBeVisible({ timeout: 5000 });
    await closeButton.click();
    await expect(sheetContent).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Theme toggle', () => {
  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /toggle theme/i });

    // Initial state: light mode (dark class should not be present)
    const initiallyDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(initiallyDark).toBe(false);

    // Click to switch to dark mode
    await toggle.click();
    const isDarkAfterFirstClick = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkAfterFirstClick).toBe(true);

    // Click again to switch back to light mode
    await toggle.click();
    const isDarkAfterSecondClick = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkAfterSecondClick).toBe(false);
  });
});

test.describe('MobileActionButtons animation', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // Mobile viewport

  test('is visible on mobile with animation classes', async ({ page }) => {
    await page.goto('/');
    // Wait for page to fully load and animation to complete
    await page.waitForTimeout(1000);

    // MobileActionButtons uses static animation classes:
    // animate-in slide-in-from-bottom-4 duration-700 fade-in
    // It is a fixed-position element at the bottom of the viewport
    const bar = page.locator('.animate-in.slide-in-from-bottom-4');
    await expect(bar).toBeVisible({ timeout: 5000 });

    // Verify the element has the expected animation classes
    await expect(bar).toHaveClass(/animate-in/);
    await expect(bar).toHaveClass(/slide-in-from-bottom-4/);
    await expect(bar).toHaveClass(/fade-in/);
  });
});
