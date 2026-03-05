import { Note } from "../../types.js";
import { buildHTML } from "./html/index.js";
import { buildMarkdown, templateWithFrontmatter } from "./md.js";
import { buildText } from "./text.js";

export type TemplateData = Omit<Note, "tags" | "color"> & {
  tags?: string[];
  color?: string;
  content: string;
};

export async function buildFromTemplate(
  format: "md" | "txt" | "html" | "md-frontmatter",
  data: TemplateData
): Promise<string> {
  switch (format) {
    case "html":
      return buildHTML(data);
    case "md":
      return buildMarkdown(data);
    case "md-frontmatter":
      return templateWithFrontmatter(data);
    case "txt":
      return buildText(data);
    default:
      throw new Error("Unsupported format.");
  }
}
