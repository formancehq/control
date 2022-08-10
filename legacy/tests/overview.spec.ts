import { expect, test } from '@playwright/test';
import i18n from '../src/translations';
import { getFrontendRoute } from './helpers';

test.describe.parallel('Overview suite', () => {
  test('Page', async ({ page }) => {
    await page.goto(getFrontendRoute('overview'));
    const title = page.locator('h1');
    await expect(title).toHaveText(i18n.t('pages.overview.title'));
    const subTitle = page.locator('h2');
    await expect(subTitle).toHaveText(i18n.t('pages.overview.subtitle'));
    expect(
      await page.locator('data-testid=overview-sections').locator('a').count()
    ).toEqual(6);
  });
});
