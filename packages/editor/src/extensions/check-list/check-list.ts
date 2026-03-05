import { mergeAttributes, Node, wrappingInputRule } from "@tiptap/core";
import { inputRegex } from "@tiptap/extension-task-item";
import { getParentAttributes } from "../../utils/prosemirror.js";
import { ListItem } from "../list-item/index.js";
import { tiptapKeys } from "@notesfriend/common";

export interface CheckListOptions {
  itemTypeName: string;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    checkList: {
      /**
       * Toggle a check list
       */
      toggleCheckList: () => ReturnType;
    };
  }
}

export const CheckList = Node.create<CheckListOptions>({
  name: "checkList",

  addOptions() {
    return {
      itemTypeName: "checkListItem",
      HTMLAttributes: {}
    };
  },

  group: "block list",

  content() {
    return `${this.options.itemTypeName}+`;
  },

  parseHTML() {
    return [
      {
        tag: `ul.simple-checklist`,
        priority: 51
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "simple-checklist"
      }),
      0
    ];
  },

  addCommands() {
    return {
      toggleCheckList:
        () =>
        ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        }
    };
  },

  addInputRules() {
    const inputRule = wrappingInputRule({
      find: inputRegex,
      type: this.type,
      getAttributes: () => {
        return getParentAttributes(this.editor, true, true);
      }
    });
    const oldHandler = inputRule.handler;
    inputRule.handler = ({ state, range, match, chain, can, commands }) => {
      const $from = state.selection.$from;
      const parentNode = $from.node($from.depth - 1);
      if (parentNode.type.name !== ListItem.name) {
        return;
      }

      const tr = state.tr;
      // reset nodes before converting them to a check list.
      commands.clearNodes();

      oldHandler({
        state,
        range: {
          from: tr.mapping.map(range.from),
          to: tr.mapping.map(range.to)
        },
        match,
        chain,
        can,
        commands
      });

      tr.setNodeMarkup(state.tr.selection.to - 2, undefined, {
        checked: match[match.length - 1] === "x"
      });
    };
    return [inputRule];
  },

  addKeyboardShortcuts() {
    return {
      [tiptapKeys.toggleCheckList.keys]: () =>
        this.editor.commands.toggleCheckList()
    };
  }
});
