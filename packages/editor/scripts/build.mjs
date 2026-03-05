import "isomorphic-fetch";
import path from "path";
import fs, { mkdirSync } from "fs";
import { langen } from "./langen.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(path.join(__dirname, ".."));

const pathsToCopy = {
  "katex.min.css": "node_modules/katex/dist/katex.min.css",
  "fonts/": "node_modules/katex/dist/fonts/"
};

for (const name in pathsToCopy) {
  const src = pathsToCopy[name];
  const fullPath = path.join(ROOT_DIR, src);
  fs.cpSync(fullPath, path.join(ROOT_DIR, "styles", name), {
    force: true,
    recursive: true,
    errorOnExist: false
  });
}

const { languageIndex, languages } = await langen(ROOT_DIR);

if (!languageIndex || !languages) throw new Error("No language index found.");
const languagesDir = path.join(
  ROOT_DIR,
  "src",
  "extensions",
  "code-block",
  "languages"
);
mkdirSync(languagesDir, { recursive: true });

fs.writeFileSync(path.join(languagesDir, "index.ts"), languageIndex);

fs.writeFileSync(
  path.join(ROOT_DIR, "src", "extensions", "code-block", "languages.json"),
  JSON.stringify(languages)
);
