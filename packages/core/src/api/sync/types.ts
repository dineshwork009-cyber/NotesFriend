import { Cipher } from "@notesfriend/crypto";

export type SyncItem = {
  id: string;
  v: number;
} & Cipher<"base64">;

export type SyncableItemType = keyof typeof SYNC_COLLECTIONS_MAP;

export const SYNC_COLLECTIONS_MAP = {
  settingitem: "settings",
  attachment: "attachments",
  content: "content",
  notebook: "notebooks",
  shortcut: "shortcuts",
  reminder: "reminders",
  relation: "relations",
  tag: "tags",
  color: "colors",
  note: "notes",
  vault: "vaults"
} as const;

export const SYNC_ITEM_TYPES = Object.keys(
  SYNC_COLLECTIONS_MAP
) as SyncableItemType[];

export type SyncTransferItem = {
  items: SyncItem[];
  type: SyncableItemType;
  count: number;
};

export type SyncInboxItem = Omit<SyncItem, "format"> & {
  key: Omit<Cipher<"base64">, "format" | "salt" | "iv">;
};

export type ParsedInboxItem = {
  title: string;
  pinned?: boolean;
  favorite?: boolean;
  readonly?: boolean;
  archived?: boolean;
  notebookIds?: string[];
  tagIds?: string[];
  type: "note";
  source: string;
  version: 1;
  content?: {
    type: "html";
    data: string;
  };
};
