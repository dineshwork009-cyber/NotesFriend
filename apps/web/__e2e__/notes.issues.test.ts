import { expect, test } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { NOTE } from "./utils";
test.skip("TODO: make sure jump to group works", () => {});

test("#1002 Can't add a tag that's a substring of an existing tag", async ({
  page
}) => {
  const tags = ["chromeos-105", "chromeos"];
  const app = new AppModel(page);
  await app.goto();
  const tagsView = await app.goToTags();
  await tagsView.createItem({ title: "chromeos-105" });
  const notes = await app.goToNotes();
  await notes.createNote(NOTE);

  await notes.editor.setTags(tags);

  const noteTags = await notes.editor.getTags();
  expect(noteTags).toHaveLength(tags.length);
  expect(noteTags.every((t, i) => t === tags[i])).toBe(true);
});
