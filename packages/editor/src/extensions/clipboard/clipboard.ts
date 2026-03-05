import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Slice } from "prosemirror-model";
import { LIST_NODE_TYPES } from "../../utils/node-types.js";
import { ClipboardDOMParser } from "./clipboard-dom-parser.js";
import { ClipboardDOMSerializer } from "./clipboard-dom-serializer.js";
import { clipboardTextParser } from "./clipboard-text-parser.js";
import { clipboardTextSerializer } from "./clipboard-text-serializer.js";
import { EditorView } from "prosemirror-view";

export const Clipboard = Extension.create({
  name: "clipboard",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("clipboard"),
        props: {
          clipboardParser: ClipboardDOMParser.fromSchema(this.editor.schema),
          clipboardSerializer: ClipboardDOMSerializer.fromSchema(
            this.editor.schema
          ),
          transformCopied,
          clipboardTextParser,
          clipboardTextSerializer
        }
      })
    ];
  }
});

export function transformCopied(slice: Slice, view: EditorView): any {
  // when copying a single list item, we shouldn't retain the
  // list formatting but copy it as a paragraph.
  const maybeList = slice.content.firstChild;
  if (
    slice.content.childCount === 1 &&
    maybeList &&
    LIST_NODE_TYPES.includes(maybeList.type.name) &&
    maybeList.childCount === 1 &&
    maybeList.firstChild
  ) {
    return transformCopied(Slice.maxOpen(maybeList.firstChild.content), view);
  }

  return slice;
}
