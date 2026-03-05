import { execSync } from "child_process";
import fs from "node:fs";
import { readdir, readFile } from "fs/promises";
import path from "path";
import {
  InstallsCounter,
  THEMES_REPO_URL,
  THEME_REPO_DIR_PATH
} from "./constants";
import { insertMultiple } from "@orama/orama";
import { initializeDatabase } from "./orama";
import {
  ThemeCompatibilityVersion,
  ThemeDefinition,
  PreviewColors,
  getPreviewColors
} from "@notesfriend/theme";

export type CompiledThemeDefinition = ThemeDefinition & {
  sourceURL?: string;
  totalInstalls?: number;
  previewColors: PreviewColors;
};

export type ThemeMetadata = Omit<
  CompiledThemeDefinition,
  "scopes" | "codeBlockCSS"
>;

const THEME_COMPATIBILITY_VERSIONS: ThemeCompatibilityVersion[] = [1];

export async function syncThemes() {
  if (!fs.existsSync(THEME_REPO_DIR_PATH)) {
    execSync(`git clone ${THEMES_REPO_URL}`, {
      stdio: [0, 1, 2],
      cwd: path.dirname(THEME_REPO_DIR_PATH)
    });
    console.log(`Cloned github repo to path ${THEME_REPO_DIR_PATH}`);
  } else {
    execSync(`git pull`, {
      stdio: [0, 1, 2],
      cwd: THEME_REPO_DIR_PATH
    });
    console.log(`Synced github repo ${THEMES_REPO_URL}`);
  }
  await generateThemesMetadata();
}

async function generateThemesMetadata() {
  const themeDefinitions: CompiledThemeDefinition[] = [];
  const db = await initializeDatabase();

  const THEMES_PATH = path.join(THEME_REPO_DIR_PATH, "themes");
  const themes = await readdir(THEMES_PATH);

  for (const themeId of themes) {
    for (const version of THEME_COMPATIBILITY_VERSIONS) {
      const themeDirectory = path.join(THEMES_PATH, themeId, `v${version}`);
      const themeFilePath = path.join(themeDirectory, "theme.json");
      const theme: ThemeDefinition = JSON.parse(
        await readFile(themeFilePath, "utf-8")
      );
      const hasCodeBlockCSS = fs.existsSync(
        path.join(themeDirectory, "code-block.css")
      );
      const codeBlockCSS = await readFile(
        path.join(
          THEMES_PATH,
          hasCodeBlockCSS ? themeId : `default-${theme.colorScheme}`,
          `v${version}`,
          "code-block.css"
        ),
        "utf-8"
      );

      themeDefinitions.push({
        ...theme,
        sourceURL: `https://github.com/streetwriters/notesfriend-themes/tree/main/themes/${themeId}/v${version}/`,
        codeBlockCSS,
        totalInstalls: 0,
        previewColors: getPreviewColors(theme)
      });
    }
  }
  const installs = await InstallsCounter.counts(
    themeDefinitions.map((t) => t.id)
  );
  for (const theme of themeDefinitions) {
    theme.totalInstalls = installs[theme.id] || 0;
  }
  await insertMultiple(db, themeDefinitions);
  console.log("Metadata generated and cached.");
}
