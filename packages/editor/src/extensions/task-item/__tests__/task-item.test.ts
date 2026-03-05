import { describe, expect, test } from "vitest";
import {
  createEditor,
  h,
  p,
  taskList,
  taskItem
} from "../../../../test-utils/index.js";
import { TaskListNode } from "../../task-list/task-list.js";
import { TaskItemNode } from "../task-item.js";
import { Paragraph } from "../../paragraph/paragraph.js";
import { ImageNode } from "../../image/image.js";

describe("task list item", () => {
  /**
   * see https://github.com/streetwriters/notesfriend/pull/8877 for more context
   */
  test("inline image as first child in task list item", async () => {
    const el = taskList(
      taskItem([p(["item 1"])]),
      taskItem([h("img", [], { src: "image.png" })])
    );

    const { editor } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        taskList: TaskListNode,
        taskListItem: TaskItemNode.configure({ nested: true }),
        paragraph: Paragraph,
        image: ImageNode
      }
    });

    expect(editor.getHTML()).toMatchSnapshot();
  });
});
