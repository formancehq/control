import { chromium, FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import { getFrontendRoute, LEDGER_SLUG } from './tests/helpers';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(getFrontendRoute(''));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const customStorageState = { ...storageState };
  customStorageState.origins = [
    {
      origin: baseURL,
      localStorage: [{ name: 'currentLedger', value: LEDGER_SLUG }],
    },
  ];
  await fs.writeFile(
    'playwright.state.json',
    JSON.stringify(customStorageState)
  );

  await browser.close();
}

export default globalSetup;
