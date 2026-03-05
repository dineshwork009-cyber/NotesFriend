import { describe, expect, test } from "vitest";
import { createEditor, h } from "../../../../test-utils";
import { Link, linkRegex } from "../link";

const input = [
  {
    text: "[Example](https://www.google.com)",
    expected: ["[Example](https://www.google.com)"]
  },
  {
    text: "[Example](https://www.example1.com) and [Example2](https://www.example2.com)",
    expected: [
      "[Example](https://www.example1.com)",
      "[Example2](https://www.example2.com)"
    ]
  },
  {
    text: "[]()",
    expected: null
  },
  {
    text: "[] [Link](http://example.com)",
    expected: ["[Link](http://example.com)"]
  },
  {
    text: "[not a link] [Link](http://example.com)",
    expected: ["[Link](http://example.com)"]
  },
  {
    text: "[NoLink]",
    expected: null
  }
];

input.forEach(({ text, expected }, i) => {
  test(`link regex ${text}`, () => {
    const result = text.match(linkRegex);
    expect(result).toEqual(expected);
  });
});

describe("paste text", () => {
  test("with markdown link", async () => {
    const editorElement = h("div");
    const { editor } = createEditor({
      element: editorElement,
      extensions: {
        link: Link
      }
    });

    const clipboardEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
      composed: true
    });

    (clipboardEvent as unknown as any)["clipboardData"] = {
      getData: (type: string) =>
        type === "text/plain" ? "[test](example.com)" : undefined
    };

    editor.view.dom.dispatchEvent(clipboardEvent);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(editorElement.outerHTML).toMatchSnapshot();
  });

  test("with multiple markdown links", async () => {
    const editorElement = h("div");
    const { editor } = createEditor({
      element: editorElement,
      extensions: {
        link: Link
      }
    });

    const clipboardEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
      composed: true
    });

    (clipboardEvent as unknown as any)["clipboardData"] = {
      getData: (type: string) =>
        type === "text/plain"
          ? "[test](example.com) some text [test2](example2.com)"
          : undefined
    };

    editor.view.dom.dispatchEvent(clipboardEvent);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(editorElement.outerHTML).toMatchSnapshot();
  });

  test("with html link", async () => {
    const editorElement = h("div");
    const { editor } = createEditor({
      element: editorElement,
      extensions: {
        link: Link
      }
    });

    const clipboardEvent = new Event("paste", {
      bubbles: true,
      cancelable: true,
      composed: true
    });

    (clipboardEvent as unknown as any)["clipboardData"] = {
      getData: (type: string) =>
        type === "text/html"
          ? `<meta charset='utf-8'><html><head></head><body><a href="nn://note/68798972093c8c6ea22efca2">example.py</a></body></html>`
          : ""
    };

    editor.view.dom.dispatchEvent(clipboardEvent);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(editorElement.outerHTML).toMatchSnapshot();
  });
});
