import { expect, test } from "@playwright/test";
import { androidTest } from "./test-utils";
import { getKey, setKeyboard, type } from "./keyboard-utils";

androidTest(
  "backspacing from new line should not change caret position",
  async ({ chrome, device, keyboards, baseURL, size }, info) => {
    info.setTimeout(30000);

    for (const keyboard of keyboards) {
      await test.step(keyboard.name, async () => {
        if (!(await setKeyboard(device, keyboard.ime)))
          throw new Error("Failed to set keyboard.");

        const page = await chrome.newPage();

        await page.goto(baseURL);

        await page.focus(".ProseMirror");

        await page.waitForTimeout(1000);

        await type(page, device, keyboard, size, "HI\nLA");

        await page.waitForTimeout(100);

        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");

        await device.input.tap(getKey(keyboard, size, "DEL"));

        await page.waitForTimeout(100);

        await type(page, device, keyboard, size, "HO");

        expect((await page.textContent(".ProseMirror"))?.toLowerCase()).toBe(
          "hihola"
        );

        await page.close();
      });
    }
  }
);

androidTest(
  "pressing enter after entering a word should move the caret to the new line",
  async ({ chrome, device, keyboards, baseURL, size }, info) => {
    info.setTimeout(30000);

    for (const keyboard of keyboards) {
      await test.step(keyboard.name, async () => {
        if (!(await setKeyboard(device, keyboard.ime)))
          throw new Error("Failed to set keyboard.");

        const page = await chrome.newPage();

        await page.goto(baseURL);

        await page.focus(".ProseMirror");

        await page.waitForTimeout(1000);

        await type(page, device, keyboard, size, "HELLO");

        await page.waitForTimeout(100);

        await type(page, device, keyboard, size, "\nWORLD");

        expect((await page.innerHTML(".ProseMirror"))?.toLowerCase()).toBe(
          '<p data-spacing="double">hello</p><p data-spacing="double">world</p>'
        );

        await page.close();
      });
    }
  }
);
