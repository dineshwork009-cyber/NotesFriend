import { bench, describe } from "vitest";
import { databaseTest } from "../__tests__/utils/index.js";
import Database from "../src/api/index.js";

async function addNotes(db: Database) {
  const words = [
    "title",
    "who",
    "what",
    "never",
    "works",
    "here",
    "say",
    "there"
  ];
  for (let i = 0; i < 10000; ++i) {
    await db.notes.add({
      title: new Array(10)
        .fill(0)
        .map(() => words[getRandom(0, words.length)])
        .join(" "),
      content: {
        type: "tiptap",
        data: new Array(50)
          .fill(0)
          .map(() => words[getRandom(0, words.length)])
          .join(" ")
      }
    });
    if (i % 100 === 0) console.log(i);
  }
  console.log("DONE");
}

describe("lookup", async () => {
  const db = await databaseTest();
  await addNotes(db);

  bench("using multiple queries", async () => {
    await db.lookup.notes("never works here say").ids();
  });
});

function getRandom(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
