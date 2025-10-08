import { Page, } from "@playwright/test";
import { test, expect } from 'playwright-test-coverage';

import {Role, User} from "../src/service/pizzaService";
import {basicInit} from "../testUtils";

test('franchise dash', async ({ page }) => {
    await basicInit(page);
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('So you want a piece of the pie?')).toBeVisible();

});

// test('franchisee login', async ({page}) => {
//
// });