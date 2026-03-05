import { databaseTest } from "./utils/index.ts";
import { test, expect } from "vitest";

test("save group options", () =>
  databaseTest().then(async (db) => {
    const groupOptions = {
      groupBy: "abc",
      sortBy: "dateCreated",
      sortDirection: "asc"
    };
    await db.settings.setGroupOptions("home", groupOptions);
    expect(db.settings.getGroupOptions("home")).toMatchObject(groupOptions);
  }));

test("save toolbar config", () =>
  databaseTest().then(async (db) => {
    const toolbarConfig = {
      preset: "custom",
      config: ["bold", "italic"]
    };
    await db.settings.setToolbarConfig("mobile", toolbarConfig);
    expect(db.settings.getToolbarConfig("mobile")).toMatchObject(toolbarConfig);
  }));

test("save trash cleanup interval", () =>
  databaseTest().then(async (db) => {
    const interval = 7;
    await db.settings.setTrashCleanupInterval(interval);
    expect(db.settings.getTrashCleanupInterval()).toBe(interval);
  }));
