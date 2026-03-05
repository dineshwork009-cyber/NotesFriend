import { test, expect } from "@playwright/test";
import { createHistorySession, PASSWORD } from "./utils";

test.setTimeout(60 * 1000);

const sessionTypes = ["locked", "unlocked"] as const;

for (const type of sessionTypes) {
  const isLocked = type === "locked";

  test(`editing a note should create a new ${type} session in its session history`, async ({
    page
  }) => {
    const { note } = await createHistorySession(page, isLocked);

    const history = await note?.properties.getSessionHistory();
    expect(history?.length).toBeGreaterThan(1);

    if (isLocked) {
      for (const item of history || []) {
        expect(await item.isLocked()).toBeTruthy();
      }
    }
  });

  test(`switching ${type} sessions should change editor content`, async ({
    page
  }) => {
    const { note, contents } = await createHistorySession(page, isLocked);

    const history = await note?.properties.getSessionHistory();
    let preview = await history?.at(1)?.open();
    if (type === "locked") await preview?.unlock(PASSWORD);

    await expect(preview!.firstEditor.locator(".ProseMirror")).toHaveText(
      contents[1]
    );
    await note?.click();
    if (type === "locked") await note?.openLockedNote(PASSWORD);
    await note?.properties.close();
    preview = await history?.at(0)?.open();
    if (type === "locked") await preview?.unlock(PASSWORD);

    await expect(preview!.firstEditor.locator(".ProseMirror")).toHaveText(
      contents[0]
    );
  });

  test(`restoring a ${type} session should change note's content`, async ({
    page
  }) => {
    const { note, notes, contents } = await createHistorySession(
      page,
      isLocked
    );
    const history = await note?.properties.getSessionHistory();
    const preview = await history?.at(1)?.open();
    if (type === "locked") await preview?.unlock(PASSWORD);

    await preview?.restore();

    await page.waitForTimeout(1000);
    if (type === "locked") await note?.openLockedNote(PASSWORD);
    expect(await notes.editor.getContent("text")).toBe(contents[1]);
  });
}
