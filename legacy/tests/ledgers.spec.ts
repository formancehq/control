import { expect, test } from '@playwright/test';
import { getFrontendRoute, LEDGER_SLUG } from './helpers';

const pageUrl = getFrontendRoute(`ledgers/${LEDGER_SLUG}`);

test.describe.parallel('Ledgers suite', () => {
  test('Page', async ({ page }) => {
    await page.goto(pageUrl);
    const overviewTitle = await page.locator('h1');
    await expect(overviewTitle).toHaveText('Ledgers');
  });

  test('Change ledger', async ({ page }) => {
    await page.goto(pageUrl);
    await page.click('data-testid=ledger-select');
    await page.click('data-testid=item-loop-b2bf3a5d');
    await page.isVisible('data-testid=loop-b2bf3a5d');
  });

  test('Search for world account', async ({ page }) => {
    await page.goto(pageUrl);
    await page.fill('input[name="search"]', 'world');
    await page.click('data-testid=search-suggestion-more-account');
    await page.locator('#ledger-accounts tbody tr').first().waitFor();
    expect(await page.locator('#ledger-accounts tbody tr').count()).toEqual(1);
  });

  test('Search for world transaction', async ({ page }) => {
    await page.goto(pageUrl);
    await page.fill('input[name="search"]', 'world');
    await page.click('data-testid=search-suggestion-more-transaction');
    await page.locator('#ledger-transactions tbody tr').first().waitFor();
    expect(
      await page.locator('#ledger-transactions tbody tr').count()
    ).toBeGreaterThan(1);
  });

  test('Search for world payment', async ({ page }) => {
    await page.goto(pageUrl);
    await page.fill('input[name="search"]', 'world');
    await page.click('data-testid=search-suggestion-more-payment');
    await page.locator('#payments-payIn tbody tr').first().waitFor();
    expect(
      await page.locator('#payments-payIn tbody tr').count()
    ).toBeGreaterThan(10);
  });

  test('Account: Visit details', async ({ page }) => {
    await page.goto(`${pageUrl}/accounts/world`);
    await expect(
      await page.locator('data-testid=balances').locator('h2')
    ).toHaveText('Balances');
    await expect(
      await page.locator('data-testid=volumes').locator('h2')
    ).toHaveText('Volumes');
    await expect(
      await page.locator('data-testid=transactions').locator('h2')
    ).toHaveText('Transactions');
    await expect(
      await page.locator('data-testid=metadata').locator('h2')
    ).toHaveText('Metadata');
  });

  test('Transaction: Visit details', async ({ page }) => {
    await page.goto(`${pageUrl}/transactions/2741`);
    await expect(
      await page.locator('data-testid=metadata').locator('h2')
    ).toHaveText('Metadata');
    await expect(
      await page.locator('data-testid=postings').locator('h2')
    ).toHaveText('Postings');
    await expect(
      await page.locator('data-testid=graph').locator('h2')
    ).toHaveText('Graph');
  });
});
