import { describe, expect, test } from "vitest";
import {
  createEditor,
  h,
  p,
  checkList,
  checkListItem
} from "../../../../test-utils/index.js";
import { CheckList } from "../../check-list/check-list.js";
import { CheckListItem } from "../check-list-item.js";
import { Paragraph } from "../../paragraph/paragraph.js";
import { ImageNode } from "../../image/image.js";

describe("check list item", () => {
  /**
   * see https://github.com/streetwriters/notesfriend/pull/8877 for more context
   */
  test("inline image as first child in check list item", async () => {
    const el = checkList(
      checkListItem([p(["item 1"])]),
      checkListItem([h("img", [], { src: "image.png" })])
    );

    const { editor } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        checkList: CheckList,
        checkListItem: CheckListItem.configure({ nested: true }),
        paragraph: Paragraph,
        image: ImageNode
      }
    });

    expect(editor.getHTML()).toMatchSnapshot();
  });
});
