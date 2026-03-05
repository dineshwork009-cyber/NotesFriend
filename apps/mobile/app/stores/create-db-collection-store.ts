import { Item, VirtualizedGrouping } from "@notesfriend/core";
import create, { StoreApi, UseBoundStore } from "zustand";
import { resolveItems } from "@notesfriend/common";
import { useSettingStore } from "./use-setting-store";
import { DatabaseLogger } from "../common/database";
import { ToastManager } from "../services/event-manager";

export interface DBCollectionStore<Type extends Item> {
  items: VirtualizedGrouping<Type> | undefined;
  loading: boolean;
  refresh: () => Promise<void>;
  clear: () => void;
}

const ALL_STORES: UseBoundStore<StoreApi<DBCollectionStore<Item>>>[] = [];

export function clearAllStores() {
  ALL_STORES.forEach((store) => {
    store?.getState().clear();
  });
}

export function refreshAllStores() {
  ALL_STORES.forEach((store) => store?.getState().refresh());
}

export default function createDBCollectionStore<Type extends Item>({
  getCollection,
  eagerlyFetchFirstBatch
}: {
  getCollection: () => Promise<VirtualizedGrouping<Type>>;
  eagerlyFetchFirstBatch?: boolean;
}) {
  const useDBCollectionStore = create<DBCollectionStore<Type>>((set, get) => ({
    items: undefined,
    loading: true,
    refresh: async () => {
      try {
        const items = await getCollection();
        if (
          get().loading &&
          eagerlyFetchFirstBatch &&
          items.placeholders.length
        ) {
          await items.item(0, resolveItems);
        }
        set({
          items,
          loading: false
        });
      } catch (e) {
        DatabaseLogger.error(e as Error, "useDBCollectionStore.refresh", {
          useDBCollectionStore: "refresh"
        });
        ToastManager.error(e as Error, "Failed to load items");
      }
    },
    clear: () => set({ items: undefined, loading: true })
  }));

  const useStoreHook = (): [
    VirtualizedGrouping<Type> | undefined,
    boolean,
    () => Promise<void>
  ] => {
    const isAppLoading = useSettingStore((state) => state.isAppLoading);
    const [items, loading] = useDBCollectionStore((state) => [
      state.items,
      state.loading
    ]);

    if (!items && !isAppLoading) {
      useDBCollectionStore.getState().refresh();
    }

    return [items, loading, useDBCollectionStore.getState().refresh];
  };

  ALL_STORES.push(useDBCollectionStore as any);
  return {
    useStore: useDBCollectionStore,
    useCollection: useStoreHook
  };
}
