import { cp } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await cp(
  path.join(__dirname, "..", "locales"),
  path.join(__dirname, "..", "dist/locales"),
  {
    recursive: true
  }
);
