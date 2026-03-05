import { Icons } from "@notesfriend/editor/dist/cjs/toolbar/icons";
import { ToolbarGroupDefinition } from "@notesfriend/editor";
import {
  getAllTools,
  getDefaultPresets
} from "@notesfriend/editor/dist/cjs/toolbar/tool-definitions";
import { ToolId } from "@notesfriend/editor";

export const tools = getAllTools() as any;
export const presets: { [name: string]: ToolbarGroupDefinition[] } = {
  default: getDefaultPresets().default as any,
  minimal: getDefaultPresets().minimal as any,
  custom: []
};

export function findToolById(id: keyof typeof tools): {
  title: string;
  icon: string;
} {
  return tools[id];
}

export function getToolIcon(id: ToolId, color: string) {
  const icon = Icons[id as keyof typeof Icons];

  return (id as "none") === "none"
    ? null
    : `<svg width="20" height="20"  >
  <path d="${icon}" fill="${color}" />
</svg>`;
}

export function getUngroupedTools(
  toolDefinition: (string | string[])[][]
): string[] {
  const keys = Object.keys(tools);

  const ungrouped = [];
  const toolString = JSON.stringify(toolDefinition);
  for (const key of keys) {
    if (tools[key as ToolId].conditional) continue;
    if (!toolString.includes(key)) ungrouped.push(key);
  }

  return ungrouped;
}
