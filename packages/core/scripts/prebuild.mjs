import "isomorphic-fetch";
import path from "path";
import fs, { mkdir } from "fs/promises";
import { langen } from "../../editor/scripts/langen.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(path.join(__dirname, ".."));

const { languageIndex } = await langen(ROOT_DIR);
if (!languageIndex) throw new Error("No language index found.");

const languagesDir = path.join(
  ROOT_DIR,
  "src",
  "utils",
  "templates",
  "html",
  "languages"
);
await mkdir(languagesDir, { recursive: true });

await fs.writeFile(path.join(languagesDir, "index.ts"), languageIndex);
