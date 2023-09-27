import { test, expect } from '@playwright/test';
import {
  databaseName,
  fetchRecentDocumentsOfType,
  deleteDocuments,
  setupDatabase,
} from 'test/playwright/helpers/database';
import { takeScreenshot } from 'test/playwright/helpers/screenshot';

const baseUrl = 'http://127.0.0.1:9000';
const settingsUrl = baseUrl + '/#/settings';

test.describe('settings', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to settings page
    await page.goto(settingsUrl);

    // Type in passcode and click submit
    const settingsPasscode = process.env.SETTINGS_PASSCODE || '';
    for (const digit of settingsPasscode) {
      await page.getByRole('button', { name: digit }).click();
    }
    await page.getByRole('button', { name: 'submit' }).click();

    // Setup the database
    await setupDatabase(page);

    await takeScreenshot(page, 'dataPreferences-0.png');
  });

  test('should be on settings page', async ({ page }) => {
    await expect(page).toHaveURL(settingsUrl);
  });

  test('should be connected to database', async ({ page }) => {
    await page.getByText('Debug Info').click();
    const couchDbStatusDiv = await page
      .locator('div.debug-section')
      .filter({ hasText: 'Replication Status' });
    await expect(couchDbStatusDiv).toContainText('paused');
  });

  test('should set user preferences and save to CouchDB', async ({ page }) => {
    // Select preferences tab
    await page.getByText('Preferences').click();

    // Select text to speech alerts radio
    const ttsRadio = page
      .getByRole('cell', { name: 'Text to speech alerts' })
      .getByRole('radio');
    await ttsRadio.click();
    expect(await ttsRadio.isChecked()).toBe(true);

    // Select that don't have access to air conditioning
    const tableCell = page
      .locator('tr:has-text("Air conditioning")')
      .getByRole('cell')
      .nth(1);
    await tableCell.click();
    const labelText = await tableCell.textContent();
    expect(labelText).toBe('No');

    // Select that follow up should be done (button to click is next sibling from label)
    const toggleFocusGroup = page
      .locator(
        'div:has-text("Would you be interested in a follow up with a focus group discussion?") + div'
      )
      .nth(0);
    await toggleFocusGroup.click();
    expect(await toggleFocusGroup.textContent()).toBe('Yes');

    await takeScreenshot(page, 'dataPreferences-1.png');

    // Start awaiting for response from server before initiating request
    const dbResponsePromise = page.waitForResponse((response) => {
      const request = response.request();
      return (
        request.method() === 'PUT' &&
        request.url().includes(`${databaseName}/_local/`)
      );
    });
    // Navigate home which will trigger posting to database
    await page.getByRole('link', { name: 'go back to home' }).click();
    // Await for the response from the server
    await dbResponsePromise;

    await takeScreenshot(page, 'dataPreferences-2.png');

    // Check data appears on CouchDB
    const recentPreferenceDocs = await fetchRecentDocumentsOfType(
      'preferences'
    );
    expect(recentPreferenceDocs).toHaveLength(1);

    // Delete the recently created documents
    await deleteDocuments(recentPreferenceDocs);

    // Database should now be reset
    expect(await fetchRecentDocumentsOfType('preferences')).toHaveLength(0);
  });
});
