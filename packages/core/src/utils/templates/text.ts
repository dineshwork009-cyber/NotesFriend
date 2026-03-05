import { TemplateData } from "./index.js";

export function buildText(data: TemplateData) {
  return `${data.title}

${data.content}`;
}
