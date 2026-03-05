import { test, expect, describe } from "vitest";
import { createEditor, h } from "../../../../test-utils/index.js";
import { Heading } from "../heading.js";
import { Editor } from "@tiptap/core";

test("collapse heading", () => {
  const { editor } = createEditor({
    extensions: {
      heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] })
    },
    initialContent: `
      <h1>Main Heading</h1>
      <p>paragraph.</p>
      <h2>Subheading</h2>
      <p>subheading paragraph</p>
      <h1>Main heading 2</h1>
      <p>paragraph another</p>
    `
  });

  const headingPos = 0;

  editor.commands.command(({ tr }) => {
    tr.setNodeAttribute(headingPos, "collapsed", true);
    return true;
  });

  expect(editor.getHTML()).toMatchSnapshot("heading collapsed");

  editor.commands.command(({ tr }) => {
    tr.setNodeAttribute(headingPos, "collapsed", false);
    return true;
  });

  expect(editor.getHTML()).toMatchSnapshot("heading uncollapsed");
});

test("replacing collapsed heading with another heading level should not unhide content", () => {
  const el = h("div", [
    h("h1", ["A collapsed heading"], { "data-collapsed": "true" }),
    h("p", ["Hidden paragraph"], { "data-hidden": "true" })
  ]);
  const { editor } = createEditor({
    extensions: {
      heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] })
    },
    initialContent: el.outerHTML
  });

  editor.commands.setTextSelection(0);
  editor.commands.setHeading({ level: 2 });

  expect(editor.getHTML()).toMatchSnapshot();
});

const nodes: { name: string; setNode: (editor: Editor) => void }[] = [
  {
    name: "paragraph",
    setNode: (editor) => editor.commands.setParagraph()
  },
  {
    name: "codeBlock",
    setNode: (editor) => editor.commands.setCodeBlock()
  },
  {
    name: "bulletList",
    setNode: (editor) => editor.commands.toggleList("bulletList", "listItem")
  },
  {
    name: "blockquote",
    setNode: (editor) => editor.commands.toggleBlockquote()
  }
];
for (const { name, setNode } of nodes) {
  test(`replacing collapsed heading with another node (${name}) should unhide content`, () => {
    const el = h("div", [
      h("h1", ["A collpased heading"], { "data-collapsed": "true" }),
      h("p", ["Hidden paragraph"], { "data-hidden": "true" })
    ]);
    const { editor } = createEditor({
      extensions: {
        heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] })
      },
      initialContent: el.outerHTML
    });

    editor.commands.setTextSelection(0);
    setNode(editor);

    expect(editor.getHTML()).toMatchSnapshot();
  });
}

test("empty heading should have empty class", () => {
  const { editor } = createEditor({
    extensions: {
      heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] })
    },
    initialContent: "<h1></h1>"
  });

  const headingElement = editor.view.dom.querySelector("h1");
  expect(headingElement?.classList.contains("empty")).toBe(true);

  editor.commands.setTextSelection(0);
  editor.commands.insertContent("Some content");
  expect(headingElement?.classList.contains("empty")).toBe(false);
});

test("converting collapsed heading to lower level should unhide higher level headings", () => {
  const el = h("div", [
    h("h1", ["Level 1 (to be changed)"], { "data-collapsed": "true" }),
    h("h2", ["Level 2"], { "data-hidden": "true", "data-collapsed": "true" }),
    h("p", ["Paragraph under level 2"], { "data-hidden": "true" })
  ]);
  const { editor } = createEditor({
    extensions: {
      heading: Heading.configure({ levels: [1, 2, 3, 4, 5, 6] })
    },
    initialContent: el.outerHTML
  });

  editor.commands.setTextSelection(0);
  editor.commands.setHeading({ level: 3 });

  expect(editor.getHTML()).toMatchSnapshot();
});
