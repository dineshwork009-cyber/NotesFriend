import { db } from "../common/db";
import createStore from "../common/store";
import { store as appStore } from "./app-store";
import { store as noteStore } from "./note-store";
import BaseStore from "./index";
import Config from "../utils/config";
import { Notebook, VirtualizedGrouping } from "@notesfriend/core";

type ViewMode = "detailed" | "compact";
class NotebookStore extends BaseStore<NotebookStore> {
  notebooks?: VirtualizedGrouping<Notebook>;
  viewMode = Config.get<ViewMode>("notebooks:viewMode", "detailed");

  setViewMode = (viewMode: ViewMode) => {
    this.set((state) => (state.viewMode = viewMode));
    Config.set("notebooks:viewMode", viewMode);
  };

  refresh = async () => {
    const notebooks = await db.notebooks.roots.sorted(
      db.settings.getGroupOptions("notebooks")
    );
    this.set({ notebooks });
  };

  delete = async (...ids: string[]) => {
    await db.notebooks.moveToTrash(...ids);
    await this.refresh();
    await appStore.refreshNavItems();
    await noteStore.refresh();
  };

  pin = async (state: boolean, ...ids: string[]) => {
    await db.notebooks.pin(state, ...ids);
    await this.refresh();
  };
}

const [useStore, store] = createStore<NotebookStore>(
  (set, get) => new NotebookStore(set, get)
);
export { useStore, store };
