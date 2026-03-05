import Database from "../api/index.js";
import { Monograph } from "../types.js";
import { ICollection } from "./collection.js";
import { SQLCollection } from "../database/sql-collection.js";
import { getId } from "../utils/id.js";
import { isFalse } from "../database/index.js";

export class Monographs implements ICollection {
  name = "monographs";
  readonly collection: SQLCollection<"monographs", Monograph>;
  constructor(private readonly db: Database) {
    this.collection = new SQLCollection(
      db.sql,
      db.transaction,
      "monographs",
      db.eventManager,
      db.sanitizer
    );
  }

  async init() {
    await this.collection.init();
  }

  get all() {
    return this.collection.createFilter<Monograph>(
      (qb) => qb.where(isFalse("deleted")),
      this.db.options?.batchSize
    );
  }

  async add(monograph: Partial<Monograph>) {
    const id = monograph.id || getId();
    const oldMonograph = await this.collection.get(id);
    const merged: Partial<Monograph> = {
      ...oldMonograph,
      ...monograph
    };

    await this.collection.upsert({
      id,
      title: merged.title,
      datePublished: merged.datePublished,
      selfDestruct: merged.selfDestruct,
      password: merged.password,
      type: "monograph"
    });
  }
}
