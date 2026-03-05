import { toChunks } from "../utils/array.js";
import { StorageAccessor } from "../interfaces.js";
import {
  CollectionType,
  Collections,
  ItemMap,
  MaybeDeletedItem
} from "../types.js";
import Indexer from "./indexer.js";

/**
 * @deprecated only kept here for migration purposes
 */
export class IndexedCollection<
  TCollectionType extends CollectionType = CollectionType,
  T extends ItemMap[Collections[TCollectionType]] = ItemMap[Collections[TCollectionType]]
> {
  readonly indexer: Indexer<T>;

  constructor(storage: StorageAccessor, type: TCollectionType) {
    this.indexer = new Indexer(storage, type);
  }

  clear() {
    return this.indexer.clear();
  }

  async deleteItem(id: string) {
    await this.indexer.deindex(id);
    return await this.indexer.remove(id);
  }

  async init() {
    await this.indexer.init();
  }

  async addItem(item: MaybeDeletedItem<T>) {
    await this.indexer.write(item.id, item);
    await this.indexer.index(item.id);
  }

  exists(id: string) {
    return this.indexer.exists(id);
  }

  async *iterate(chunkSize: number) {
    const chunks = toChunks(this.indexer.indices, chunkSize);
    for (const chunk of chunks) {
      yield await this.indexer.readMulti(chunk);
    }
  }
}
