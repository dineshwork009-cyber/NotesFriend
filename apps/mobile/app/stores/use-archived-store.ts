import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useArchivedStore, useCollection: useArchived } =
  createDBCollectionStore({
    getCollection: () =>
      db.notes.archived.grouped(db.settings.getGroupOptions("archive")),
    eagerlyFetchFirstBatch: true
  });

export { useArchivedStore, useArchived };
