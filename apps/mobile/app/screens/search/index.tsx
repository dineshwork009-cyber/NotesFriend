import {
  FilteredSelector,
  Item,
  Note,
  VirtualizedGrouping
} from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import React, { useEffect, useRef, useState } from "react";
import { DatabaseLogger, db } from "../../common/database";
import List from "../../components/list";
import SelectionHeader from "../../components/selection-header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import { ToastManager, eSubscribeEvent } from "../../services/event-manager";
import { NavigationProps } from "../../services/navigation";
import useNavigationStore from "../../stores/use-navigation-store";
import { eGroupOptionsUpdated, eOnRefreshSearch } from "../../utils/events";
import { SearchBar } from "./search-bar";
export const Search = ({ route, navigation }: NavigationProps<"Search">) => {
  const [results, setResults] = useState<VirtualizedGrouping<Item>>();
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>();
  const currentQuery = useRef<string>(undefined);
  const timer = useRef<NodeJS.Timeout>(undefined);
  useNavigationFocus(navigation, {
    onFocus: (prev) => {
      useNavigationStore.getState().setFocusedRouteId(route.name);
      return !prev?.current;
    },
    onBlur: () => {
      return false;
    }
  });

  const onSearch = React.useCallback(
    async (query?: string) => {
      currentQuery.current = query;
      if (!query) {
        setResults(undefined);
        setLoading(false);
        setSearchStatus(undefined);
        return;
      }
      try {
        setLoading(true);
        let results: VirtualizedGrouping<Item> | undefined;
        const groupOptions = db.settings.getGroupOptions("search");
        switch (route.params.type) {
          case "note":
            results = await db.lookup.notesWithHighlighting(
              query,
              route.params.items as FilteredSelector<Note>,
              groupOptions
            );

            break;
          case "notebook":
            results = await db.lookup.notebooks(query).sorted(groupOptions);
            break;
          case "tag":
            results = await db.lookup.tags(query).sorted(groupOptions);
            break;
          case "reminder":
            results = await db.lookup.reminders(query).sorted(groupOptions);
            break;
          case "trash":
            results = await db.lookup.trash(query).sorted(groupOptions);
            break;
          case "attachment":
            results = await db.lookup.attachments(query).sorted(groupOptions);
            break;
          default:
            results = undefined;
        }
        if (currentQuery.current !== query) return;
        if (!results) {
          setSearchStatus(strings.noResultsFound(query));
          setLoading(false);
          return;
        }

        console.log(
          `Found ${results.placeholders?.length} results for ${query}`
        );
        if (currentQuery.current !== query) return;
        await results.item(0);
        if (currentQuery.current !== query) return;
        setResults(results);
        if (results.placeholders?.length === 0) {
          setSearchStatus(strings.noResultsFound(query));
        } else {
          setSearchStatus(undefined);
        }
        setLoading(false);
      } catch (e) {
        ToastManager.error(e as Error);
        DatabaseLogger.error(e);
      }
    },
    [route.params?.items, route.params.type]
  );

  useEffect(() => {
    const onRefreshSearch = (type: string) => {
      if (type === undefined || type === route.params?.type) {
        onSearch(currentQuery.current);
      }
    };

    const subs = [
      eSubscribeEvent(eGroupOptionsUpdated, (groupType) => {
        if (groupType === "search") {
          onSearch(currentQuery.current);
        }
      }),
      eSubscribeEvent(eOnRefreshSearch, onRefreshSearch)
    ];

    return () => {
      subs.forEach((sub) => sub?.unsubscribe());
    };
  }, [onSearch, route.params?.type]);

  return (
    <>
      <SearchBar
        onChangeText={(query) => {
          clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            onSearch(query);
          }, 500);
        }}
        loading={loading}
      />
      <List
        data={results}
        dataType={route.params?.type}
        renderedInRoute={route.name}
        loading={loading}
        placeholder={{
          title: route.name,
          paragraph: searchStatus || strings.searchInRoute(route.params?.title),
          loading: strings.searchingFor(currentQuery.current as string)
        }}
      />
      <SelectionHeader
        id={route.name}
        items={results}
        type={route.params?.type}
        renderedInRoute={route.name}
      />
    </>
  );
};

export default Search;
