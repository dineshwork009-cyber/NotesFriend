import { notebookTest, TEST_NOTEBOOK } from "./utils/index.ts";
import { test, expect } from "vitest";

test("add a notebook", () =>
  notebookTest().then(async ({ db, id }) => {
    expect(id).toBeDefined();
    const notebook = await db.notebooks.notebook(id);
    expect(notebook).toBeDefined();
    expect(notebook.title).toBe(TEST_NOTEBOOK.title);
  }));

test("get all notebooks", () =>
  notebookTest().then(async ({ db }) => {
    expect(await db.notebooks.all.count()).toBeGreaterThan(0);
  }));

test("pin a notebook", () =>
  notebookTest().then(async ({ db, id }) => {
    await db.notebooks.pin(true, id);
    const notebook = await db.notebooks.notebook(id);
    expect(notebook.pinned).toBe(true);
  }));

test("unpin a notebook", () =>
  notebookTest().then(async ({ db, id }) => {
    await db.notebooks.pin(false, id);
    const notebook = await db.notebooks.notebook(id);
    expect(notebook.pinned).toBe(false);
  }));

test("updating notebook with empty title should throw", () =>
  notebookTest().then(async ({ db, id }) => {
    await expect(db.notebooks.add({ id, title: "" })).rejects.toThrow();
  }));

test("parentId() returns parentId if notebook is a subnotebook", () =>
  notebookTest().then(async ({ db, id }) => {
    const subId = await db.notebooks.add({ title: "Sub", id });
    await db.relations.add(
      { type: "notebook", id },
      { type: "notebook", id, subId }
    );
    expect(await db.notebooks.parentId(subId)).toBe(id);
  }));

test("parentId() returns undefined if notebook is not a subnotebook", () =>
  notebookTest().then(async ({ db, id }) => {
    expect(await db.notebooks.parentId(id)).toBeUndefined();
  }));
