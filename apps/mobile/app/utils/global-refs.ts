import { createNavigationContainerRef } from "@react-navigation/native";
import { createRef } from "react";
import { TextInput, View } from "react-native";
import { TabsRef } from "../components/fluid-panels";
import { RouteParams } from "../stores/use-navigation-store";

export const inputRef = createRef<TextInput>();
export const rootNavigatorRef = createNavigationContainerRef<RouteParams>();
export const appNavigatorRef = createNavigationContainerRef<RouteParams>();
export const fluidTabsRef = createRef<TabsRef>();
export const editorRef = createRef<View>();
