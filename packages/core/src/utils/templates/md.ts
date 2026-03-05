import { TemplateData } from "./index.js";
import { formatDate } from "../date.js";

export const buildMarkdown = (data: TemplateData) => `# ${data.title}

${data.content}`;

export const templateWithFrontmatter = (data: TemplateData) => `---
${buildFrontmatter(data)}
---

# ${data.title}

${data.content}`;

function buildFrontmatter(data: TemplateData) {
  const lines = [
    `title: ${JSON.stringify(data.title || "")}`,
    `created_at: ${formatDate(data.dateCreated)}`,
    `updated_at: ${formatDate(data.dateEdited)}`
  ];
  if (data.pinned) lines.push(`pinned: ${data.pinned}`);
  if (data.favorite) lines.push(`favorite: ${data.favorite}`);
  if (data.archived) lines.push(`archived: ${data.archived}`);
  if (data.color) lines.push(`color: ${data.color}`);
  if (data.tags) lines.push(`tags: ${data.tags.join(", ")}`);
  return lines.join("\n");
}
