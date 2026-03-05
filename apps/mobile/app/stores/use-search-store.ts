import { create } from "zustand";

export interface SearchStore {
  searchResults: object[];
  searching: boolean;
  searchStatus: string | null;
  setSearchResults: (results: object[]) => void;
  setSearchStatus: (searching: boolean, status: string | null) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchResults: [],
  searching: false,
  searchStatus: null,
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchStatus: (searching, status) =>
    set({ searching, searchStatus: status })
}));
