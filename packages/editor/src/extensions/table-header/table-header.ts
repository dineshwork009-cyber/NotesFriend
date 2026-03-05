import { mergeAttributes, Node } from "@tiptap/core";
import { addTableCellAttributes } from "../table-cell/table-cell.js";

export interface TableHeaderOptions {
  /**
   * The HTML attributes for a table header node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

/**
 * This extension allows you to create table headers.
 * @see https://www.tiptap.dev/api/nodes/table-header
 */
export const TableHeader = Node.create<TableHeaderOptions>({
  name: "tableHeader",

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  content: "block+",

  addAttributes() {
    return addTableCellAttributes();
  },

  tableRole: "header_cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "th" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "th",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  }
});
