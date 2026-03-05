import { TaskList } from "@tiptap/extension-task-list";
import { BulletList } from "@tiptap/extension-bullet-list";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { OutlineList } from "../extensions/outline-list/index.js";
import { OutlineListItem } from "../extensions/outline-list-item/index.js";
import { TaskItem } from "@tiptap/extension-task-item";
import { CheckList } from "../extensions/check-list/index.js";
import { CheckListItem } from "../extensions/check-list-item/index.js";

export const LIST_NODE_TYPES = [
  TaskList.name,
  OutlineList.name,
  BulletList.name,
  OrderedList.name,
  CheckList.name
];

export const LIST_ITEM_NODE_TYPES = [
  TaskItem.name,
  OutlineListItem.name,
  ListItem.name,
  CheckListItem.name
];
