import { getDefaultPresets } from "@notesfriend/editor";
import { useState } from "react";
import { Settings } from "../utils";

const settingsJson = localStorage.getItem("editorSettings");
const initialState: Partial<Settings> = {
  fullscreen: false,
  deviceMode: "mobile",
  premium: false,
  tools: JSON.parse(JSON.stringify(getDefaultPresets().default)),
  noToolbar: globalThis.noToolbar,
  noHeader: globalThis.noHeader,
  readonly: globalThis.readonly,
  doubleSpacedLines: true,
  fontFamily: "sans-serif",
  fontSize: 16,
  timeFormat: "12-hour",
  dateFormat: "DD-MM-YYYY",
  loggedIn: false,
  defaultLineHeight: 1.2
};

global.settingsController = {
  update: (settings) => {
    const nextSettings = {
      ...settings,
      noToolbar: globalThis.noToolbar || settings.noToolbar,
      noHeader: globalThis.noHeader || settings.noHeader,
      readonly: globalThis.readonly || settings.readonly
    };
    if (
      JSON.stringify(nextSettings) ===
      JSON.stringify(global.settingsController.previous)
    ) {
      return;
    }
    if (global.settingsController.set)
      global.settingsController.set(nextSettings);
    if (settings) {
      localStorage.setItem("editorSettings", JSON.stringify(nextSettings));
    } else {
      localStorage.removeItem("editorSettings");
    }
    settingsController.previous = { ...nextSettings };
  },
  previous: settingsJson ? JSON.parse(settingsJson) : { ...initialState }
};
global.settingsController.previous.noHeader = globalThis.noHeader;
global.settingsController.previous.noToolbar = globalThis.noToolbar;
global.settingsController.previous.readonly = globalThis.readonly;

export const useSettings = (): Settings => {
  const [settings, setSettings] = useState({
    ...global.settingsController.previous
  });
  global.settingsController.set = setSettings;

  return settings;
};
