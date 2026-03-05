import { bench, describe } from "vitest";
import { databaseTest } from "../__tests__/utils/index.js";
import Database from "../src/api/index.js";

async function addNotes(db: Database) {
  const titles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  for (let i = 0; i < 40000; ++i) {
    await db.notes.add({
      title: `${titles[getRandom(0, titles.length)]} Some other title of mine`
    });
    if (i % 100 === 0) console.log(i);
  }
  console.log("DONE");
}

describe("notes", async () => {
  const db = await databaseTest();

  bench("get grouping", async () => {
    await db.notes.all.grouped({
      groupBy: "abc",
      sortBy: "title",
      sortDirection: "asc"
    });
  });

  const grouping = await db.notes.all.grouped({
    groupBy: "abc",
    sortBy: "title",
    sortDirection: "asc"
  });

  bench("get items in adjacent batches (sequential access)", async function () {
    await grouping.item(30000);
    await grouping.item(30000 + 500 + 1);
    await grouping.item(30000 + 500 + 500 + 1);
    await grouping.item(30000 + 500 + 500 + 500 + 1);
    await grouping.item(30000 + 500 + 500 + 500 + 500 + 1);
  });

  bench("get item from random batches (random access)", async () => {
    await grouping.item(getRandom(0, 40000));
  });
});

function getRandom(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
