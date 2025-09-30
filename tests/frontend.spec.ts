import { test, expect } from 'playwright-test-coverage';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/JWT Pizza/);
});


test('login', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
  const loginReq = { email: 'd@jwt.com', password: 'a' };
  const loginRes = {
    user: {
      id: 3,
      name: 'Kai Chen',
      email: 'd@jwt.com',
      roles: [{ role: 'diner' }],
    },
    token: 'abcdef',
  };
  expect(route.request().method()).toBe('PUT');
  expect(route.request().postDataJSON()).toMatchObject(loginReq);
  await route.fulfill({ json: loginRes });
});

  await page.goto('http://localhost:5173/');
  
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
});