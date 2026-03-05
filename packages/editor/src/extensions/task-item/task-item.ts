import { mergeAttributes } from "@tiptap/core";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskItemComponent } from "./component.js";
import { createNodeView } from "../react/index.js";
import { ensureLeadingParagraph } from "../../utils/prosemirror.js";

export type TaskItemAttributes = {
  checked: boolean;
};

export const TaskItemNode = TaskItem.extend({
  draggable: true,

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.classList.contains("checked"),
        renderHTML: (attributes) => ({
          class: attributes.checked ? "checked" : ""
        })
      }
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "checklist--item"
      }),
      0
    ];
  },

  parseHTML() {
    return [
      {
        tag: ".checklist > li",
        priority: 100,
        getContent: ensureLeadingParagraph
      }
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.()
    };
  },

  addNodeView() {
    return createNodeView(TaskItemComponent, {
      contentDOMFactory: true,
      wrapperFactory: () => {
        const li = document.createElement("li");
        li.dataset.dragImage = "true";
        return li;
      },
      shouldUpdate: ({ attrs: prev }, { attrs: next }) => {
        return prev.checked !== next.checked;
      }
    });
  },

  addInputRules() {
    return [];
  }
});
