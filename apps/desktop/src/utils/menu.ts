import { strings } from "@notesfriend/intl";
import { Menu, MenuItem, clipboard, shell } from "electron";

function setupMenu() {
  if (!globalThis.window) return;

  globalThis.window.webContents.on("context-menu", (_event, params) => {
    const menu = new Menu();

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () =>
            globalThis.window?.webContents.replaceMisspelling(suggestion)
        })
      );
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: strings.addToDictionary(),
          click: () =>
            globalThis.window?.webContents.session.addWordToSpellCheckerDictionary(
              params.misspelledWord
            )
        })
      );
    }

    if (menu.items.length > 0)
      menu.append(
        new MenuItem({
          type: "separator"
        })
      );

    if (params.linkURL.length) {
      menu.append(
        new MenuItem({
          label: strings.openInBrowser(),
          click: () => shell.openExternal(params.linkURL)
        })
      );
    }

    if (params.isEditable) {
      menu.append(
        new MenuItem({
          label: strings.undo(),
          role: "undo",
          enabled: params.isEditable,
          accelerator: "CommandOrControl+Z"
        })
      );

      menu.append(
        new MenuItem({
          label: strings.redo(),
          role: "redo",
          enabled: params.isEditable,
          accelerator: "CommandOrControl+Y"
        })
      );

      menu.append(
        new MenuItem({
          type: "separator"
        })
      );
    }

    if (params.isEditable)
      menu.append(
        new MenuItem({
          label: strings.cut(),
          role: "cut",
          enabled: params.selectionText.length > 0,
          accelerator: "CommandOrControl+X"
        })
      );

    if (params.linkURL?.length) {
      menu.append(
        new MenuItem({
          label: strings.copyLink(),
          click() {
            clipboard.writeText(params.linkURL);
          }
        })
      );

      menu.append(
        new MenuItem({
          label: strings.copyLinkText(),
          click() {
            clipboard.writeText(params.linkText);
          }
        })
      );
    }

    if (params.selectionText.length) {
      menu.append(
        new MenuItem({
          label: strings.copy(),
          role: "copy",
          accelerator: "CommandOrControl+C"
        })
      );
    }

    if (params.mediaType === "image")
      menu.append(
        new MenuItem({
          id: "copy-image",
          label: strings.copyImage(),
          click() {
            globalThis.window?.webContents.copyImageAt(params.x, params.y);
          }
        })
      );

    if (params.isEditable) {
      menu.append(
        new MenuItem({
          label: strings.paste(),
          role: "paste",
          enabled: clipboard.readText("clipboard").length > 0,
          accelerator: "CommandOrControl+V"
        })
      );

      menu.append(
        new MenuItem({
          label:
            process.platform === "darwin"
              ? strings.pasteAndMatchStyle()
              : strings.pasteWithoutFormatting(),
          role: "pasteAndMatchStyle",
          enabled: clipboard.readText("clipboard").length > 0,
          accelerator:
            process.platform === "darwin"
              ? "Option+Shift+Command+V"
              : "Shift+CommandOrControl+V"
        })
      );

      menu.append(
        new MenuItem({
          type: "separator"
        })
      );
      menu.append(
        new MenuItem({
          label: strings.spellCheck(),
          role: "toggleSpellChecker"
        })
      );
    }

    if (menu.items.length > 0) menu.popup();
  });
}
export { setupMenu };
