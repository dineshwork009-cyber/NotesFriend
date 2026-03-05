import { ThemeDefinition } from "@notesfriend/theme";

export type ClipArea = "full-page" | "visible" | "selection" | "article";

export type ClipMode = "bookmark" | "simplified" | "screenshot" | "complete";

export type User = {
  email?: string;
  pro: boolean;
  theme: ThemeDefinition;
};
export type ItemReference = {
  id: string;
  title: string;
};

export type NotebookReference = ItemReference;

export type ClientMetadata = {
  id: string;
  name: string;
};

export interface Gateway {
  connect(): ClientMetadata;
}

type SelectedNotebookReference = ItemReference & {
  type: "notebook";
};
type SelectedTagReference = ItemReference & {
  type: "tag";
};

export type SelectedReference =
  | SelectedTagReference
  | SelectedNotebookReference;

export type Clip = {
  url: string;
  title: string;
  data: string;
  area: ClipArea;
  mode: ClipMode;
  width?: number;
  height?: number;
  pageTitle?: string;
  note?: ItemReference;
  refs?: SelectedReference[];
};

export interface Server {
  login(): Promise<User | null>;
  getNotes(): Promise<ItemReference[] | undefined>;
  getNotebooks(parentId?: string): Promise<NotebookReference[] | undefined>;
  getTags(): Promise<ItemReference[] | undefined>;
  saveClip(clip: Clip): Promise<void>;
}

export const WEB_EXTENSION_CHANNEL_EVENTS = {
  ON_CREATED: "web-extension-channel-created",
  ON_READY: "web-extension-channel-ready"
} as const;

export type ClipData = {
  height?: number;
  width?: number;
  data: string;
};
