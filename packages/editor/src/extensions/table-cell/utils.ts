import { Attribute } from "@tiptap/core";

export function addStyleAttribute(
  name: keyof CSSStyleDeclaration,
  cssName: string,
  unit?: string
): Partial<Attribute> {
  return {
    default: null,
    parseHTML: (element) =>
      unit
        ? element.style[name]?.toString().replace(unit, "")
        : element.style[name],
    renderHTML: (attributes) => {
      if (!attributes[name as string]) {
        return {};
      }

      return {
        style: `${cssName}: ${attributes[name as string]}${unit || ""}`
      };
    }
  };
}
