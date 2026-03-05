import { getDefaultPresets, ToolbarGroupDefinition } from "@notesfriend/editor";
import { db } from "./db";
import { CURRENT_TOOLBAR_VERSION, migrateToolbar } from "@notesfriend/common";
import { strings } from "@notesfriend/intl";

const defaultPresets = getDefaultPresets();
export type PresetId = "default" | "minimal" | "custom";
export type Preset = {
  id: PresetId;
  title: string;
  tools: ToolbarGroupDefinition[];
  editable?: boolean;
};
const presets: Record<PresetId, Preset> = {
  default: {
    id: "default",
    title: strings.default(),
    tools: defaultPresets.default
  },
  minimal: {
    id: "minimal",
    title: strings.minimal(),
    tools: defaultPresets.minimal
  },
  custom: { id: "custom", title: strings.custom(), tools: [], editable: true }
};

export async function getCurrentPreset() {
  let preset = db.settings.getToolbarConfig("desktop");
  if (!preset) return presets.default;
  preset = await migrateToolbar("desktop", preset);

  switch (preset.preset as PresetId) {
    case "custom":
      presets.custom.tools = preset.config || [];
      return presets.custom;
    case "minimal":
      return presets.minimal;
    default:
    case "default":
      return presets.default;
  }
}

export function getAllPresets() {
  return Object.values(presets);
}

export function getPreset(id: PresetId) {
  return presets[id];
}

export function getPresetTools(preset: Preset) {
  return preset.tools;
}

export async function setToolbarPreset(
  id: PresetId,
  tools?: ToolbarGroupDefinition[]
) {
  const currentPreset = await getCurrentPreset();
  await db.settings.setToolbarConfig("desktop", {
    version: CURRENT_TOOLBAR_VERSION,
    preset: id,
    config: id === "custom" ? tools : currentPreset.tools
  });
}
