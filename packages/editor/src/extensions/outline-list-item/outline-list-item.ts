import {
  Node,
  mergeAttributes,
  findParentNodeClosestToPos
} from "@tiptap/core";
import {
  findParentNodeOfTypeClosestToPos,
  isClickWithinBounds,
  ensureLeadingParagraph
} from "../../utils/prosemirror.js";
import { OutlineList } from "../outline-list/outline-list.js";
import { keybindings, tiptapKeys } from "@notesfriend/common";
import { Paragraph } from "../paragraph/paragraph.js";

export interface ListItemOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const OutlineListItem = Node.create<ListItemOptions>({
  name: "outlineListItem",

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      collapsed: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.dataset.collapsed === "true",
        renderHTML: (attributes) => ({
          "data-collapsed": attributes.collapsed === true
        })
      }
    };
  },

  content: "paragraph block*",

  defining: true,

  parseHTML() {
    return [
      {
        priority: 100,
        tag: `li[data-type="${this.name}"]`,
        getContent: ensureLeadingParagraph
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name
      }),
      0
    ];
  },

  addKeyboardShortcuts() {
    return {
      [tiptapKeys.toggleOutlineListExpand.keys]: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, empty } = selection;

        if (!empty) return false;

        const listItem = findParentNodeOfTypeClosestToPos($from, this.type);
        if (!listItem) return false;

        const isCollapsed = listItem.node.attrs.collapsed;

        return editor.commands.command(({ tr }) => {
          tr.setNodeAttribute(listItem.pos, "collapsed", !isCollapsed);
          return true;
        });
      },
      Enter: ({ editor }) => {
        const { $anchor } = editor.state.selection;
        if (
          $anchor.parent.type.name !== Paragraph.name ||
          ($anchor.parent.type.name === Paragraph.name &&
            $anchor.node($anchor.depth - 1)?.type.name !== this.type.name)
        )
          return false;

        return this.editor.commands.splitListItem(this.name);
      },
      Tab: ({ editor }) => {
        const { $anchor } = editor.state.selection;
        if (
          $anchor.parent.type.name !== Paragraph.name ||
          ($anchor.parent.type.name === Paragraph.name &&
            $anchor.node($anchor.depth - 1)?.type.name !== this.type.name)
        )
          return false;
        return this.editor.commands.sinkListItem(this.name);
      },
      [keybindings.liftListItem.keys]: ({ editor }) => {
        const { $anchor } = editor.state.selection;
        if (
          $anchor.parent.type.name !== Paragraph.name ||
          ($anchor.parent.type.name === Paragraph.name &&
            $anchor.node($anchor.depth - 1)?.type.name !== this.type.name)
        )
          return false;
        return this.editor.commands.liftListItem(this.name);
      }
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const isNested = node.lastChild?.type.name === OutlineList.name;

      const li = document.createElement("li");

      if (node.attrs.collapsed) li.classList.add("collapsed");
      else li.classList.remove("collapsed");

      if (isNested) li.classList.add("nested");
      else li.classList.remove("nested");

      function onClick(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent && e.button !== 0) return;
        if (!(e.target instanceof HTMLElement)) return;
        if (!li.classList.contains("nested")) return;

        const pos = typeof getPos === "function" ? getPos() : 0;
        if (typeof pos !== "number") return;

        const resolvedPos = editor.state.doc.resolve(pos);
        if (isClickWithinBounds(e, resolvedPos, "left")) {
          e.preventDefault();
          e.stopImmediatePropagation();
          editor.commands.command(({ tr }) => {
            tr.setNodeAttribute(
              pos,
              "collapsed",
              !li.classList.contains("collapsed")
            );
            return true;
          });
        }
      }

      li.onmousedown = onClick;
      li.ontouchstart = onClick;

      return {
        dom: li,
        contentDOM: li,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }
          const isNested =
            updatedNode.lastChild?.type.name === OutlineList.name;

          if (updatedNode.attrs.collapsed) li.classList.add("collapsed");
          else li.classList.remove("collapsed");

          if (isNested) li.classList.add("nested");
          else li.classList.remove("nested");

          return true;
        }
      };
    };
  }
});
