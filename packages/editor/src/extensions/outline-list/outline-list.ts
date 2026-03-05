import { tiptapKeys } from "@notesfriend/common";
import { hasPermission } from "../../types.js";
import { getParentAttributes } from "../../utils/prosemirror.js";
import { Node, mergeAttributes, wrappingInputRule } from "@tiptap/core";

export type OutlineListAttributes = {
  collapsed: boolean;
};

export interface OutlineListOptions {
  HTMLAttributes: Record<string, unknown>;
  keepMarks: boolean;
  keepAttributes: boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    outlineList: {
      /**
       * Toggle a bullet list
       */
      toggleOutlineList: () => ReturnType;
    };
  }
}

const inputRegex = /^\s*(-o)\s$/;
const outlineListItemName = "outlineListItem";
export const OutlineList = Node.create<OutlineListOptions>({
  name: "outlineList",

  addOptions() {
    return {
      HTMLAttributes: {},
      keepMarks: false,
      keepAttributes: false
    };
  },

  group: "block list",

  content: `${outlineListItemName}+`,

  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 52
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name
      }),
      0
    ];
  },

  addCommands() {
    return {
      toggleOutlineList:
        () =>
        ({ chain }) => {
          if (!hasPermission("toggleOutlineList")) return false;

          return chain()
            .toggleList(
              this.name,
              outlineListItemName,
              this.options.keepMarks,
              getParentAttributes(
                this.editor,
                this.options.keepMarks,
                this.options.keepAttributes
              )
            )
            .run();
        }
    };
  },

  addKeyboardShortcuts() {
    return {
      [tiptapKeys.toggleOutlineList.keys]: () =>
        this.editor.commands.toggleOutlineList()
    };
  },

  addInputRules() {
    const inputRule = wrappingInputRule({
      find: inputRegex,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      editor: this.editor,
      getAttributes: () => {
        return getParentAttributes(
          this.editor,
          this.options.keepMarks,
          this.options.keepAttributes
        );
      }
    });
    const oldHandler = inputRule.handler;
    inputRule.handler = ({ state, range, match, chain, can, commands }) => {
      if (!hasPermission("toggleOutlineList", true)) return;

      oldHandler({
        state,
        range,
        match,
        chain,
        can,
        commands
      });
    };

    return [inputRule];
  },
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const ul = document.createElement("ul");
      ul.classList.add("outline-list");
      if (node.attrs.textDirection) ul.dir = node.attrs.textDirection;
      for (const key in HTMLAttributes)
        ul.setAttribute(key, HTMLAttributes[key]);
      return {
        dom: ul,
        contentDOM: ul
      };
    };
  }
});
