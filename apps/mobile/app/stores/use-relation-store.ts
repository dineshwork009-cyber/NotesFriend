import { create } from "zustand";

export interface RelationStore {
  updater: number;
  update: () => void;
}

export const useRelationStore = create<RelationStore>((set, get) => ({
  updater: 0,
  update: () => {
    set({ updater: get().updater + 1 });
  }
}));
