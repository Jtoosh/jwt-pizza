import {Role, User} from "../src/service/pizzaService";
import { Page, } from "@playwright/test";
import { test, expect } from 'playwright-test-coverage';

import {basicInit} from "../testUtils";

test('login', async ({ page }) => {
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
    await basicInit(page);

    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();

    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();

    // Check balance

    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByText('invalid', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
    
    await expect(page.getByText('0.008')).toBeVisible();
});

test('register', async ({ page }) => {
    await page.goto('/');
    
    await page.route('*/**/api/user', async (route) => {
        const registerReq = route.request().postDataJSON();
        const registerRes = {
            user: { id: '99', name: registerReq.name, email: registerReq.email, roles: [{ role: Role.Diner }] },
            token: 'ghijkl',
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: registerRes });
    });

    
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('testReg');
    await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Email address' }).fill('testReg@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('testReg');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 't', exact: true }).click();
    await expect(page.getByText('testReg', {exact: true})).toBeVisible(); 
    await expect(page.getByText('testReg@jwt.com')).toBeVisible();
    await expect(page.getByText('diner', {exact : true})).toBeVisible();
});

    // test('logout', async ({ page }) => {
    //     await page.goto('/');
    //
    //     await page.route('*/**/api/user', async (route) => {
    //         const loginReq = route.request().postDataJSON();
    //         const user = { id: '99', name: loginReq.name, email: loginReq.email, roles: [{ role: Role.Diner }] };
    //         expect(route.request().method()).toBe('PUT');
    //         await route.fulfill({ json: { user, token: 'ghijkl' } });
    //     });
    //
    //     await page.getByRole('link', { name: 'Login' }).click();
    //     await page.getByPlaceholder('Email address').click();
    //     await page.getByPlaceholder('Email address').fill('d@jwt.com');
    //     await page.getByPlaceholder('Email address').press('Tab');
    //     await page.getByPlaceholder('Password').fill('a');
    //     await page.getByRole('button', { name: 'Login' }).click();
    //
    //     await page.getByRole('link', { name: 'home' }).click();
    //     await page.getByRole('link', { name: 'Logout' }).click();
    // });

test('about', async ({ page }) => {
    await basicInit(page);

    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByText('The secret sauce')).toBeVisible();
});

test('history', async ({ page }) => {
    await basicInit(page);

    
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
});