import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { getTestId, NOTE } from "./utils";

test("delete the last note of a color", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  await note?.contextMenu.newColor({ title: "red", color: "#ff0000" });
  await app.navigation.findItem("red");

  await note?.contextMenu.moveToTrash();

  await app.goToTrash();
  expect(await app.getRouteHeader()).toBe("Trash");
});

test("remove color", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  await note?.contextMenu.newColor({ title: "red", color: "#ff0000" });
  await app.navigation.waitForItem("red");
  const colorItem = await app.navigation.findItem("red");

  await colorItem?.removeColor();

  await expect(colorItem!.locator).toBeHidden();
  expect(await app.navigation.findItem("red")).toBeUndefined();
  expect(await note?.contextMenu.isColored("red")).toBe(false);
});

test("rename color", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);
  await note?.contextMenu.newColor({ title: "red", color: "#ff0000" });
  await app.navigation.waitForItem("red");
  const colorItem = await app.navigation.findItem("red");

  await colorItem?.renameColor("priority-33");

  expect(await app.navigation.findItem("priority-33")).toBeDefined();
});

test("creating more than 7 colors shouldn't be possible on free plan", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const notes = await app.goToNotes();
  const note = await notes.createNote(NOTE);

  for (let i = 0; i < 7; ++i) {
    await note?.contextMenu.newColor({
      title: `red${i}`,
      color: getRandomColor()
    });
  }

  const result = await Promise.race([
    note?.contextMenu.newColor({
      title: `color`,
      color: getRandomColor()
    }),
    page.waitForSelector(getTestId("upgrade-dialog")).then(() => true)
  ]);
  expect(result).toBe(true);
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
