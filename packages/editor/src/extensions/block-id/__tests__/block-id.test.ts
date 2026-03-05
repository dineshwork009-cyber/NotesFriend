import { test, expect } from "vitest";
import { createEditor, h } from "../../../../test-utils";
import { Heading } from "../../heading";
import { BlockId } from "../block-id";

test("splitting a node with blockId should generate new blockId for the new node", async () => {
  const el = h("div", [
    h("h1", ["A heading one"], { "data-block-id": "blockid" })
  ]);
  const { editor } = createEditor({
    extensions: {
      heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      blockId: BlockId
    },
    initialContent: el.outerHTML
  });

  editor.commands.setTextSelection(9);
  const event = new KeyboardEvent("keydown", { key: "Enter" });
  editor.view.dom.dispatchEvent(event);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const headings = editor.getJSON().content;
  expect(headings?.[0].attrs?.blockId).toBe("blockid");
  expect(headings?.[1].attrs?.blockId).not.toBeUndefined();
  expect(headings?.[1].attrs?.blockId).not.toBe("blockid");
});
