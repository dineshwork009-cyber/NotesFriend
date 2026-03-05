import { TextSerializer } from "@tiptap/core";
import { Schema, Slice } from "prosemirror-model";
import { ListItem } from "../list-item/index.js";
import { EditorView } from "@tiptap/pm/view";

export function clipboardTextSerializer(content: Slice, view: EditorView) {
  return getTextBetween(content, view.state.schema);
}

export function getTextBetween(slice: Slice, schema: Schema): string {
  const range = { from: 0, to: slice.size };
  const separator = "\n";
  let text = "";
  let separated = true;

  slice.content.nodesBetween(0, slice.size, (node, pos, parent, index) => {
    const textSerializer = schema.nodes[node.type.name]?.spec
      .toText as TextSerializer;

    if (textSerializer) {
      if (node.isBlock && !separated) {
        text += separator;
        separated = true;
      }

      if (parent) {
        text += textSerializer({
          node,
          pos,
          parent,
          index,
          range
        });
      }
    } else if (node.isText) {
      text += node?.text;
      separated = false;
    } else if (node.isBlock && !!text) {
      // we don't want double spaced list items when pasting
      if (index === 0 && parent?.type.name === ListItem.name) return;

      text += separator;
      if (node.attrs.spacing === "double" && node.childCount > 0)
        text += separator;
      separated = true;
    }
  });

  return text;
}
