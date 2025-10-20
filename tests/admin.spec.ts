import { Page, } from "@playwright/test";
import { test, expect } from 'playwright-test-coverage';

import {Role, User} from "../src/service/pizzaService";
import {adminInit} from "../testUtils";

test('admin dash', async ({ page }) => {
  await adminInit(page);

  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('admin-dashboard')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('textbox', { name: 'franchise name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'franchise name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'franchisee admin email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

});

test('close franchise', async ({ page }) => {
    await adminInit(page);

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('admin-dashboard')).toBeVisible();

    await page.getByRole('row', { name: 'LotaPizza Close' }).getByRole('button').click();
    await expect(page.getByText('Sorry to see you go')).toBeVisible();
})

test('close store', async ({ page }) => {
   await adminInit(page);

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('admin-dashboard')).toBeVisible();

   
    await page.getByRole('row', { name: 'Lehi ₿ Close' }).getByRole('button').click(); 
    await expect(page.getByRole('link', { name: 'close-store' })).toBeVisible();
})

test('list users', async ({ page }) => {
    await adminInit(page);
    
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('admin-dashboard')).toBeVisible();

    await expect(page.getByText('Users')).toBeVisible();

    await expect(page.getByText('test1')).toBeVisible();
});