import { match, surround } from "fuzzyjs";
import { clone } from "./clone.js";

export function fuzzy<T>(
  query: string,
  items: T[],
  getIdentifier: (item: T) => string,
  fields: Partial<Record<keyof T, number>>,
  options: {
    limit?: number;
    prefix?: string;
    suffix?: string;
  } = {}
): T[] {
  const results: Map<
    string,
    {
      item: T;
      score: number;
    }
  > = new Map();

  for (const item of items) {
    if (options.limit && results.size >= options.limit) break;

    const identifier = getIdentifier(item);

    for (const field in fields) {
      const result = match(query, `${item[field]}`);
      if (!result.match) continue;

      const oldMatch = results.get(identifier);
      const clonedItem = oldMatch?.item || clone(item);

      if (options.suffix || options.prefix) {
        clonedItem[field] = surround(`${clonedItem[field]}`, {
          suffix: options.suffix,
          prefix: options.prefix,
          result
        }) as T[Extract<keyof T, string>];
      }
      if (oldMatch) {
        oldMatch.score += result.score * (fields[field] || 1);
      } else {
        results.set(identifier, {
          item: clonedItem,
          score: result.score * (fields[field] || 1)
        });
      }
    }
  }

  if (results.size === 0) return [];

  const sorted = Array.from(results.entries());
  sorted.sort((a, b) => b[1].score - a[1].score);

  return sorted.map((item) => item[1].item);
}
