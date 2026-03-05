import {
  createEditor,
  taskItem,
  taskList
} from "../../../../test-utils/index.js";
import { test, expect } from "vitest";
import { TaskListNode } from "../index.js";
import { TaskItemNode } from "../../task-item/index.js";
import { p, eq } from "prosemirror-test-builder";
import { countCheckedItems, deleteCheckedItems, sortList } from "../utils.js";

const NESTED_TASK_LIST = taskList(
  taskItem(["Task item 1"], { checked: true }),
  taskItem(["Task item 2"]),
  taskItem(
    ["Task item 3"],
    { checked: false },
    taskList(
      taskItem(["Task item 4"], { checked: true }),
      taskItem(["Task item 5"]),
      taskItem(
        ["Task item 6"],
        { checked: false },
        taskList(
          taskItem(["Task item 7"], { checked: true }),
          taskItem(["Task item 8"], { checked: true }),
          taskItem(
            ["Task item 9"],
            { checked: false },
            taskList(
              taskItem(["Task item 10"], { checked: true }),
              taskItem(["Task item 11"], { checked: true }),
              taskItem(["Task item 12"])
            )
          )
        )
      )
    )
  )
).outerHTML;

test(`count items in a task list`, async () => {
  const {
    builder: { taskItem, taskList }
  } = createEditor({
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  const taskListNode = taskList(
    taskItem({ checked: true }, p("Task item 1")),
    taskItem({ checked: false }, p("Task item 2")),
    taskItem(
      { checked: false },
      p("Task item 3"),
      taskList(taskItem({ checked: true }, p("Task item 4")))
    )
  );

  const { checked, total } = countCheckedItems(taskListNode);
  expect(checked).toBe(2);
  expect(total).toBe(4);
});

test(`delete checked items in a task list`, async () => {
  const { editor } = createEditor({
    initialContent: taskList(
      taskItem(["Task item 1"], { checked: true }),
      taskItem(["Task item 2"])
    ).outerHTML,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  editor.commands.command(({ tr }) => !!deleteCheckedItems(tr, 0));

  expect(editor.state.doc.content.toJSON()).toMatchSnapshot();
});

test(`delete checked items in a nested task list`, async () => {
  const { editor } = createEditor({
    initialContent: NESTED_TASK_LIST,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  let { tr } = editor.state;
  tr = deleteCheckedItems(tr, 0) || tr;
  editor.view.dispatch(tr);

  expect(editor.state.doc.content.toJSON()).toMatchSnapshot();
});

test(`delete checked items in a task list with no checked items should do nothing`, async () => {
  const { editor } = createEditor({
    initialContent: taskList(
      taskItem(["Task item 1"], { checked: false }),
      taskItem(["Task item 2"]),
      taskItem(
        ["Task item 3"],
        { checked: false },
        taskList(
          taskItem(["Task item 4"], { checked: false }),
          taskItem(["Task item 5"]),
          taskItem(["Task item 6"], { checked: false })
        )
      )
    ).outerHTML,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  const beforeDoc = editor.state.doc.copy(editor.state.doc.content);
  editor.commands.command(({ tr }) => !!deleteCheckedItems(tr, 0));

  expect(eq(editor.state.doc, beforeDoc)).toBe(true);
});

test(`sort checked items to the bottom of the task list`, async () => {
  const { editor } = createEditor({
    initialContent: NESTED_TASK_LIST,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  editor.commands.command(({ tr }) => !!sortList(tr, 0));

  expect(editor.state.doc.content.toJSON()).toMatchSnapshot();
});

test(`sorting a task list with no checked items should do nothing`, async () => {
  const { editor } = createEditor({
    initialContent: taskList(
      taskItem(["Task item 1"]),
      taskItem(["Task item 2"])
    ).outerHTML,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });

  const beforeDoc = editor.state.doc.copy(editor.state.doc.content);
  editor.commands.command(({ tr }) => !!sortList(tr, 0));

  expect(eq(editor.state.doc, beforeDoc)).toBe(true);
});

test("sorting a task list should preserve cursor location", async () => {
  const { editor } = createEditor({
    initialContent: NESTED_TASK_LIST,
    extensions: {
      taskItem: TaskItemNode.configure({ nested: true }),
      taskList: TaskListNode
    }
  });
  const beforeFrom = editor.state.selection.from;
  const beforeTo = editor.state.selection.to;

  editor.commands.command(({ tr }) => !!sortList(tr, 0));

  expect(editor.state.selection.from).toBe(beforeFrom);
  expect(editor.state.selection.to).toBe(beforeTo);
});
