import { ToolbarConfig, ToolbarConfigPlatforms } from "@notesfriend/core";
import { database } from "../database.js";

export const CURRENT_TOOLBAR_VERSION = 2;
export async function migrateToolbar(
  platform: ToolbarConfigPlatforms,
  tools: ToolbarConfig
) {
  const version = tools.version || 0;
  if (version === CURRENT_TOOLBAR_VERSION) return tools;

  tools = runMigration(version, platform, tools);
  await database.settings.setToolbarConfig(platform, tools);
  return tools;
}

function runMigration(
  version: number,
  platform: ToolbarConfigPlatforms,
  tools: ToolbarConfig
) {
  switch (version) {
    case 0: {
      tools.config?.push(["checkList"]);
      return runMigration(1, platform, tools);
    }
    case 1: {
      const group = tools.config?.find(
        (g) => Array.isArray(g) && g.includes("addLink")
      );
      if (!group) tools.config?.push(["addInternalLink"]);
      else if (!group.includes("addInternalLink"))
        group.push("addInternalLink");

      return runMigration(2, platform, tools);
    }
    case CURRENT_TOOLBAR_VERSION:
    default:
      break;
  }
  tools.version = CURRENT_TOOLBAR_VERSION;
  return tools;
}
