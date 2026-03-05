import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useMonographStore, useCollection: useMonographs } =
  createDBCollectionStore({
    getCollection: () =>
      db.monographs.all.grouped(db.settings.getGroupOptions("notes")),
    eagerlyFetchFirstBatch: true
  });

export { useMonographStore, useMonographs };
