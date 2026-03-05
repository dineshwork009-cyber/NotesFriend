import {
  createEditor,
  h,
  p,
  outlineList,
  outlineListItem
} from "../../../../test-utils/index.js";
import { test, expect, describe } from "vitest";
import { ImageNode } from "../index.js";
import { OutlineList } from "../../outline-list/outline-list.js";
import { OutlineListItem } from "../../outline-list-item/outline-list-item.js";

describe("migration", () => {
  test(`inline image in paragraph`, async () => {
    const el = p(["hello", h("img", [], { src: "image.png" }), "world"]);
    const {
      builder: { image },
      editor
    } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        image: ImageNode.configure({})
      }
    });

    expect(editor.getJSON()).toMatchSnapshot();
  });

  test(`inline image in outline list`, async () => {
    const el = outlineList(
      outlineListItem(["item 1"]),
      outlineListItem(
        ["hello", h("img", [], { src: "image.png" }), "world"],
        outlineList(
          outlineListItem(["sub item 2"]),
          outlineListItem(["sub item 3"])
        )
      ),
      outlineListItem(["item 4"])
    );

    const {
      builder: { image },
      editor
    } = createEditor({
      initialContent: el.outerHTML,
      extensions: {
        outlineList: OutlineList,
        outlineListItem: OutlineListItem,
        image: ImageNode
      }
    });

    expect(editor.getJSON()).toMatchSnapshot();
  });
});
