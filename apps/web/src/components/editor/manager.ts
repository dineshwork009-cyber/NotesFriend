import { useCallback, useEffect } from "react";
import { IEditor, NoteStatistics } from "./types";
import createStore from "../../common/store";
import BaseStore from "../../stores";
import type { TOCItem, ToolbarDefinition } from "@notesfriend/editor";
import Config from "../../utils/config";
import { getCurrentPreset } from "../../common/toolbar-config";
import { EDITOR_LINE_HEIGHT, EDITOR_ZOOM } from "./common";

type EditorConfig = {
  fontFamily: string;
  fontSize: number;
  zoom: number;
  lineHeight: number;
};

type EditorContext = {
  editor?: IEditor;
  canUndo?: boolean;
  canRedo?: boolean;
  statistics?: NoteStatistics;
  tableOfContents?: TOCItem[];
};

class EditorManager extends BaseStore<EditorManager> {
  activeEditorId?: string;
  toolbarConfig?: ToolbarDefinition;
  editorConfig: EditorConfig = Config.get("editorConfig", {
    fontFamily: "sans-serif",
    fontSize: 14,
    zoom: EDITOR_ZOOM.DEFAULT,
    lineHeight: EDITOR_LINE_HEIGHT.DEFAULT
  });
  editors: Record<string, EditorContext | undefined> = {};

  getEditor = (id: string): EditorContext | undefined => {
    return this.get().editors[id];
  };

  setEditor = (id: string, editor?: EditorContext) => {
    this.set((state) => {
      if (!editor) delete state.editors[id];
      else state.editors[id] = editor;
      state.activeEditorId = editor
        ? id
        : id === state.activeEditorId
        ? undefined
        : state.activeEditorId;
    });
  };

  updateEditor = (
    id: string,
    partial:
      | Partial<EditorContext>
      | ((oldState: EditorContext) => Partial<EditorContext>)
  ) => {
    this.set((state) => {
      const oldState = state.editors[id];
      if (!oldState) return;
      state.activeEditorId = id;
      const newPartialState =
        typeof partial === "function" ? partial(oldState) : partial;
      state.editors[id] = { ...oldState, ...newPartialState };
    });
  };

  setEditorConfig = (config: Partial<EditorConfig>) => {
    const oldConfig = this.get().editorConfig;
    this.set({
      editorConfig: Config.set("editorConfig", {
        ...oldConfig,
        ...config
      })
    });
  };
}

const [useEditorManager] = createStore<EditorManager>(
  (set, get) => new EditorManager(set, get)
);

export { useEditorManager };

export function useEditor(id: string) {
  return useEditorManager((store) => store.editors[id]);
}

export function useToolbarConfig() {
  const toolbarConfig = useEditorManager((store) => store.toolbarConfig);
  const setToolbarConfig = useCallback(
    (config: ToolbarDefinition) =>
      useEditorManager.setState({ toolbarConfig: config }),
    []
  );
  useEffect(() => {
    getCurrentPreset().then((preset) =>
      useEditorManager.setState({ toolbarConfig: preset.tools })
    );
  }, []);

  return { toolbarConfig, setToolbarConfig };
}

export function useNoteStatistics(): NoteStatistics {
  return useEditorManager(
    (store) =>
      (store.activeEditorId &&
        store.editors[store.activeEditorId]?.statistics) || {
        words: { total: 0 },
        characters: { total: 0 },
        paragraphs: { total: 0 },
        spaces: { total: 0 }
      }
  );
}

export function useEditorConfig() {
  const editorConfig = useEditorManager((store) => store.editorConfig);
  const setEditorConfig = useEditorManager((store) => store.setEditorConfig);
  return { editorConfig, setEditorConfig };
}

export const editorConfig = () => useEditorManager.getState().editorConfig;

export const onEditorConfigChange = (
  selector: (editorConfig: EditorConfig) => any,
  listener: (
    selectedState: EditorConfig,
    previousSelectedState: EditorConfig
  ) => void
) => useEditorManager.subscribe((s) => selector(s.editorConfig), listener);
