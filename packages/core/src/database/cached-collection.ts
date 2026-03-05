import { IndexedCollection } from "./indexed-collection.js";
import {
  CollectionType,
  Collections,
  ItemMap,
  MaybeDeletedItem,
  isDeleted
} from "../types.js";
import { StorageAccessor } from "../interfaces.js";

/**
 * @deprecated only kept here for migration purposes
 */
export class CachedCollection<
  TCollectionType extends CollectionType,
  T extends ItemMap[Collections[TCollectionType]]
> {
  private collection: IndexedCollection<TCollectionType, T>;
  private cache = new Map<string, MaybeDeletedItem<T>>();
  private cachedItems?: T[];

  constructor(storage: StorageAccessor, type: TCollectionType) {
    this.collection = new IndexedCollection(storage, type);
  }

  async init() {
    await this.collection.init();
    const data = await this.collection.indexer.readMulti(
      this.collection.indexer.indices
    );
    this.cache = new Map(data);
  }

  async add(item: MaybeDeletedItem<T>) {
    await this.collection.addItem(item);
    this.cache.set(item.id, item);
    this.invalidateCache();
  }

  async clear() {
    await this.collection.clear();
    this.cache.clear();
    this.invalidateCache();
  }

  exists(id: string) {
    const item = this.cache.get(id);
    return this.collection.exists(id) && !!item && !isDeleted(item);
  }

  has(id: string) {
    return this.cache.has(id);
  }

  count() {
    return this.cache.size;
  }

  async delete(id: string) {
    this.cache.delete(id);
    await this.collection.deleteItem(id);
    this.invalidateCache();
  }

  items(map?: (item: T) => T | undefined) {
    if (this.cachedItems && this.cachedItems.length === this.cache.size)
      return this.cachedItems;

    this.cachedItems = [];
    this.cache.forEach((value) => {
      if (isDeleted(value)) return;
      const mapped = map ? map(value) : value;
      if (!mapped) return;
      this.cachedItems?.push(mapped);
    });
    this.cachedItems.sort((a, b) => b.dateCreated - a.dateCreated);
    return this.cachedItems;
  }

  get(id: string) {
    const item = this.cache.get(id);
    if (!item || isDeleted(item)) return;
    return item;
  }

  invalidateCache() {
    this.cachedItems = undefined;
  }
}
