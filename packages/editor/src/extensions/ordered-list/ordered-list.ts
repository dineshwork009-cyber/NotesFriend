import { wrappingInputRule } from "@tiptap/core";
import TiptapOrderedList, { inputRegex } from "@tiptap/extension-ordered-list";
import { getParentAttributes } from "../../utils/prosemirror.js";

export const OrderedList = TiptapOrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: null,
        parseHTML: (element) => element.style.listStyleType,
        renderHTML: (attributes) => {
          if (!attributes.listType) {
            return {};
          }

          return {
            style: `list-style-type: ${attributes.listType}`
          };
        }
      }
    };
  },

  addCommands() {
    return {
      toggleOrderedList:
        () =>
        ({ chain }) => {
          return chain()
            .toggleList(
              this.name,
              this.options.itemTypeName,
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

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
        keepMarks: this.options.keepMarks,
        keepAttributes: this.options.keepAttributes,
        editor: this.editor,
        joinPredicate: (match, node) =>
          node.childCount + node.attrs.start === +match[1],
        getAttributes: (match) => {
          return {
            ...getParentAttributes(
              this.editor,
              this.options.keepMarks,
              this.options.keepAttributes
            ),
            start: +match[1]
          };
        }
      })
    ];
  }
});
