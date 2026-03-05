import TiptapBulletList from "@tiptap/extension-bullet-list";
import { wrappingInputRule } from "@tiptap/core";
import { getParentAttributes } from "../../utils/prosemirror.js";

export const inputRegex = /^\s*([-+*])\s$/;
export const BulletList = TiptapBulletList.extend({
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
      toggleBulletList:
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
        getAttributes: () => {
          return getParentAttributes(
            this.editor,
            this.options.keepMarks,
            this.options.keepAttributes
          );
        }
      })
    ];
  }
});
