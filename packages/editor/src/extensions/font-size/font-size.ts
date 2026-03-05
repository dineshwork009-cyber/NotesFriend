import { tiptapKeys } from "@notesfriend/common";
import { useToolbarStore } from "../../toolbar/stores/toolbar-store.js";
import { Editor, Extension } from "@tiptap/core";

type FontSizeOptions = {
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font family
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font family
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",

  defaultOptions: {
    types: ["textStyle"]
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        }
    };
  },
  addKeyboardShortcuts() {
    return {
      [tiptapKeys.decreaseFontSize.keys]: ({ editor }) => {
        editor
          .chain()
          .focus()
          .setFontSize(`${Math.min(120, getFontSize(editor) + 1)}px`)
          .run();
        return true;
      },
      [tiptapKeys.increaseFontSize.keys]: ({ editor }) => {
        editor
          .chain()
          .focus()
          .setFontSize(`${Math.max(8, getFontSize(editor) - 1)}px`)
          .run();
        return true;
      }
    };
  }
});

function getFontSize(editor: Editor) {
  const defaultFontSize = useToolbarStore.getState().fontSize;
  const { fontSize } = editor.getAttributes("textStyle");
  return fontSize
    ? parseInt(fontSize.replace("px", "")) || 14
    : defaultFontSize;
}
