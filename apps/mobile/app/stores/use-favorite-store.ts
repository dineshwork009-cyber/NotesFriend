import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useFavoriteStore, useCollection: useFavorites } =
  createDBCollectionStore({
    getCollection: () =>
      db.notes.favorites.grouped(db.settings.getGroupOptions("favorites")),
    eagerlyFetchFirstBatch: true
  });

export { useFavoriteStore, useFavorites };
