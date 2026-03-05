import { rm, cp, readdir } from "fs/promises";
import path from "path";

await rm("build.bundle", { recursive: true, force: true });
await rm("sourcemaps", { recursive: true, force: true });

await cp("build", "build.bundle", { recursive: true });
await rm("build", { recursive: true, force: true });

await cp(path.join("build.bundle", "static", "js"), "sourcemaps", {
  recursive: true
});

for (const dirent of await readdir(path.join("build.bundle", "static", "js"), {
  withFileTypes: true
})) {
  if (dirent.isFile() && dirent.name.endsWith(".map")) {
    await rm(path.join("build.bundle", "static", "js", dirent.name));
  }
}
