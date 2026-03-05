import { path } from "@notesnook-importer/core/dist/src/utils/path";

export function makeUniqueFilename(
  filePath: string,
  counters: Record<string, number>
) {
  const matchablePath = filePath.toLowerCase();
  const count = (counters[matchablePath] = (counters[matchablePath] || 0) + 1);
  if (count === 1) return filePath;

  const ext = path.extname(filePath);
  const basename = ext
    ? `${path.basename(filePath, ext)}-${count}${ext}`
    : `${path.basename(filePath)}-${count}`;
  return path.join(path.dirname(filePath), basename);
}
