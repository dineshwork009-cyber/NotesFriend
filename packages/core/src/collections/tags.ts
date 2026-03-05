import { getId } from "../utils/id.js";
import { Tag } from "../types.js";
import Database from "../api/index.js";
import { ICollection } from "./collection.js";
import { SQLCollection } from "../database/sql-collection.js";
import { isFalse } from "../database/index.js";
import { sql } from "@streetwriters/kysely";

export class Tags implements ICollection {
  name = "tags";
  readonly collection: SQLCollection<"tags", Tag>;
  constructor(private readonly db: Database) {
    this.collection = new SQLCollection(
      db.sql,
      db.transaction,
      "tags",
      db.eventManager,
      db.sanitizer
    );
  }

  init() {
    return this.collection.init();
  }

  tag(id: string) {
    return this.collection.get(id);
  }

  find(title: string) {
    return this.all.find(sql`title == ${title} COLLATE BINARY`);
  }

  async add(item: Partial<Tag> & { title: string }) {
    item.title = sanitizeTag(item.title);

    const oldTag = item.id ? await this.tag(item.id) : undefined;

    if (oldTag && item.title === oldTag.title) return oldTag.id;

    if (await this.find(item.title))
      throw new Error("Tag with this title already exists.");

    if (oldTag) {
      await this.collection.update([oldTag.id], item);
      return oldTag.id;
    }

    const id = item.id || getId();
    await this.collection.upsert({
      id,
      dateCreated: item.dateCreated || Date.now(),
      dateModified: item.dateModified || Date.now(),
      title: item.title,
      type: "tag"
    });
    return id;
  }

  // get raw() {
  //   return this.collection.raw();
  // }

  get all() {
    return this.collection.createFilter<Tag>(
      (qb) => qb.where(isFalse("deleted")),
      this.db.options?.batchSize
    );
  }

  async remove(...ids: string[]) {
    await this.db.transaction(async () => {
      await this.db.relations.unlinkOfType("tag", ids);
      await this.collection.softDelete(ids);
    });
  }

  exists(id: string) {
    return this.collection.exists(id);
  }
}

export function sanitizeTag(title: string) {
  return title.replace(/^\s+|\s+$/gm, "");
}
