import { db } from "../common/database";
import createDBCollectionStore from "./create-db-collection-store";

const { useStore: useReminderStore, useCollection: useReminders } =
  createDBCollectionStore({
    getCollection: () =>
      db.reminders.all.grouped(db.settings.getGroupOptions("reminders")),
    eagerlyFetchFirstBatch: true
  });

export { useReminderStore, useReminders };
