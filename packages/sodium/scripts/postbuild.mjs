import { cp } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await cp(
  path.join(__dirname, "..", "src", "@types"),
  path.join(__dirname, "..", "dist", "@types"),
  { recursive: true, force: true }
);
