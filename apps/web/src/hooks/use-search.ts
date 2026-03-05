import { DependencyList, useEffect, useState } from "react";
import { useStore as useSearchStore } from "../stores/search-store";
import { SortOptions, VirtualizedGrouping } from "@notesfriend/core";
import { db } from "../common/db";

export function useSearch<T>(
  type: "notes" | "notebooks" | "notebook" | "reminders" | "trash" | "tags",
  lookup: (
    query: string,
    sortOptions?: SortOptions
  ) => Promise<VirtualizedGrouping<T> | undefined>,
  deps: DependencyList = []
) {
  const isSearching = useSearchStore((store) => store.isSearching);
  const query = useSearchStore((store) => store.query);
  const searchType = useSearchStore((store) => store.searchType);
  const sortOptions = useSearchStore((store) => store.sortOptions);
  const [filteredItems, setFilteredItems] = useState<VirtualizedGrouping<T>>();

  useEffect(() => {
    if (!query || !isSearching) return setFilteredItems(undefined);
    if (searchType !== type) return;

    const cachedQuery = query;
    lookup(
      cachedQuery,
      sortOptions || db.settings.getGroupOptions("search")
    ).then((items) => {
      if (useSearchStore.getState().query === cachedQuery)
        setFilteredItems(items);
    });
  }, [isSearching, query, searchType, type, sortOptions, ...deps]);

  return filteredItems;
}
