import type { ToolbarGroupDefinition } from "@notesfriend/editor";
import { useEditor } from "./use-editor";
import { FeatureId, FeatureResult } from "@notesfriend/common";
import { DayFormat } from "@notesfriend/core";
export type useEditorType = ReturnType<typeof useEditor>;

export type EditorState = {
  currentlyEditing: boolean;
  isFullscreen: boolean;
  onNoteCreated?: ((id: string) => void) | null;
  isFocused: boolean;
  focusType: "title" | "editor" | null;
  movedAway: boolean;
  tooltip: boolean;
  isRestoringState: boolean;
  keyboardState: boolean;
  ready: boolean;
  saveCount: 0;
  isAwaitingResult: boolean;
  scrollPosition: number;
  overlay?: boolean;
  initialLoadCalled?: boolean;
  editorStateRestored?: boolean;
};

export type Settings = {
  readonly: boolean;
  fullscreen: boolean;
  deviceMode: string;
  premium: boolean;
  tools: ToolbarGroupDefinition[];
  noToolbar?: boolean;
  noHeader?: boolean;
  keyboardShown?: boolean;
  doubleSpacedLines?: boolean;
  corsProxy: string;
  fontSize: number;
  fontFamily: string;
  dateFormat: string;
  timeFormat: string;
  fontScale: number;
  markdownShortcuts: boolean;
  features: Record<any, any>;
  loggedIn: boolean;
  defaultLineHeight: number;
  dayFormat: DayFormat;
};

export type EditorProps = {
  readonly?: boolean;
  noToolbar?: boolean;
  noHeader?: boolean;
  withController?: boolean;
  editorId?: string;
  onLoad?: () => void;
  onChange?: (html: string) => void;
};

export type EditorMessage<T> = {
  sessionId: string;
  value: T;
  type: string;
  noteId: string;
  tabId: string;
  resolverId?: string;
  hasTimeout?: boolean;
};

export type SavePayload = {
  title?: string;
  id?: string;
  data?: string;
  type?: "tiptap";
  sessionHistoryId?: number;
  ignoreEdit: boolean;
  tabId: string;
  pendingChanges?: boolean;
};

export type AppState = {
  editing: boolean;
  movedAway: boolean;
  timestamp: number;
  noteId?: string;
};
