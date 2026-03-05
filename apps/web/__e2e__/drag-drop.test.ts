import { expect, test } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { NotesViewModel } from "./models/notes-view.model";

for (const item of [
  { id: "notebooks", title: "Notebooks" },
  { id: "tags", title: "Tags" }
]) {
  test.skip(`drag & hover over ${item.id} should navigate inside`, () => {});
}

test(`drag & drop note over Favorites should make the note favorite`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const navigationItem = await app.navigation.findItem("Favorites");

  await note?.locator.dragTo(navigationItem.locator);

  expect(await note?.isFavorite()).toBe(true);
});

test(`drag & drop note over Trash should move the note to Trash`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const navigationItem = await app.navigation.findItem("Trash");

  await note?.locator.dragTo(navigationItem.locator);

  const trash = await app.goToTrash();
  expect(await trash.findItem("Test note")).toBeDefined();
});

test(`drag & drop note over a notebook should get assigned to the notebook`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const notebooks = await app.goToNotebooks();
  const notebook = await notebooks.createNotebook({ title: "Test notebook" });

  await note?.locator.hover();
  await page.mouse.down();
  await notebook?.locator.hover();
  await notebook?.locator.hover();
  await page.mouse.up();

  const notebookNotes = await notebook?.openNotebook();
  expect(await notebookNotes?.findNote({ title: "Test note" })).toBeDefined();
});

test(`drag & drop note over a tag should get assigned to the tag`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const tags = await app.goToTags();
  const tag = await tags.createItem({ title: "Tag" });

  await note?.locator.hover();
  await page.mouse.down();
  await tag?.locator.hover();
  await tag?.locator.hover();
  await page.mouse.up();

  const tagNotes = await tag?.open();
  expect(await tagNotes?.findNote({ title: "Test note" })).toBeDefined();
});

test(`drag & drop note over a tag shortcut should get assigned to the tag`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const tags = await app.goToTags();
  const tag = await tags.createItem({ title: "Tag1" });
  await tag?.createShortcut();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const navigationItem = await app.navigation.findItem("Tag1");

  await note?.locator.hover();
  await page.mouse.down();
  await navigationItem?.locator.hover();
  await page.mouse.up();

  await navigationItem?.click();
  const tagNotes = new NotesViewModel(page, "notes", "notes");
  expect(await tagNotes?.findNote({ title: "Test note" })).toBeDefined();
});

test(`drag & drop note over a notebook shortcut should get assigned to the notebook`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notebooks = await app.goToNotebooks();
  const notebook = await notebooks.createNotebook({ title: "Test notebook" });
  await notebook?.createShortcut();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const navigationItem = await app.navigation.findItem("Test notebook");

  await note?.locator.hover();
  await page.mouse.down();
  await navigationItem?.locator.hover();
  await page.mouse.up();

  await navigationItem?.click();
  const notebookNotes = new NotesViewModel(page, "notebook", "notes");
  expect(await notebookNotes?.findNote({ title: "Test note" })).toBeDefined();
});

test(`drag & drop note over a nested notebook should get assigned to the notebook`, async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote({
    title: `Test note`
  });
  const notebooks = await app.goToNotebooks();
  const notebook = await notebooks.createNotebook({
    title: "Test notebook"
  });
  const nestedNotebook = await notebook?.createSubnotebook({
    title: "Nested notebook"
  });

  await note?.locator.hover();
  await page.mouse.down();
  await nestedNotebook?.locator.hover();
  await nestedNotebook?.locator.hover();
  await page.mouse.up();

  await nestedNotebook?.click();
  const notebookNotes = new NotesViewModel(page, "notebook", "notes");
  expect(await notebookNotes?.findNote({ title: "Test note" })).toBeDefined();
});
