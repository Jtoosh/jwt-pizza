import {Role, User} from "./src/service/pizzaService";
import { Page, } from "@playwright/test";
import { test, expect } from 'playwright-test-coverage';

export function randomEmail(){
    return `user${Math.floor(Math.random() * 10000)}@jwt.com`;
}

export async function basicInit(page: Page, user?: User) {
    let loggedInUser: User | undefined;
    const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] } };

    // Authorize login for the given user
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = route.request().postDataJSON();
        const user = validUsers[loginReq.email];
        if (!user || user.password !== loginReq.password) {
            await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
            return;
        }
        loggedInUser = validUsers[loginReq.email];
        const loginRes = {
            user: loggedInUser,
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({ json: loginRes });
    });

    // Return the currently logged in user
    await page.route('*/**/api/user/me', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: loggedInUser });
    });

    // A standard menu
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
            {
                id: 1,
                title: 'Veggie',
                image: 'pizza1.png',
                price: 0.0038,
                description: 'A garden of delight',
            },
            {
                id: 2,
                title: 'Pepperoni',
                image: 'pizza2.png',
                price: 0.0042,
                description: 'Spicy treat',
            },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });

    // Standard franchises and stores
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        const franchiseRes = {
            franchises: [
                {
                    id: 2,
                    name: 'LotaPizza',
                    stores: [
                        { id: 4, name: 'Lehi' },
                        { id: 5, name: 'Springville' },
                        { id: 6, name: 'American Fork' },
                    ],
                },
                { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
                { id: 4, name: 'topSpot', stores: [] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    // Order a pizza.
    await page.route('*/**/api/order', async (route) => {
        const orderReq = route.request().postDataJSON();
        const orderRes = {
            order: { ...orderReq, id: 23 },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: orderRes });
    });

    await page.goto('/');
}

export async function adminInit(page:Page){
    await page.goto('/');

    // Standard franchises and stores
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        const franchiseRes = {
            franchises: [
                {
                    id: 2,
                    name: 'LotaPizza',
                    stores: [
                        { id: 4, name: 'Lehi' },
                        { id: 5, name: 'Springville' },
                        { id: 6, name: 'American Fork' },
                    ],
                },
                { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
                { id: 4, name: 'topSpot', stores: [] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    // Filtered user list
    await page.route('https://pizza-service.cs329.click/api/user?page=0&limit=10&name=test1', async (route) => {
        const userRes = {
            users: [
                { id: 1, name: 'test1', email: randomEmail(), roles: ['user'] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: userRes });
    });

    // Standard user list
    await page.route(/\/api\/user\?page=0&limit=10&name=\*$/, async (route) => {
        const userRes = {
            users: [
                { id: 1, name: 'test1', email: randomEmail(), roles: ['user'] },
                { id: 2, name: 'test2', email: randomEmail(), roles: ['user'] },
                { id: 3, name: 'adminTest', email: randomEmail(), roles: ['admin'] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: userRes });
    });

    // Mock delete user endpoint
    await page.route(/\/api\/user\/\d+$/, async (route) => {
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ status: 200 });
    });

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
}

export async function updateUserInit(page:Page, email:string){
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Register' }).click();

    return email;
};

export async function logoutLogin(page:Page, email:string, password:string){
    await page.getByRole('link', { name: 'Logout' }).click();
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
};
