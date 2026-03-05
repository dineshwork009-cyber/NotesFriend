import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_WATCH = process.argv.includes("--watch");
const TSC =
  process.platform === "win32"
    ? path.join(__dirname, "..", "node_modules", ".bin", "tsc.cmd")
    : path.join(__dirname, "..", "node_modules", ".bin", "tsc");

const TSCGO =
  process.platform === "win32"
    ? path.join(__dirname, "..", "node_modules", ".bin", "tsgo.cmd")
    : path.join(__dirname, "..", "node_modules", ".bin", "tsgo");

const esmPackageJson = {
  type: "module"
};

await Promise.all([
  cmd(
    TSC,
    "--noCheck",
    "--declaration",
    "false",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--outDir",
    "dist/cjs",
    IS_WATCH ? "--watch" : ""
  ),
  cmd(
    TSC,
    "--noCheck",
    "--declaration",
    "false",
    "--module",
    "esnext",
    "--moduleResolution",
    "Bundler",
    "--outDir",
    "dist/esm",
    IS_WATCH ? "--watch" : ""
  ),
  cmd(
    TSC,
    "--emitDeclarationOnly",
    "--outDir",
    "dist/types",
    IS_WATCH ? "--watch" : ""
  ),
  fs
    .mkdir("dist/esm", { recursive: true })
    .then(() =>
      fs.writeFile(
        "dist/esm/package.json",
        JSON.stringify(esmPackageJson, null, 2)
      )
    )
]);

async function cmd(...command) {
  let p = spawn(command[0], command.slice(1), { shell: true });
  console.time(command.join(" "));
  await new Promise((resolveFunc) => {
    p.stdout.on("data", (x) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on("data", (x) => {
      process.stderr.write(x.toString());
    });
    p.on("exit", (code) => {
      // console.log(command.join(" "), "exited with code", code);
      resolveFunc(code);
    });
  });
  console.timeEnd(command.join(" "));
}
