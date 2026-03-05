/* eslint-disable no-undef */
import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";

function createRoute(key: string, header: string) {
  return { buttonId: `navitem-${key}`, header };
}

const routes = [
  createRoute("notes", "Notes"),
  createRoute("favorites", "Favorites"),
  createRoute("reminders", "Reminders"),
  createRoute("trash", "Trash")
];

for (const route of routes) {
  test(`navigating to ${route.header}`, async ({ page }) => {
    const app = new AppModel(page);
    await app.goto();

    await app.navigateTo(route.header);

    expect(await app.getRouteHeader()).toBe(route.header);
  });
}
