import { tiptapKeys } from "@notesfriend/common";
import { Extension } from "@tiptap/core";
import { showLinkPopup } from "../../toolbar/popups/link-popup.js";
import { isListActive } from "../../utils/list.js";
import { CodeBlock } from "../code-block/index.js";
import { isInTable } from "../table/prosemirror-tables/util.js";
import { config } from "../../utils/config.js";
import { DEFAULT_COLORS } from "../../toolbar/tools/colors.js";
import {
  moveNodeUp,
  moveNodeDown,
  moveParentUp,
  moveParentDown
} from "./move-node.js";
import { toggleNodesUnderPos } from "../heading/heading.js";

export const KeyMap = Extension.create({
  name: "key-map",

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (
          isListActive(editor) ||
          isInTable(editor.state) ||
          editor.isActive(CodeBlock.name)
        )
          return false;

        return editor.commands.insertContent("\t");
      },
      "Shift-Tab": ({ editor }) => {
        if (isListActive(editor)) return false;
        return true;
      },
      [tiptapKeys.removeFormattingInSelection.keys]: ({ editor }) => {
        editor
          .chain()
          .focus()
          .clearNodes()
          .unsetAllMarks()
          .unsetMark("link")
          .run();
        return true;
      },
      [tiptapKeys.insertInternalLink.keys]: ({ editor }) => {
        editor.storage.createInternalLink?.().then((link) => {
          if (!link) return;

          const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          );
          editor.commands.setLink({
            ...link,
            title: selectedText || link.title
          });
        });
        return true;
      },
      [tiptapKeys.insertLink.keys]: ({ editor }) => {
        showLinkPopup(editor);
        return true;
      },
      [tiptapKeys.toggleTextColor.keys]: ({ editor }) => {
        const color =
          config.get<"string">("textColor") || DEFAULT_COLORS.text[0];
        return editor.commands.toggleMark("textStyle", { color });
      },
      [tiptapKeys.moveLineUp.keys]: ({ editor }) => {
        try {
          return moveNodeUp(editor);
        } catch (e) {
          console.error("Error moving node up:", e);
          return false;
        }
      },
      [tiptapKeys.moveLineDown.keys]: ({ editor }) => {
        try {
          return moveNodeDown(editor);
        } catch (e) {
          console.error("Error moving node down:", e);
          return false;
        }
      },
      [tiptapKeys.moveNodeUp.keys]: ({ editor }) => {
        try {
          return moveParentUp(editor);
        } catch (e) {
          console.error("Error moving node up:", e);
          return false;
        }
      },
      [tiptapKeys.moveNodeDown.keys]: ({ editor }) => {
        try {
          return moveParentDown(editor);
        } catch (e) {
          console.error("Error moving node down:", e);
          return false;
        }
      },
      [tiptapKeys.clearCurrentLine.keys]: ({ editor }) => {
        const { $from } = editor.state.selection;
        const currentNode = $from.node();

        if (
          currentNode.type.name === "heading" &&
          currentNode.attrs.collapsed === true
        ) {
          return editor.commands.command(({ tr }) => {
            const headingPos = $from.before();
            tr.setNodeAttribute(headingPos, "collapsed", false);
            toggleNodesUnderPos(tr, headingPos, currentNode.attrs.level, false);
            tr.deleteRange(headingPos, headingPos + currentNode.nodeSize);
            return true;
          });
        }

        return editor.commands.deleteNode(currentNode.type);
      }
    };
  }
});
