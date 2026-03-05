import Database from "../api/index.js";
import { ItemReference, Vault } from "../types.js";
import { ICollection } from "./collection.js";
import { SQLCollection } from "../database/sql-collection.js";
import { getId } from "../utils/id.js";
import { isFalse } from "../database/index.js";

export class Vaults implements ICollection {
  name = "vaults";
  readonly collection: SQLCollection<"vaults", Vault>;
  constructor(private readonly db: Database) {
    this.collection = new SQLCollection(
      db.sql,
      db.transaction,
      "vaults",
      db.eventManager,
      db.sanitizer
    );
  }

  async init() {
    await this.collection.init();
  }

  async add(item: Partial<Vault>) {
    const id = item.id || getId();
    const oldVault = item.id ? await this.vault(item.id) : undefined;

    if (!item.title && !oldVault?.title) throw new Error("Title is required.");

    await this.collection.upsert({
      id,
      dateCreated: item.dateCreated || oldVault?.dateCreated || Date.now(),
      dateModified: item.dateModified || oldVault?.dateModified || Date.now(),
      title: item.title || oldVault?.title || "",
      key: item.key,
      type: "vault"
    });
    return id;
  }

  async remove(id: string) {
    await this.db.transaction(async () => {
      await this.db.relations.unlinkOfType("vault", [id]);
      await this.collection.softDelete([id]);
    });
  }

  vault(id: string) {
    return this.collection.get(id);
  }

  /**
   * This is temporary until we add proper support for multiple vaults
   * @deprecated
   */
  async default(): Promise<Vault | undefined> {
    return (await this.all.items())[0];
  }

  get all() {
    return this.collection.createFilter<Vault>(
      (qb) => qb.where(isFalse("deleted")),
      this.db.options?.batchSize
    );
  }

  async itemExists(reference: ItemReference) {
    return (await this.db.relations.to(reference, "vault").count()) > 0;
  }
}
