import { BulletList } from "../extensions/bullet-list/index.js";
import { ListItem } from "../extensions/list-item/index.js";
import { OrderedList } from "../extensions/ordered-list/index.js";
import { OutlineList } from "../extensions/outline-list/index.js";
import { OutlineListItem } from "../extensions/outline-list-item/index.js";
import { TaskItemNode } from "../extensions/task-item/index.js";
import { TaskListNode } from "../extensions/task-list/index.js";
import CheckList from "../extensions/check-list/index.js";
import CheckListItem from "../extensions/check-list-item/index.js";
import { Editor } from "@tiptap/core";
import { LIST_NODE_TYPES } from "./node-types.js";

export function isListActive(editor: Editor): boolean {
  return LIST_NODE_TYPES.some((name) => editor.isActive(name));
}

export function findListItemType(editor: Editor): string | null {
  const isTaskList = editor.isActive(TaskListNode.name);
  const isCheckList = editor.isActive(CheckList.name);
  const isOutlineList = editor.isActive(OutlineList.name);
  const isList =
    editor.isActive(BulletList.name) || editor.isActive(OrderedList.name);

  return isList
    ? ListItem.name
    : isOutlineList
    ? OutlineListItem.name
    : isTaskList
    ? TaskItemNode.name
    : isCheckList
    ? CheckListItem.name
    : null;
}
