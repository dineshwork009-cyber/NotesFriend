import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useTrashStore, useCollection: useTrash } =
  createDBCollectionStore({
    getCollection: () => db.trash.grouped(db.settings.getGroupOptions("trash")),
    eagerlyFetchFirstBatch: true
  });

export { useTrashStore, useTrash };
