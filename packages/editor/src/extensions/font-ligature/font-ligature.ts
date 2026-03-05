import { Extension } from "@tiptap/core";

const ligatures = {
  "->": "→",
  "<-": "←",
  "<=": "≤",
  ">=": "≥",
  "!=": "≠",
  "==>": "⟹",
  "<==": "⟸",
  "--": "—"
};

export const FontLigature = Extension.create({
  name: "fontLigature",

  addOptions() {
    return {
      enabled: false
    };
  },

  addInputRules() {
    if (!this.options.enabled) return [];

    return Object.entries(ligatures).map(([from, to]) => ({
      find: new RegExp(`${from}$`),
      handler: ({ state, range }) => {
        const { from: start, to: end } = range;
        state.tr.replaceRangeWith(start, end, state.schema.text(to));
      }
    }));
  }
});
