import { Attachment } from "@notesfriend/editor";

export const MAX_AUTO_SAVEABLE_WORDS = IS_TESTING ? 100 : 100_000;

export type NoteStatistics = {
  words: {
    total: number;
    selected?: number;
  };
  characters: {
    total: number;
    selected?: number;
  };
  paragraphs: {
    total: number;
    selected?: number;
  };
  spaces: {
    total: number;
    selected?: number;
  };
};

export interface IEditor {
  focus: (options?: {
    position?: "start" | "end" | { from: number; to: number };
    scrollIntoView?: boolean;
  }) => void;
  undo: () => void;
  redo: () => void;
  updateContent: (content: string) => void;
  attachFile: (file: Attachment) => void;
  sendAttachmentProgress: (hash: string, progress: number) => void;
  startSearch: () => void;
  getContent: () => string;
  getSelection: () => { from: number; to: number };
}
