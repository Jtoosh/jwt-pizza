import { test, expect } from 'playwright-test-coverage';
import { updateUserInit, randomEmail, logoutLogin } from '../testUtils';

test('updateUser', async ({ page }) => {
    const email = randomEmail();
    await updateUserInit(page, email);

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('textbox').first().fill('pizza dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');

    await logoutLogin(page, email, 'diner');

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('update email', async ({ page }) => {
    const email = randomEmail();
    await updateUserInit(page, email);

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');
    
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.locator('input[type="email"]').click();
    
    const newEmail = randomEmail();
    await page.locator('input[type="email"]').fill(newEmail); 
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });
    
    await expect(page.getByRole('main')).toContainText(newEmail);

    await logoutLogin(page, newEmail, 'diner');

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText(newEmail);
});

test('update password', async ({ page }) => {
    const email = randomEmail();
    await updateUserInit(page, email);

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.locator('#password').click();
    await page.locator('#password').fill('dinerx');
    await page.getByRole('button', { name: 'Update' }).click();
    
    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner');
    
    await logoutLogin(page, email, 'dinerx');

    await page.getByRole('link', { name: 'pd' }).click();
    
    await expect(page.getByRole('main')).toContainText('pizza diner');
    await expect(page.getByRole('main')).toContainText(email);
});
