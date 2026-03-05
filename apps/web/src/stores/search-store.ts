import { SortOptions } from "@notesfriend/core";
import createStore from "../common/store";
import BaseStore from "./index";

class SearchStore extends BaseStore<SearchStore> {
  isSearching = false;
  query?: string;
  searchType?: string;
  sortOptions?: SortOptions;

  resetSearch = () => {
    this.set({
      isSearching: false,
      query: undefined,
      searchType: undefined,
      sortOptions: undefined
    });
  };
}

const [useStore, store] = createStore<SearchStore>(
  (set, get) => new SearchStore(set, get)
);
export { useStore, store };
