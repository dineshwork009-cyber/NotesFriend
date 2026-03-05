import { Extension, Editor, findParentNode } from "@tiptap/core";
import "@tiptap/extension-text-style";
import { Paragraph } from "../paragraph/index.js";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { isListActive } from "../../utils/list.js";

export type TextDirections = undefined | "rtl";
const TEXT_DIRECTION_TYPES = [
  "paragraph",
  "heading",
  "orderedList",
  "bulletList",
  "outlineList",
  "checkList",
  "taskList",
  "table",
  "blockquote",
  "embed",
  "image"
];

type TextDirectionOptions = {
  types: string[];
  defaultDirection: TextDirections;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textDirection: {
      /**
       * Set the font family
       */
      setTextDirection: (direction: TextDirections) => ReturnType;
    };
  }
}

export function getTextDirection(editor: Editor): TextDirections {
  const selection = editor.state.selection;

  const parent = findParentNode(
    (node) =>
      !!node.attrs.textDirection && !isTextDirectionIgnored(editor, node)
  )(selection);
  if (!parent) return;
  return parent.node.attrs.textDirection;
}

function isTextDirectionIgnored(editor: Editor, node: ProsemirrorNode) {
  const isInsideList = isListActive(editor);
  const isParagraph = node.type.name === Paragraph.name;
  return isInsideList && isParagraph;
}

export const TextDirection = Extension.create<TextDirectionOptions>({
  name: "textDirection",

  addOptions() {
    return {
      types: TEXT_DIRECTION_TYPES,
      defaultDirection: undefined
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textDirection: {
            // NOTE: for some reason setting this to undefined breaks enter behaviour
            // on Android for some keyboards (GBoard etc.). Empty string works fine.
            default: this.options.defaultDirection || "",
            parseHTML: (element) => (element.dir === "rtl" ? "rtl" : undefined),
            keepOnSplit: true,
            renderHTML: (attributes) => {
              if (
                !attributes.textDirection ||
                attributes.textDirection !== "rtl"
              ) {
                return {};
              }

              return {
                dir: attributes.textDirection
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextDirection:
        (direction) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { textDirection: direction })
          );
        }
    };
  }
});
