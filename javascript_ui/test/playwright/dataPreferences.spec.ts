import { test, expect } from '@playwright/test';
import axios from 'axios';
import { usernameToDbName } from 'src/helpers/database';

const baseUrl = 'http://127.0.0.1:9000';
const settingsUrl = baseUrl + '/#/settings';

const databaseName = usernameToDbName(
  process.env.USER_ID ? process.env.USER_ID : ''
);
const databaseUrl = `http://${process.env.USER_ID}:${process.env.USER_PASSWORD}@localhost:5984/${databaseName}`;

interface Doc {
  _id: string;
  _rev: string;
  type: string;
  time: string;
  // anything else the document has
}

async function fetchRecentPreferences(): Promise<Doc[]> {
  // Calculate times for the last minute
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMinutes(endDate.getMinutes() - 1);

  const query = {
    selector: {
      type: 'preferences',
      time: {
        $gte: startDate.toISOString(),
        $lt: endDate.toISOString(),
      },
    },
  };

  try {
    const response = await axios.post(`${databaseUrl}/_find`, query);
    return response.data.docs;
  } catch (error) {
    console.error('Failed to fetch recent preferences from CouchDB:', error);
    return [];
  }
}

async function deleteDocuments(documents: Doc[]): Promise<void> {
  try {
    for (const doc of documents) {
      const deleteURL = `${databaseUrl}/${doc._id}?rev=${doc._rev}`;
      await axios.delete(deleteURL);
    }
  } catch (error) {
    console.error('Failed to delete documents from CouchDB:', error);
  }
}

test.describe('settings', () => {
  test.beforeEach(async ({ page }) => {
    // Give time for database to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to settings page
    await page.goto(settingsUrl);

    // Type in passcode and click submit
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: 'submit' }).click();
  });

  test('should be on settings page', async ({ page }) => {
    await expect(page).toHaveURL(settingsUrl);
  });

  test('should set user preferences and save to CouchDB', async ({ page }) => {
    // Select preferences tab
    await page.getByText('assignmentPreferences').click();

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

    await page.screenshot({
      path: 'test/playwright/screenshots/dataPreferences-1-setting.png',
    });

    // Go back home which will trigger settings saving
    await page.getByRole('link', { name: 'go back to home' }).click();

    // Give time for data to post to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.screenshot({
      path: 'test/playwright/screenshots/dataPreferences-2-saving.png',
    });

    // Check data appears on CouchDB
    const recentPreferenceDocs = await fetchRecentPreferences();
    expect(recentPreferenceDocs).toHaveLength(1);

    // Delete the recently created documents
    deleteDocuments(recentPreferenceDocs);
    // Give time for data to post to database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Database should now be reset
    expect(await fetchRecentPreferences()).toHaveLength(0);
  });
});
