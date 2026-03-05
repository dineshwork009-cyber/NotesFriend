import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { insertMathNode } from "./plugin/index.js";
import { NodeSelection } from "prosemirror-state";
import { tiptapKeys } from "@notesfriend/common";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathBlock: {
      insertMathBlock: () => ReturnType;
    };
  }
}

// simple inputrule for block math
const REGEX_BLOCK_MATH_DOLLARS = /\$\$\$\s+$/; //new RegExp("\$\$\s+$", "i");
const REGEX_PASTE_BLOCK_MATH_DOLLARS = /\$\$\$([\s\S]*?)\$\$\$/g;

export const MathBlock = Node.create({
  name: "mathBlock",
  group: "block math",
  content: "text*", // important!
  atom: true, // important!
  code: true,

  parseHTML() {
    return [
      {
        tag: "div[class*='math-block']" // important!
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ class: "math-block math-node" }, HTMLAttributes),
      0
    ];
  },

  addCommands() {
    return {
      insertMathBlock:
        () =>
        ({ state, dispatch, view }) => {
          return insertMathNode(this.type)(state, dispatch, view);
        }
    };
  },

  addKeyboardShortcuts() {
    return {
      [tiptapKeys.insertMathBlock.keys]: () =>
        this.editor.commands.insertMathBlock()
    };
  },

  addInputRules() {
    return [
      {
        find: REGEX_BLOCK_MATH_DOLLARS,
        handler: ({ state, range }) => {
          const { from: start, to: end } = range;
          const $start = state.doc.resolve(start);
          if (
            !$start
              .node(-1)
              .canReplaceWith(
                $start.index(-1),
                $start.indexAfter(-1),
                this.type
              )
          )
            return null;
          const tr = state.tr
            .delete(start, end)
            .setBlockType(start, start, this.type, null);

          tr.setSelection(
            NodeSelection.create(tr.doc, tr.mapping.map($start.pos - 1))
          );
        }
      }
    ];
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: REGEX_PASTE_BLOCK_MATH_DOLLARS,
        type: this.type,
        getAttributes: (match) => {
          return { content: match[1] };
        },
        getContent: (attrs) => {
          return attrs.content ? [{ type: "text", text: attrs.content }] : [];
        }
      })
    ];
  }
});
