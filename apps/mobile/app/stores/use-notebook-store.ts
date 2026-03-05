import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useNotebookStore, useCollection: useNotebooks } =
  createDBCollectionStore({
    getCollection: () =>
      db.notebooks.roots.grouped(db.settings.getGroupOptions("notebooks")),
    eagerlyFetchFirstBatch: true
  });

export { useNotebookStore, useNotebooks };
