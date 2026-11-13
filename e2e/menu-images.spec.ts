import { expect, test } from '@playwright/test';

const thumbSelector = 'button[aria-label^="View larger photo of"]';

test.describe('Menu dish photos', () => {
  test('renders 16 lazy thumbnails with alt and intrinsic size', async ({ page }) => {
    await page.goto('/menu/');
    const buttons = page.locator(thumbSelector);
    await expect(buttons).toHaveCount(16);

    const imgs = buttons.locator('img');
    for (let i = 0; i < 16; i++) {
      const img = imgs.nth(i);
      await expect(img).toHaveAttribute('alt', /.+/);
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
      await expect(img).toHaveAttribute('loading', 'lazy');
    }
  });

  test('lightbox opens, loads the full image and restores focus on Escape', async ({ page }) => {
    await page.goto('/menu/');
    const thumb = page.getByRole('button', { name: 'View larger photo of Butter Chicken' });
    const dialog = page.getByRole('dialog', { name: 'Butter Chicken' });

    // The island hydrates with client:idle; a click before hydration does nothing.
    await expect(async () => {
      await thumb.scrollIntoViewIfNeeded();
      await thumb.click();
      await expect(dialog).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 15_000 });

    const full = dialog.locator('img');
    await expect(full).toBeVisible();
    await expect
      .poll(() => full.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(thumb).toBeFocused();
  });

  test.describe('narrow viewport', () => {
    test.use({ viewport: { width: 360, height: 740 } });

    test('has no horizontal overflow', async ({ page }) => {
      await page.goto('/menu/');
      await expect(page.locator(thumbSelector)).toHaveCount(16);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
});
