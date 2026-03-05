import { Editor, AnyExtension, Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { builders, NodeBuilder } from "prosemirror-test-builder";
import { Schema } from "@tiptap/pm/model";

type Builder<TNodes extends string> = {
  scheme: Schema;
} & Record<TNodes, NodeBuilder>;

type EditorOptions<TNodes extends string> = {
  element?: HTMLElement;
  extensions: Record<TNodes, AnyExtension | false>;
  initialContent?: string;
};

export function createEditor<TNodes extends string>(
  options: EditorOptions<TNodes>
) {
  const { extensions, initialContent, element } = options;
  const editor = new Editor({
    element,
    content: initialContent,
    extensions: [
      StarterKit.configure({
        ...Object.entries(extensions).reduce(
          (prev, [name]) => ({
            ...prev,
            [name]: false
          }),
          {}
        )
      }),
      ...(Object.values(extensions) as Extensions)
    ]
  });

  const builder = builders(editor.schema) as unknown as Builder<TNodes>;

  return { editor, builder };
}

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  children: (HTMLElement | string)[] = [],
  attr: Record<string, string | undefined> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.append(
    ...children.map((v) =>
      typeof v === "string" ? document.createTextNode(v) : v
    )
  );
  for (const key in attr) {
    const value = attr[key];
    if (value) element.setAttribute(key, value);
  }
  return element;
}

function elem<K extends keyof HTMLElementTagNameMap>(tag: K) {
  return function (
    children: (HTMLElement | string)[] = [],
    attr: Record<string, string | undefined> = {}
  ): HTMLElementTagNameMap[K] {
    return h(tag, children, attr);
  };
}

export const ul = elem("ul");
export const li = elem("li");
export const p = elem("p");

export function text(text: string) {
  return document.createTextNode(text);
}

export function outlineList(...children: HTMLLIElement[]) {
  return ul(children, { "data-type": "outlineList" });
}

export function outlineListItem(
  paragraphChildren: (string | HTMLElement)[],
  subList?: HTMLUListElement
) {
  const children: HTMLElement[] = [h("p", paragraphChildren)];
  if (subList) children.push(subList);

  return li(children, {
    "data-type": "outlineListItem"
  });
}

export function taskList(...children: HTMLLIElement[]) {
  return ul(children, { class: "checklist" });
}

export function taskItem(
  paragraphChildren: (string | HTMLElement)[],
  attr: { checked?: boolean } = {},
  subList?: HTMLUListElement
) {
  const children: HTMLElement[] = [h("p", paragraphChildren)];
  if (subList) children.push(subList);

  return li(children, {
    class: "checklist--item " + (attr.checked ? "checked" : "")
  });
}

export function checkList(...children: HTMLLIElement[]) {
  return ul(children, { class: "simple-checklist" });
}

export function checkListItem(
  paragraphChildren: (string | HTMLElement)[],
  subList?: HTMLUListElement
) {
  const children: HTMLElement[] = [h("p", paragraphChildren)];
  if (subList) children.push(subList);

  return li(children, {
    class: "simple-checklist--item "
  });
}
