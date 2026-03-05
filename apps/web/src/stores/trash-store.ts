import { db } from "../common/db";
import createStore from "../common/store";
import BaseStore from "./index";
import { store as appStore } from "./app-store";
import { store as noteStore } from "./note-store";
import { store as notebookStore } from "./notebook-store";
import { TrashItem, VirtualizedGrouping } from "@notesfriend/core";
import { showToast } from "../utils/toast";
import { strings } from "@notesfriend/intl";

class TrashStore extends BaseStore<TrashStore> {
  trash: VirtualizedGrouping<TrashItem> | undefined = undefined;

  refresh = async () => {
    const grouping = await db.trash.grouped(
      db.settings.getGroupOptions("trash")
    );
    this.set({ trash: grouping });
  };

  delete = async (...ids: string[]) => {
    await db.trash.delete(...ids);
    await this.get().refresh();
  };

  restore = async (...ids: string[]) => {
    await db.trash.restore(...ids);
    showToast("success", strings.actions.restored.item(ids.length));
    await this.get().refresh();
    await appStore.refreshNavItems();
    await noteStore.refresh();
    await notebookStore.refresh();
  };

  clear = async () => {
    await db.trash.clear();
    await this.get().refresh();
  };
}

const [useStore, store] = createStore<TrashStore>(
  (set, get) => new TrashStore(set, get)
);
export { useStore, store };
