import { readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function patchBetterSQLite3() {
  console.log("Patching better-sqlite3");

  const jsonPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "better-sqlite3-multiple-ciphers",
    "package.json"
  );
  const json = JSON.parse(await readFile(jsonPath, "utf-8"));

  delete json.homepage;
  delete json.repository;

  await writeFile(jsonPath, JSON.stringify(json));

  await rm(
    path.join(
      __dirname,
      "..",
      "node_modules",
      "better-sqlite3-multiple-ciphers",
      "build"
    ),
    { force: true, recursive: true }
  );
}

if (process.argv[1] === __filename) {
  patchBetterSQLite3();
}
