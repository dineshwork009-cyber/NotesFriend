import createStore from "../common/store";
import { db } from "../common/db";
import BaseStore from "./index";
import { store as noteStore } from "./note-store";
import { Note, VirtualizedGrouping, PublishOptions } from "@notesfriend/core";

class MonographStore extends BaseStore<MonographStore> {
  monographs: VirtualizedGrouping<Note> | undefined = undefined;

  refresh = async () => {
    const grouping = await db.monographs.all.grouped(
      db.settings.getGroupOptions("notes")
    );
    this.set({ monographs: grouping });
  };

  publish = async (noteId: string, title: string, opts: PublishOptions) => {
    const publishId = await db.monographs.publish(noteId, title, opts);
    await this.get().refresh();
    await noteStore.refreshContext();
    return publishId;
  };

  unpublish = async (noteId: string) => {
    await db.monographs.unpublish(noteId);
    await this.get().refresh();
    await noteStore.refreshContext();
  };
}

const [useStore, store] = createStore<MonographStore>(
  (set, get) => new MonographStore(set, get)
);
export { useStore, store };
