import { Platform } from "react-native";

const EditorMobileSourceUrl =
  Platform.OS === "android"
    ? "file:///android_asset/index.html"
    : "build.bundle/index.html";
/**
 * Replace this with dev url when debugging or working on the editor mobile repo.
 * The url should be something like this: http://192.168.100.126:3000/index.html
 */
export const EDITOR_URI = __DEV__
  ? EditorMobileSourceUrl
  : EditorMobileSourceUrl;
