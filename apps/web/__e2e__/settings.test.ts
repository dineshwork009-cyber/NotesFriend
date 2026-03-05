import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { NOTE } from "./utils";

test("ask for image compression during image upload when 'Image Compression' setting is 'Ask every time'", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const settings = await app.goToSettings();
  await settings.selectImageCompression({
    value: "0",
    label: "Ask every time"
  });
  await settings.close();

  const notes = await app.goToNotes();
  await notes.createNote(NOTE);
  await notes.editor.attachImage();

  await expect(page.getByText("Enable compression")).toBeVisible();
});

test("do not ask for image compression during image upload when 'Image Compression' setting is 'Enable (Recommended)'", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const settings = await app.goToSettings();
  await settings.selectImageCompression({
    value: "1",
    label: "Enable (Recommended)"
  });
  await settings.close();

  const notes = await app.goToNotes();
  await notes.createNote(NOTE);
  await notes.editor.attachImage();

  await expect(page.getByText("Enable compression")).toBeHidden();
});

test("do not ask for image compression during image upload when 'Image Compression' setting is 'Disable'", async ({
  page
}) => {
  await page.exposeBinding("isPro", () => true);

  const app = new AppModel(page);
  await app.goto();
  const settings = await app.goToSettings();
  await settings.selectImageCompression({
    value: "2",
    label: "Disable"
  });
  await settings.close();

  const notes = await app.goToNotes();
  await notes.createNote(NOTE);
  await notes.editor.attachImage();

  await expect(page.getByText("Enable compression")).toBeHidden();
});
