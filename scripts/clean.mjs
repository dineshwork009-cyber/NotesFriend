import glob from "fast-glob";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Listr } from "listr2";

const allPackages = await glob(["packages/**", "apps/**", "extensions/**"], {
  deep: 1,
  onlyDirectories: true
});

const tasks = new Listr([], { concurrent: 8, exitOnError: false });
for (const pkg of allPackages) {
  for (const dirname of ["node_modules", "dist", "build", "out"]) {
    const dir = path.join(pkg, dirname);
    if (existsSync(dir))
      tasks.add({
        title: "Cleaning " + dir,
        task: () => fs.rm(dir, { recursive: true, force: true })
      });
  }
}

console.time("Took");
await tasks.run();
console.timeEnd("Took");
