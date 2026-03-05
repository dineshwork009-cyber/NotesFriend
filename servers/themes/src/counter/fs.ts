import { readFile, writeFile } from "fs/promises";
import { Mutex } from "async-mutex";

type Counts = Record<string, string[]>;
export class FsCounter {
  private path: string;
  private readonly mutex: Mutex;
  constructor(id: string) {
    this.path = id;
    this.mutex = new Mutex();
  }

  async increment(key: string, uid: string) {
    return await this.mutex.runExclusive(async () => {
      const counts = await this.all();
      counts[key] = counts[key] || [];
      if (counts[key].includes(uid)) return counts[key].length;
      counts[key].push(uid);
      await this.save(counts);
      return counts[key].length;
    });
  }

  private async save(counts: Counts) {
    await writeFile(this.path, JSON.stringify(counts));
  }

  async counts(keys: string[]): Promise<Record<string, number>> {
    const all = await this.all();
    const result: Record<string, number> = {};
    for (const key of keys) {
      result[key] = (all[key] || []).length;
    }
    return result;
  }

  private async all(): Promise<Counts> {
    try {
      return JSON.parse(await readFile(this.path, "utf-8"));
    } catch {
      return {};
    }
  }
}
