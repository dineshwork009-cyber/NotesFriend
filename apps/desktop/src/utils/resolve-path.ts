import { app } from "electron";
import { isAbsolute, join } from "path";

export function resolvePath(_path: string) {
  if (isAbsolute(_path)) return _path;

  return join(
    ..._path.split("/").map((segment) => {
      let resolved = segment;
      try {
        resolved = app.getPath(resolved as any);
      } catch (e) {
        // ignore
      }
      return resolved;
    })
  );
}
