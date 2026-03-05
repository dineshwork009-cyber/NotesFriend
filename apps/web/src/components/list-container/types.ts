import { Notebook, Tag } from "@notesfriend/core";
export type NotebookContext = {
  type: "notebook";
  id: string;
  item?: Notebook;
  totalNotes?: number;
};
export type Context =
  | {
      type: "tag";
      id: string;
      item?: Tag;
    }
  | {
      type: "color";
      id: string;
    }
  | NotebookContext
  | {
      type: "favorite" | "monographs" | "archive";
    };

export type WithDateEdited<T> = { items: T[]; dateEdited: number };
export type NotebooksWithDateEdited = WithDateEdited<Notebook>;
export type TagsWithDateEdited = WithDateEdited<Tag>;
