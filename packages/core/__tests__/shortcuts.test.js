import { databaseTest, notebookTest } from "./utils/index.ts";
import { test, expect } from "vitest";

test("create a shortcut of an invalid item should throw", () =>
  databaseTest().then(async (db) => {
    await expect(() =>
      db.shortcuts.add({ itemType: "HELLO!" })
    ).rejects.toThrow(/cannot create a shortcut/i);
  }));

test("create a shortcut of notebook", () =>
  notebookTest().then(async ({ db, id }) => {
    await db.shortcuts.add({ itemType: "notebook", itemId: id });
    expect(db.shortcuts.exists(id)).toBe(true);
    expect(db.shortcuts.all.find((s) => s.id === id)).toBeDefined();
  }));

test("create a duplicate shortcut of notebook", () =>
  notebookTest().then(async ({ db, id }) => {
    await db.shortcuts.add({ itemType: "notebook", itemId: id });
    await db.shortcuts.add({ itemType: "notebook", itemId: id });

    expect(db.shortcuts.all).toHaveLength(1);
    expect(db.shortcuts.all.find((s) => s.id === id)).toBeDefined();
  }));

test("pin a tag", () =>
  databaseTest().then(async (db) => {
    const tagId = await db.tags.add({ title: "HELLO!" });
    await db.shortcuts.add({ itemType: "tag", itemId: tagId });

    expect(db.shortcuts.all).toHaveLength(1);
    expect(db.shortcuts.all.find((s) => s.id === tagId)).toBeDefined();
  }));

test("remove shortcut", () =>
  databaseTest().then(async (db) => {
    const tagId = await db.tags.add({ title: "HELLO!" });
    const shortcutId = await db.shortcuts.add({
      itemType: "tag",
      itemId: tagId
    });

    expect(db.shortcuts.all).toHaveLength(1);

    await db.shortcuts.remove(shortcutId);
    expect(db.shortcuts.all).toHaveLength(0);
  }));
