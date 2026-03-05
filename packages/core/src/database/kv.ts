import { LazyDatabaseAccessor, RawDatabaseSchema } from "./index.js";
import { Token } from "../api/token-manager.js";
import { User } from "../types.js";

interface KV {
  v: number;
  lastSynced: number;
  user: User;
  token: Token;
  monographs: string[];
  deviceId: string;
  lastBackupTime: number;
  fullOfflineMode: boolean;
}

export const KEYS: (keyof KV)[] = [
  "v",
  "lastSynced",
  "user",
  "token",
  "monographs",
  "deviceId",
  "lastBackupTime",
  "fullOfflineMode"
];

export class KVStorage {
  private readonly db: LazyDatabaseAccessor<RawDatabaseSchema>;
  constructor(db: LazyDatabaseAccessor) {
    this.db = db as unknown as LazyDatabaseAccessor<RawDatabaseSchema>;
  }

  async read<T extends keyof KV>(key: T): Promise<KV[T] | undefined> {
    const result = await this.db.then((db) =>
      db
        .selectFrom("kv")
        .where("key", "==", key)
        .select("value")
        .limit(1)
        .executeTakeFirst()
    );
    if (!result?.value) return;
    return JSON.parse(result.value) as KV[T];
  }

  async write<T extends keyof KV>(key: T, value: KV[T]) {
    await this.db.then((db) =>
      db
        .replaceInto("kv")
        .values({
          key,
          value: JSON.stringify(value),
          dateModified: Date.now()
        })
        .execute()
    );
  }

  async delete<T extends keyof KV>(key: T) {
    await this.db.then((db) =>
      db.deleteFrom("kv").where("key", "==", key).execute()
    );
  }

  async clear() {
    await this.db.then((db) => db.deleteFrom("kv").execute());
  }
}
