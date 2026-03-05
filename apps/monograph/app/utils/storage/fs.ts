import { readFile, writeFile } from "node:fs/promises";

export async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    return (JSON.parse(await readFile(key, "utf-8")) as T) || fallback;
  } catch (e) {
    // console.error(e);
    return fallback;
  }
}

export async function write<T>(key: string, data: T) {
  await writeFile(key, JSON.stringify(data));
}
