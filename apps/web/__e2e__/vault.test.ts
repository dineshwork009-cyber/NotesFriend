import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { getTestId, NOTE, PASSWORD } from "./utils";

test("locking a note should show vault unlocked status", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));

  await note?.contextMenu.lock(PASSWORD);

  await expect(vaultUnlockedStatus).toBeVisible();
});

test("clicking on vault unlocked status should lock the vault", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));

  await note?.contextMenu.lock(PASSWORD);
  await note?.openLockedNote(PASSWORD);
  await vaultUnlockedStatus.waitFor({ state: "visible" });
  await vaultUnlockedStatus.click();

  await expect(vaultUnlockedStatus).toBeHidden();
  expect(await note?.contextMenu.isLocked()).toBe(true);
});

test("opening a locked note should show vault unlocked status", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));

  await note?.contextMenu.lock(PASSWORD);
  await vaultUnlockedStatus.waitFor({ state: "visible" });
  await vaultUnlockedStatus.click();
  await vaultUnlockedStatus.waitFor({ state: "hidden" });
  await note?.openLockedNote(PASSWORD);

  await expect(vaultUnlockedStatus).toBeVisible();
});

test("unlocking a note permanently should not show vault unlocked status", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));

  await note?.contextMenu.lock(PASSWORD);
  await vaultUnlockedStatus.waitFor({ state: "visible" });
  await vaultUnlockedStatus.click();
  await vaultUnlockedStatus.waitFor({ state: "hidden" });
  await note?.contextMenu.unlock(PASSWORD);

  await expect(vaultUnlockedStatus).toBeHidden();
});

test("clicking on vault unlocked status should lock the note", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  await note?.contextMenu.lock(PASSWORD);
  await note?.openLockedNote(PASSWORD);

  expect(await note?.isLockedNotePasswordFieldVisible()).toBe(false);

  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));
  await vaultUnlockedStatus.waitFor({ state: "visible" });
  await vaultUnlockedStatus.click();

  expect(await note?.isLockedNotePasswordFieldVisible()).toBe(true);
});

test("clicking on vault unlocked status should lock the readonly note", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  await note?.properties.readonly();
  await note?.contextMenu.lock(PASSWORD);
  await note?.openLockedNote(PASSWORD);

  expect(await note?.isLockedNotePasswordFieldVisible()).toBe(false);

  const vaultUnlockedStatus = page.locator(getTestId("vault-unlocked"));
  await vaultUnlockedStatus.waitFor({ state: "visible" });
  await vaultUnlockedStatus.click();

  expect(await note?.isLockedNotePasswordFieldVisible()).toBe(true);
});
