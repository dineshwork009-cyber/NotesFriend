console.log("starting build...");
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import yargs from "yargs-parser";
import os from "os";
import * as childProcess from "child_process";
import { fileURLToPath } from "url";
import { patchBetterSQLite3 } from "./patch-better-sqlite3.mjs";

console.log("imports done...");
const args = yargs(process.argv);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = args.root || path.join(__dirname, "..");
const skipTscBuild = args.skipTscBuild || false;

const webAppPath = path.resolve(path.join(__dirname, "..", "..", "web"));

console.log("loaded args", {
  args,
  __filename,
  __dirname,
  root,
  skipTscBuild,
  webAppPath
});
await fs.rm(path.join(root, "build"), { force: true, recursive: true });

console.log("removed build folder");

if (args.rebuild || !existsSync(path.join(webAppPath, "build"))) {
  console.log("rebuilding...");
  await exec(
    "node scripts/execute.mjs @notesfriend/web:build:desktop",
    path.join(__dirname, "..", "..", "..")
  );
}

await patchBetterSQLite3();

await fs.cp(path.join(webAppPath, "build"), path.join(root, "build"), {
  recursive: true,
  force: true
});

if (args.variant === "mas") {
  await exec(`yarn run bundle:mas --outdir=${path.join(root, "build")}`);
} else {
  await exec(`yarn run bundle --outdir=${path.join(root, "build")}`);
}

if (!skipTscBuild) {
  await exec(`yarn run build`);
}

if (args.run) {
  await exec(
    `yarn electron-builder --dir --${process.arch} --config=electron-builder.config.js`
  );
  if (process.platform === "win32") {
    await exec(`.\\output\\win-unpacked\\Notesfriend.exe`);
  } else if (process.platform === "darwin") {
    if (process.arch === "arm64")
      await exec(`./output/mac-arm64/Notesfriend.app/Contents/MacOS/Notesfriend`);
    else await exec(`./output/mac/Notesfriend.app/Contents/MacOS/Notesfriend`);
  } else {
    await exec(`./output/linux-unpacked/Notesfriend`);
  }
}

async function exec(cmd, cwd) {
  return childProcess.execSync(cmd, {
    env: { ...process.env, NOTESFRIEND_STAGING: true },
    stdio: "inherit",
    cwd: cwd || process.cwd()
  });
}
