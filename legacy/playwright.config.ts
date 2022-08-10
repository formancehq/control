import { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  retries: process.env.PLAYWRIGHT_TEST_RETRIES || 2,
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    storageState: 'playwright.state.json',
  },
} as PlaywrightTestConfig;
export default config;
