import { tiptapKeys } from "@notesfriend/common";
import { getParentAttributes } from "../../utils/prosemirror.js";
import { wrappingInputRule } from "@tiptap/core";
import TiptapBlockquote, { inputRegex } from "@tiptap/extension-blockquote";

export const Blockquote = TiptapBlockquote.extend({
  addCommands() {
    return {
      setBlockquote:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name, getParentAttributes(this.editor));
        },
      toggleBlockquote:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(
            this.name,
            getParentAttributes(this.editor)
          );
        }
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: () => getParentAttributes(this.editor)
      })
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      [tiptapKeys.insertBlockquote.keys]: () =>
        this.editor.commands.toggleBlockquote()
    };
  }
});
