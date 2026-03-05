import { expect, test } from "vitest";
import { createEditor, h } from "../../../../test-utils/index.js";
import { Link } from "../../link/link.js";
import { InlineCode } from "../inline-code";

test("inline code has spellcheck disabled", async () => {
  const el = h("code", ["blazingly fast javascript"]);
  const editor = createEditor({
    initialContent: el.outerHTML,
    extensions: {
      link: Link,
      code: InlineCode
    }
  });
  expect(
    editor.editor.view.dom.querySelector("code")?.getAttribute("spellcheck")
  ).toBe("false");
});
