import { parseInternalLink } from "@notesfriend/core";
import { createRef, MutableRefObject, RefObject } from "react";
import { TextInput } from "react-native";
import WebView from "react-native-webview";
import { db } from "../../../common/database";
import {
  eSendEvent,
  eSubscribeEvent,
  eUnSubscribeEvent
} from "../../../services/event-manager";
import { eOnLoadNote } from "../../../utils/events";
import { NotesfriendModule } from "../../../utils/notesfriend-module";
import { AppState, EditorState, useEditorType } from "./types";
import { useTabStore } from "./use-tab-store";
import { NativeEvents } from "@notesfriend/editor-mobile/src/utils/native-events";

export const textInput = createRef<TextInput>();
export const editorController =
  createRef<useEditorType>() as MutableRefObject<useEditorType>;

export const defaultState: Partial<EditorState> = {
  movedAway: true
};

export function editorState() {
  if (!editorController.current?.state.current) {
    console.warn("Editor state not ready");
  }
  return editorController.current?.state.current || defaultState;
}

export function randId(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}

export function makeSessionId(id?: string) {
  return id ? id + randId("_session_") : randId("session_");
}

export async function isEditorLoaded(
  ref: RefObject<WebView | null>,
  sessionId: string,
  tabId: string
) {
  return await post(ref, sessionId, tabId, NativeEvents.status);
}

export async function post<T>(
  ref: RefObject<WebView | null>,
  sessionId: string,
  tabId: string,
  type: string,
  value: T | null = null,
  waitFor = 300
) {
  if (!sessionId) {
    console.warn("post called without sessionId of type:", type);
    return;
  }
  const message = {
    type,
    value,
    sessionId: sessionId,
    tabId
  };
  setImmediate(() => ref.current?.postMessage(JSON.stringify(message)));
  const response = await getResponse(type, waitFor);
  return response;
}

type WebviewResponseData = {
  [name: string]: unknown;
  sessionId: string | null;
  type: string;
  value: unknown;
};

export const getResponse = async (
  type: string,
  waitFor = 300
): Promise<WebviewResponseData | false> => {
  return new Promise((resolve) => {
    const callback = (data: WebviewResponseData) => {
      eUnSubscribeEvent(type, callback);
      resolve(data);
    };
    eSubscribeEvent(type, callback);
    setTimeout(() => {
      eUnSubscribeEvent(type, callback);
      resolve(false);
    }, waitFor);
  });
};

export const waitForEvent = async (
  type: string,
  waitFor = 300
): Promise<any> => {
  return new Promise((resolve) => {
    const callback = (data: any) => {
      eUnSubscribeEvent(type, callback);
      resolve(data);
    };
    eSubscribeEvent(type, callback);
    setTimeout(() => {
      eUnSubscribeEvent(type, callback);
      resolve(false);
    }, waitFor);
  });
};

export function isContentInvalid(content: string | undefined) {
  return (
    !content ||
    content === "" ||
    content.trim() === "" ||
    content === "<p></p>" ||
    content === "<p><br></p>" ||
    content === "<p>&nbsp;</p>"
  );
}

const canRestoreAppState = (appState: AppState) => {
  return appState.editing && Date.now() < appState.timestamp + 3600000;
};

let appState: AppState | undefined;
export function setAppState(state: AppState) {
  appState = state;
}
export function getAppState() {
  if (appState && canRestoreAppState(appState)) return appState as AppState;
  const json = NotesfriendModule.getAppState();
  if (json) {
    appState = JSON.parse(json) as AppState;
    if (canRestoreAppState(appState)) {
      return appState;
    } else {
      clearAppState();
      return null;
    }
  }
  return null;
}

export function clearAppState() {
  appState = undefined;
  NotesfriendModule.setAppState("");
}

export async function openInternalLink(url: string) {
  const data = parseInternalLink(url);
  if (!data?.id) return false;
  if (
    data.id ===
    useTabStore.getState().getNoteIdForTab(useTabStore.getState().currentTab!)
  ) {
    if (data.params?.blockId) {
      setTimeout(() => {
        if (!data.params?.blockId) return;
        editorController.current.commands.scrollIntoViewById(
          data.params.blockId
        );
      }, 150);
    }
    return;
  }

  eSendEvent(eOnLoadNote, {
    item: await db.notes.note(data?.id),
    blockId: data.params?.blockId
  });
}
