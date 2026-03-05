import { LazyDatabaseAccessor, RawDatabaseSchema } from "./index.js";

export class ConfigStorage {
  private readonly db: LazyDatabaseAccessor<RawDatabaseSchema>;
  constructor(db: LazyDatabaseAccessor) {
    this.db = db as unknown as LazyDatabaseAccessor<RawDatabaseSchema>;
  }

  async getItem(name: string): Promise<unknown | undefined> {
    const result = await this.db.then((db) =>
      db
        .selectFrom("config")
        .where("name", "==", name)
        .select("value")
        .limit(1)
        .executeTakeFirst()
    );
    if (!result?.value) return;
    return JSON.parse(result.value);
  }

  async setItem(name: string, value: unknown) {
    await this.db.then((db) =>
      db
        .replaceInto("config")
        .values({
          name,
          value: JSON.stringify(value),
          dateModified: Date.now()
        })
        .execute()
    );
  }

  async removeItem(name: string) {
    await this.db.then((db) =>
      db.deleteFrom("config").where("name", "==", name).execute()
    );
  }

  async clear() {
    await this.db.then((db) => db.deleteFrom("config").execute());
  }
}
