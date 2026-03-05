import {
  databaseTest,
  TEST_NOTE,
  loginFakeUser
} from "../../../../__tests__/utils/index.ts";
import Collector from "../collector.ts";
import { test, expect } from "vitest";

test("newly created note should get included in collector", () =>
  databaseTest().then(async (db) => {
    await loginFakeUser(db);
    const collector = new Collector(db);

    const noteId = await db.notes.add(TEST_NOTE);

    const items = await iteratorToArray(collector.collect(100, false));

    expect(items).toHaveLength(2);
    expect(items[0].type).toBe("content");
    expect(items[0].items[0].id).toBe((await db.notes.note(noteId)).contentId);
    expect(items[1].items[0].id).toBe(noteId);
    expect(items[1].type).toBe("note");
  }));

test("synced property should be true after getting collected by the collector", () =>
  databaseTest().then(async (db) => {
    await loginFakeUser(db);
    const collector = new Collector(db);

    const noteId = await db.notes.add(TEST_NOTE);

    const items = await iteratorToArray(collector.collect(100, false));
    const items2 = await iteratorToArray(collector.collect(100, false));

    expect(items2).toHaveLength(0);
    expect(items).toHaveLength(2);
    expect(items[0].type).toBe("content");
    expect(items[0].items[0].id).toBe((await db.notes.note(noteId)).contentId);
    expect(items[1].items[0].id).toBe(noteId);
    expect(items[1].type).toBe("note");
  }));

test("edited note should get included in collector", () =>
  databaseTest().then(async (db) => {
    await loginFakeUser(db);
    const collector = new Collector(db);
    const noteId = await db.notes.add(TEST_NOTE);

    await iteratorToArray(collector.collect(100, false));

    await db.notes.add({ id: noteId, pinned: true });

    const items = await iteratorToArray(collector.collect(100, false));

    expect(items).toHaveLength(1);
    expect(items[0].items[0].id).toBe(noteId);
  }));

test("localOnly note should get included as a deleted item in collector", () =>
  databaseTest().then(async (db) => {
    await loginFakeUser(db);
    const collector = new Collector(db);
    await db.notes.add({ ...TEST_NOTE, localOnly: true });

    const items = await iteratorToArray(collector.collect(100, false));

    expect(items).toHaveLength(2);
    expect(items[0].items[0].length).toBe(77);
    expect(items[1].items[0].length).toBe(77);
    expect(items[0].type).toBe("content");
    expect(items[1].type).toBe("note");
  }));

test("unlinked relation should get included in collector", () =>
  databaseTest().then(async (db) => {
    await loginFakeUser(db);
    const collector = new Collector(db);
    await db.relations.add(
      { id: "h", type: "note" },
      { id: "h", type: "attachment" }
    );

    await iteratorToArray(collector.collect(100, false));

    await db.relations.from({ id: "h", type: "note" }, "attachment").unlink();

    const items = await iteratorToArray(collector.collect(100, false));

    expect(items).toHaveLength(1);
    expect(items[0].items[0].id).toBe("cd93df7a4c64fbd5f100361d629ac5b5");
  }));

async function iteratorToArray(iterator) {
  let items = [];
  for await (const item of iterator) {
    items.push(item);
  }
  return items;
}
