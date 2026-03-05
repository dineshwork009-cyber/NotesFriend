import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useTagStore, useCollection: useTags } =
  createDBCollectionStore({
    getCollection: () =>
      db.tags.all.grouped(db.settings.getGroupOptions("tags")),
    eagerlyFetchFirstBatch: true
  });

export { useTagStore, useTags };
