import { Page } from '@playwright/test';

export const takeScreenshot = (page: Page, name: string) => {
  return page.screenshot({
    path: `test/playwright/screenshots/${name}`,
  });
};
