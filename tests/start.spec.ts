import { test } from '@playwright/test';
import { getFrontendRoute } from './helpers';

test.describe.parallel('Starter suite', () => {
  test('Overview', async ({ page }) => {
    await page.goto(getFrontendRoute('overview'));
    // TODO write some test here once empty state are done
  });
});
