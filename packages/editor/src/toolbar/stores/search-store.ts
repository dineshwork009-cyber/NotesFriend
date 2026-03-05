import { create } from "zustand";

export interface SearchSettings {
  matchCase: boolean;
  enableRegex: boolean;
  matchWholeWord: boolean;
}

export interface SearchState extends SearchSettings {
  isSearching: boolean;
  searchTerm: string;
  replaceTerm: string;
  focusNonce: number;
  isReplacing: boolean;
  isExpanded: boolean;
}

export const useEditorSearchStore = create<SearchState>(() => ({
  focusNonce: 0,
  isSearching: false,
  searchTerm: "",
  replaceTerm: "",
  enableRegex: false,
  matchCase: false,
  matchWholeWord: false,
  isExpanded: false,
  isReplacing: false
}));
