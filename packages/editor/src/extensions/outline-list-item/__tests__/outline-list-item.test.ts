import {
  createEditor,
  h,
  li,
  outlineList,
  outlineListItem
} from "../../../../test-utils/index.js";
import { test, expect, describe, beforeAll, vi } from "vitest";
import { OutlineList } from "../../outline-list/outline-list.js";
import { OutlineListItem } from "../outline-list-item.js";
import { CodeBlock } from "../../code-block/code-block.js";
import { Paragraph } from "../../paragraph/paragraph.js";
import { ImageNode } from "../../image/image.js";

describe("outline list item", () => {
  beforeAll(() => {
    vi.mock("nanoid", () => ({
      nanoid: () => "test-id-123456"
    }));
  });

  test(`code block in outline list item`, async () => {
    const subList = outlineList(
      outlineListItem(["sub item 2"]),
      outlineListItem(["sub item 3"])
    );
    const listItemWithCodeBlock = li(
      [
        h("p", ["hello"]),
        h("pre", [h("code", ["const x = 1;"])]),
        h("p", ["world"]),
        subList
      ],
      { "data-type": "outlineListItem" }
    );
    const el = outlineList(
      outlineListItem(["item 1"]),
      listItemWithCodeBlock,
      outlineListItem(["item 4"])
    );

    const {
      builder: { codeBlock },
      editor
    } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        outlineList: OutlineList,
        outlineListItem: OutlineListItem,
        codeBlock: CodeBlock
      }
    });

    expect(editor.getJSON()).toMatchSnapshot();
  });

  /**
   * Two changes happened:
   * 1. Images were converted from inline nodes to block nodes (https://github.com/streetwriters/notesfriend/pull/8563)
   * 2. Outline list item's `content` schema was changed from `paragraph + list?`  to `block+` to `paragraph block*` (https://github.com/streetwriters/notesfriend/pull/8772 and https://github.com/streetwriters/notesfriend/commit/0b943d8ecdf04fd7d996fd0a4b1d62ec9569f071)
   *
   * In the old editor, it was possible to have an inline image as the first item in the outline list item, but based on the new schema it is not possible anymore. So the editor should insert an empty paragraph before the image.
   */
  test("inline image as first child in the old outline list item", async () => {
    const el = outlineList(
      outlineListItem(["item 1"]),
      outlineListItem([h("img", [], { src: "image.png" })])
    );

    const { editor } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        outlineList: OutlineList,
        outlineListItem: OutlineListItem,
        paragraph: Paragraph,
        image: ImageNode
      }
    });

    expect(editor.getHTML()).toMatchSnapshot();
  });
});
