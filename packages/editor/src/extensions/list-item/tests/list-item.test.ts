import ListKeymap from "@tiptap/extension-list-keymap";
import { expect, test } from "vitest";
import { createEditor, h, li, p, ul } from "../../../../test-utils/index.js";
import BulletList from "../../bullet-list/index.js";
import OrderedList from "../../ordered-list/index.js";
import { ListItem } from "../index.js";
import { Paragraph } from "../../paragraph/paragraph.js";
import { ImageNode } from "../../image/image.js";

test("hitting backspace at the start of first list item", async () => {
  const el = ul([li([p(["item1"])]), li([p(["item2"])])]);
  const editorElement = h("div");
  const editor = createEditor({
    element: editorElement,
    initialContent: el.outerHTML,
    extensions: {
      listItem: ListItem,
      listKeymap: ListKeymap.configure({
        listTypes: [
          {
            itemName: ListItem.name,
            wrapperNames: [BulletList.name, OrderedList.name]
          }
        ]
      })
    }
  });
  const event = new KeyboardEvent("keydown", { key: "Backspace" });
  editor.editor.view.dom.dispatchEvent(event);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(editorElement.outerHTML).toMatchSnapshot();
});

test("hitting backspace at the start of the second (or next) list item", async () => {
  const el = ul([li([p(["item1"])]), li([p(["item2"])])]);
  const editorElement = h("div");
  const editor = createEditor({
    element: editorElement,
    initialContent: el.outerHTML,
    extensions: {
      listItem: ListItem,
      listKeymap: ListKeymap.configure({
        listTypes: [
          {
            itemName: ListItem.name,
            wrapperNames: [BulletList.name, OrderedList.name]
          }
        ]
      })
    }
  });
  editor.editor.commands.setTextSelection(12);
  const event = new KeyboardEvent("keydown", { key: "Backspace" });
  editor.editor.view.dom.dispatchEvent(event);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(editorElement.outerHTML).toMatchSnapshot();
});

test("hitting backspace at the start of the second (or next) paragraph inside the list item", async () => {
  const el = ul([li([p(["item 1"]), p(["item 2"])])]).outerHTML;
  const editorElement = h("div");
  const editor = createEditor({
    element: editorElement,
    initialContent: el,
    extensions: {
      listItem: ListItem,
      listKeymap: ListKeymap.configure({
        listTypes: [
          {
            itemName: ListItem.name,
            wrapperNames: [BulletList.name, OrderedList.name]
          }
        ]
      })
    }
  });
  editor.editor.commands.setTextSelection(11);
  const event = new KeyboardEvent("keydown", { key: "Backspace" });
  editor.editor.view.dom.dispatchEvent(event);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(editorElement.outerHTML).toMatchSnapshot();
});

/**
 * see https://github.com/streetwriters/notesfriend/pull/8877 for more context
 */
test("inline image as first child in list item", async () => {
  const el = ul([
    li([p(["item 1"])]),
    li([h("img", [], { src: "image.png" })])
  ]);

  const { editor } = createEditor({
    initialContent: el.outerHTML,
    extensions: {
      listItem: ListItem,
      paragraph: Paragraph,
      image: ImageNode
    }
  });

  expect(editor.getHTML()).toMatchSnapshot();
});
