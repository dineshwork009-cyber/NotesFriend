import { rmSync } from "fs";
import path from "path";
import { tmpdir } from "os";

export default async function () {
  return async () => {
    rmSync(path.join(tmpdir(), "notesfriend-tests-tmp"), {
      force: true,
      recursive: true
    });
  };
}
