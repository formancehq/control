import { expect, test } from '@playwright/test';
import i18n from '../app/src/translations';
import { getFrontendRoute } from './helpers';

test.describe.parallel('Starter suite', () => {
  test('Overview', async ({ page }) => {
    await page.goto(getFrontendRoute('overview'));
    await expect(await page.locator('h2')).toHaveText(
      i18n.t('pages.overview.emptyState.title')
    );
    await expect(
      await page
        .locator('data-testid=stats-card')
        .locator('.MuiTypography-large')
        .first()
    ).toHaveText('0');
    await page.click('data-testid=get-started');
    await expect(await page.locator('h2')).toHaveText(
      i18n.t('pages.ledgers.emptyState.title')
    );
  });
});
