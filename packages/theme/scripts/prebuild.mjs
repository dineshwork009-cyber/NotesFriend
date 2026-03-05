import "isomorphic-fetch";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_THEMES = ["default-light", "default-dark"];

const THEMES_DIRECTORY = path.resolve(
  path.join(__dirname, "..", "src", "theme-engine", "themes")
);

const THEME_COMPATIBILITY_VERSION = 1;

async function main() {
  await mkdir(THEMES_DIRECTORY, { recursive: true });

  for (const themeId of DEFAULT_THEMES) {
    const themePath = path.join(THEMES_DIRECTORY, `${themeId}.json`);
    if (existsSync(themePath)) continue;
    console.log("Getting", themeId);

    const BASE_URL = `https://raw.githubusercontent.com/streetwriters/notesfriend-themes/main/themes/${themeId}/v${THEME_COMPATIBILITY_VERSION}`;
    const theme = await fetch(`${BASE_URL}/theme.json`).then((r) => r.json());
    const codeBlockCSS = await fetch(`${BASE_URL}/code-block.css`).then((r) =>
      r.text()
    );
    if (!theme) continue;

    await writeFile(
      path.join(THEMES_DIRECTORY, `${themeId}.json`),
      JSON.stringify({ ...theme, $schema: undefined, codeBlockCSS })
    );
  }
}

main();
