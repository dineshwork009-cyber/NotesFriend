import { Mark, mergeAttributes } from "@tiptap/core";

export const DiffHighlighter = Mark.create({
  name: "diffHighlighter",

  addAttributes() {
    return {
      class: {
        rendered: true,
        keepOnSplit: false
      },
      type: {
        rendered: false
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "ins.diffins",
        attrs: { class: "diffins", type: "ins" }
      },
      {
        tag: "ins.diffmod",
        attrs: { class: "diffmod", type: "ins" }
      },
      {
        tag: "ins.mod",
        attrs: { class: "mod", type: "ins" }
      },
      {
        tag: "del.diffdel",
        attrs: { class: "diffdel", type: "del" }
      },
      {
        tag: "del.diffmod",
        attrs: { class: "diffmod", type: "del" }
      }
    ];
  },

  renderHTML({ HTMLAttributes, mark }) {
    return [
      `${mark.attrs.type}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: mark.attrs.class
      }),
      0
    ];
  }
});
