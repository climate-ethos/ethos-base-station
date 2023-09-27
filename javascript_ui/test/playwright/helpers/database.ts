import { Page } from '@playwright/test';
import axios from 'axios';
import { usernameToDbName } from 'src/helpers/database';

// Database variables
const testingUserId = 999;
const testingUserPassword = '12345';
export const databaseName = usernameToDbName(testingUserId);
const databaseUrl = `http://${testingUserId}:${testingUserPassword}@localhost:5984/${databaseName}`;

interface Doc {
  _id: string;
  _rev: string;
  type: string;
  time: string;
  // anything else the document has
}

/**
 * Function to setup the database, must be called from the settings page in the 'User Data' tab
 * @param page The current playwright page
 * @returns A promise which is resolved once the database acknowledges connection
 */
export async function setupDatabase(page: Page) {
  // Start awaiting for response from server before initiating request
  const dbResponsePromise = page.waitForResponse((response) => {
    const request = response.request();
    return (
      request.method() === 'GET' &&
      request.url().includes(`${databaseName}/_local/`)
    );
  });
  // Set User ID and Password for Database
  await page.getByLabel('User ID').click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.getByLabel('User Password').click();
  await page.locator('div').filter({ hasText: /^123$/ }).click();
  await page.locator('div').filter({ hasText: /^1$/ }).click();
  await page.locator('div').filter({ hasText: /^2$/ }).click();
  await page.locator('div').filter({ hasText: /^3$/ }).click();
  await page.locator('div').filter({ hasText: /^4$/ }).click();
  await page.locator('div').filter({ hasText: /^5$/ }).click();
  // Lose focus on keyboard to submit password
  await page.getByText('User Data').nth(1).click();

  // Return promise that resolves when DB is initialized
  return dbResponsePromise;
}

/**
 * Fetches the recent documents of a specified type from the last minute
 * @param type The type of document to fetch
 * @returns A promise that resolves with an array of documents matching the given type
 */
export async function fetchRecentDocumentsOfType(type: string): Promise<Doc[]> {
  // Calculate times for the last minute
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMinutes(endDate.getMinutes() - 1);

  const query = {
    selector: {
      type: type,
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

/**
 * Deletes a given array of documents from the database.
 * @param documents An array of documents to be deleted
 * @returns A promise that resolves once all the documents are deleted
 */
export async function deleteDocuments(documents: Doc[]): Promise<void> {
  try {
    for (const doc of documents) {
      const deleteURL = `${databaseUrl}/${doc._id}?rev=${doc._rev}`;
      await axios.delete(deleteURL);
    }
  } catch (error) {
    console.error('Failed to delete documents from CouchDB:', error);
  }
}
