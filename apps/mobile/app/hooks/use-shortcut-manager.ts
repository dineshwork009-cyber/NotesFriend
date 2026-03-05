import Shortcuts, { ShortcutItem } from "react-native-actions-shortcuts";
import { useEffect } from "react";
import { NativeEventEmitter, NativeModule } from "react-native";
import { useRef } from "react";
import { Platform } from "react-native";
import { Linking } from "react-native";
import deviceInfoModule from "react-native-device-info";
import { strings } from "@notesfriend/intl";
const ShortcutsEmitter = new NativeEventEmitter(
  Shortcuts as unknown as NativeModule
);

function isSupported() {
  return Platform.OS !== "android" || deviceInfoModule.getApiLevelSync() > 25;
}
const defaultShortcuts: ShortcutItem[] = [
  {
    type: "notesfriend.action.newnote",
    title: strings.createNewNote(),
    shortTitle: strings.newNote(),
    iconName: Platform.OS === "android" ? "ic_newnote" : "plus"
  }
];
export const useShortcutManager = ({
  onShortcutPressed,
  shortcuts = defaultShortcuts
}: {
  onShortcutPressed: (shortcut: ShortcutItem | null) => void;
  shortcuts?: ShortcutItem[];
}) => {
  const initialShortcutRecieved = useRef(false);

  useEffect(() => {
    if (!isSupported()) return;
    Shortcuts.setShortcuts(shortcuts);
  }, [shortcuts]);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url?.startsWith("ShareMedia://QuickNoteWidget")) {
        onShortcutPressed(defaultShortcuts[0]);
      }
    });
    if (!isSupported()) return;
    Shortcuts.getInitialShortcut().then((shortcut) => {
      if (initialShortcutRecieved.current) return;
      onShortcutPressed(shortcut);
      initialShortcutRecieved.current = true;
    });
    const subscription = ShortcutsEmitter.addListener(
      "onShortcutItemPressed",
      onShortcutPressed
    );
    return () => {
      subscription?.remove();
    };
  }, [onShortcutPressed]);
};
