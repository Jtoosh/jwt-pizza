import { Page } from "@playwright/test";
import { test, expect } from "playwright-test-coverage";

import { Role, User } from "../src/service/pizzaService";
import { adminInit } from "../testUtils";

test("admin dash", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Add Franchise" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await expect(
    page.getByRole("textbox", { name: "franchise name" })
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "franchise name" })
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "franchisee admin email" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
});

test("close franchise", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await page
    .getByRole("row", { name: "LotaPizza Close" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
});

test("close store", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await page
    .getByRole("row", { name: "Lehi ₿ Close" })
    .getByRole("button")
    .click();
  await expect(page.getByRole("link", { name: "close-store" })).toBeVisible();
});

test("list users", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await expect(page.getByText("Users")).toBeVisible();

  await expect(page.getByText("test1")).toBeVisible();
});

test("delete user", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await page.getByRole("row", { name: "test1" }).getByRole("button").click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(page.getByText("Are you sure you want to ")).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();

  await page.getByRole("button", { name: "Cancel" }).click();
  
});

test("filter users", async ({ page }) => {
  await adminInit(page);

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("admin-dashboard")).toBeVisible();

  await expect(page.getByText("Users")).toBeVisible();

  await page.getByRole("textbox", { name: "Filter users" }).fill("test1");
  await page.getByRole('cell', { name: 'test1 Submit' }).getByRole('button').click();
  await expect(page.getByText("test1")).toBeVisible();

  await expect(page.getByText("test2")).not.toBeVisible(); 
});
