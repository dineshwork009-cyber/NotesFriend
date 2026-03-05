import { ICollection } from "./collection.js";
import { getId } from "../utils/id.js";
import { Color } from "../types.js";
import Database from "../api/index.js";
import { sanitizeTag } from "./tags.js";
import { SQLCollection } from "../database/sql-collection.js";
import { isFalse } from "../database/index.js";

export const DefaultColors: Record<string, string> = {
  red: "#f44336",
  orange: "#FF9800",
  yellow: "#FFD600",
  green: "#4CAF50",
  blue: "#2196F3",
  purple: "#673AB7",
  gray: "#9E9E9E"
};

export class Colors implements ICollection {
  name = "colors";
  readonly collection: SQLCollection<"colors", Color>;
  constructor(private readonly db: Database) {
    this.collection = new SQLCollection(
      db.sql,
      db.transaction,
      "colors",
      db.eventManager,
      db.sanitizer
    );
  }

  init() {
    return this.collection.init();
  }

  color(id: string) {
    return this.collection.get(id);
  }

  find(colorCode: string) {
    return this.all.find((eb) => eb.and([eb("colorCode", "==", colorCode)]));
  }

  // async merge(remoteColor: MaybeDeletedItem<Color>) {
  //   if (!remoteColor) return;

  //   const localColor = this.collection.get(remoteColor.id);
  //   if (!localColor || remoteColor.dateModified > localColor.dateModified)
  //     await this.collection.add(remoteColor);
  // }

  async add(item: Partial<Color>) {
    item.title = item.title ? sanitizeTag(item.title) : item.title;
    const oldColor = item.id
      ? await this.color(item.id)
      : item.colorCode
      ? await this.find(item.colorCode)
      : undefined;

    if (!item.title && !oldColor?.title) throw new Error("Title is required.");
    if (!item.colorCode && !oldColor?.colorCode)
      throw new Error("Color code is required.");

    if (oldColor) {
      await this.collection.update([oldColor.id], item);
      return oldColor.id;
    }

    const id = item.id || getId(item.dateCreated);
    await this.collection.upsert({
      id,
      dateCreated: item.dateCreated || Date.now(),
      dateModified: item.dateModified || Date.now(),
      title: item.title || "",
      colorCode: item.colorCode || "",
      type: "color",
      remote: false
    });

    return id;
  }

  // get raw() {
  //   return this.collection.raw();
  // }

  get all() {
    return this.collection.createFilter<Color>(
      (qb) => qb.where(isFalse("deleted")),
      this.db.options?.batchSize
    );
  }

  async count(id: string) {
    const color = await this.color(id);
    if (!color) return;
    return this.db.relations.from(color, "note").count();
  }

  async remove(...ids: string[]) {
    await this.db.transaction(async () => {
      await this.db.relations.unlinkOfType("color", ids);
      await this.collection.softDelete(ids);
    });
  }

  // async delete(id: string) {
  //   await this.collection.delete(id);
  //   await this.db.relations.cleanup();
  // }

  exists(id: string) {
    return this.collection.exists(id);
  }

  // find(idOrTitle: string) {
  //   return this.all.find((t) => t.title === idOrTitle || t.id === idOrTitle);
  // }
}
