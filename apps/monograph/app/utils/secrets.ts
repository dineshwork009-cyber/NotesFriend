import { readFileSync } from "node:fs";

export function readSecrets<T extends string>(
  names: T[]
): Record<T, string | undefined> {
  const result: Record<T, string | undefined> = {} as Record<
    T,
    string | undefined
  >;
  for (const name of names) result[name] = readSecret(name);
  return result;
}

export function readSecret(name: string): string | undefined {
  const value = process.env[name];
  if (value) return value;
  const file = process.env[`${name}_FILE`];
  if (file) {
    return readFileSync(file, "utf-8");
  }
}
