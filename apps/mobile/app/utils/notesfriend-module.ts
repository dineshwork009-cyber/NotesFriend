import { NativeModules, Platform } from "react-native";

export type ShortcutInfo = {
  id: string;
  title: string;
  description: string;
  type: "note" | "notebook" | "tag" | "color";
};

interface NotesfriendModuleInterface {
  getActivityName: () => Promise<string>;
  setBackgroundColor: (color: string) => void;
  setSecureMode: (enabled: boolean) => void;
  setAppState: (appState: string) => void;
  getAppState: () => string;
  saveAndFinish: () => void;
  setString: (storeName: string, key: string, value: string) => void;
  getString: (storeName: string, key: string) => Promise<string>;
  removeString: (key: string) => void;
  cancelAndFinish: () => void;
  getWidgetId: () => void;
  getIntent: () => {
    "com.streetwriters.notesfriend.OpenNoteId"?: string;
    "com.streetwriters.notesfriend.OpenReminderId"?: string;
    "com.streetwriters.notesfriend.NewReminder"?: string;
  };
  getWidgetNotes: () => Promise<string[]>;
  hasWidgetNote: (noteId: string) => Promise<boolean>;
  updateWidgetNote: (noteId: string, data: string) => void;
  updateReminderWidget: () => void;
  isGestureNavigationEnabled: () => boolean;
  addShortcut: (
    id: string,
    type: "note" | "notebook" | "tag" | "color",
    title: string,
    description?: string,
    color?: string
  ) => Promise<boolean>;
  removeShortcut: (id: string) => Promise<boolean>;
  updateShortcut: (
    id: string,
    type: "note" | "notebook" | "tag" | "color",
    title: string,
    description?: string,
    color?: string
  ) => Promise<boolean>;
  removeAllShortcuts: () => Promise<boolean>;
  getAllShortcuts: () => Promise<ShortcutInfo[]>;
}

export const NotesfriendModule: NotesfriendModuleInterface = Platform.select({
  ios: {
    getActivityName: () => {},
    setBackgroundColor: () => {},
    setSecureMode: () => {},
    setAppState: () => {},
    getAppState: () => {},
    saveAndFinish: () => {},
    getString: () => {},
    setString: () => {},
    removeString: () => {},
    cancelAndFinish: () => {},
    getWidgetId: () => {},
    getIntent: () => {},
    getWidgetNotes: () => {},
    hasWidgetNote: () => {},
    updateWidgetNote: () => {},
    updateReminderWidget: () => {},
    isGestureNavigationEnabled: () => true,
    addShortcut: () => Promise.resolve(false),
    removeShortcut: () => Promise.resolve(false),
    updateShortcut: () => Promise.resolve(false),
    removeAllShortcuts: () => Promise.resolve(false),
    getAllShortcuts: () => Promise.resolve([])
  },
  android: NativeModules.NNativeModule
});
