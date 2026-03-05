import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useNoteStore, useCollection: useNotes } =
  createDBCollectionStore({
    getCollection: () =>
      db.notes.all.grouped(db.settings.getGroupOptions("home")),
    eagerlyFetchFirstBatch: true
  });

export { useNoteStore, useNotes };
