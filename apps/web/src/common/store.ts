import { create } from "zustand";
import {
  subscribeWithSelector,
  persist,
  PersistOptions
} from "zustand/middleware";
import { GetState, IStore, SetState } from "../stores";
import { mutative } from "zustand-mutative";

export function createStore<T>(
  getStore: (set: SetState<T>, get: GetState<T>) => T
) {
  const store = create<
    T,
    [["zustand/subscribeWithSelector", never], ["zustand/mutative", never]]
  >(
    subscribeWithSelector(
      mutative(
        (set, get) => {
          const store = getStore(set, get);
          return store;
        },
        {
          strict: import.meta.env.DEV,
          mark: (target, { mutable, immutable }) => {
            if (!target || typeof target !== "object") return mutable;
            return immutable;
          }
        }
      )
    )
  );
  return [store, store.getState()] as const;
}

export function createPersistedStore<T extends object>(
  Store: IStore<T>,
  options: PersistOptions<T, Partial<T>>
) {
  const store = create<
    T,
    [
      ["zustand/persist", Partial<T>],
      ["zustand/subscribeWithSelector", never],
      ["zustand/mutative", never]
    ]
  >(
    persist(
      subscribeWithSelector(
        mutative(
          (set, get) => {
            const store = new Store(set, get);
            return store;
          },
          {
            strict: import.meta.env.DEV,
            mark: (target, { mutable, immutable }) => {
              if (!target || typeof target !== "object") return mutable;
              return immutable;
            }
          }
        )
      ),
      options
    )
  );

  return store;
}

export default createStore;
