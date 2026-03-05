import { create } from "zustand";

export interface EditorStore {
  currentEditingNote: string | null;
  setCurrentlyEditingNote: (note: string | null) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  searchSelection: string | null;
  readonly: boolean;
  setReadonly: (readonly: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  currentEditingNote: null,
  setCurrentlyEditingNote: (note) => set({ currentEditingNote: note }),
  sessionId: null,
  setSessionId: (sessionId) => {
    set({ sessionId });
  },
  searchSelection: null,
  readonly: false,
  setReadonly: (readonly) => {
    set({ readonly: readonly });
  }
}));
