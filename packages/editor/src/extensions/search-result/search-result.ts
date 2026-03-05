import { Mark, mergeAttributes } from "@tiptap/core";

export const SearchResult = Mark.create({
  name: "search-result",

  parseHTML() {
    return [{ tag: "nn-search-result" }];
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return attributes.id ? { id: attributes.id } : {};
        }
      }
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "nn-search-result",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  }
});
