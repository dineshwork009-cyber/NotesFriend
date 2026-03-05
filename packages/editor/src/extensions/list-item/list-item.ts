import { ListItem as TiptapListItem } from "@tiptap/extension-list-item";
import { ensureLeadingParagraph } from "../../utils/prosemirror.js";

export const ListItem = TiptapListItem.extend({
  parseHTML() {
    return [
      {
        priority: 50,
        tag: `li`,
        getContent: ensureLeadingParagraph
      }
    ];
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: (props) => {
        const { editor } = props;
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === "codeblock") return false;

        return this.parent?.()?.Tab(props) || false;
      }
    };
  }
});
