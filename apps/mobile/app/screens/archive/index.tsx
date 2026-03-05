import React from "react";
import DelayLayout from "../../components/delay-layout";
import { Header } from "../../components/header";
import List from "../../components/list";
import SelectionHeader from "../../components/selection-header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import Navigation, { NavigationProps } from "../../services/navigation";
import SettingsService from "../../services/settings";
import useNavigationStore from "../../stores/use-navigation-store";
import { db } from "../../common/database";
import { strings } from "@notesfriend/intl";
import { useArchived } from "../../stores/use-archived-store";

export const Archive = ({ navigation, route }: NavigationProps<"Archive">) => {
  const [archive, loading, refresh] = useArchived();
  const isFocused = useNavigationFocus(navigation, {
    onFocus: (prev) => {
      Navigation.routeNeedsUpdate(
        route.name,
        Navigation.routeUpdateFunctions[route.name]
      );
      useNavigationStore.getState().setFocusedRouteId(route?.name);
      return false;
    },
    onBlur: () => false,
    delay: SettingsService.get().homepage === route.name ? 1 : -1
  });

  return (
    <>
      <Header
        renderedInRoute={route.name}
        title={strings.routes[route.name]()}
        canGoBack={false}
        hasSearch={true}
        id={route.name}
        onSearch={() => {
          Navigation.push("Search", {
            placeholder: strings.searchInRoute(route.name),
            type: "note",
            title: route.name,
            route: route.name,
            items: db.notes.archived
          });
        }}
      />
      <DelayLayout wait={loading}>
        <List
          data={archive}
          dataType="note"
          onRefresh={() => {
            refresh();
          }}
          renderedInRoute="Archive"
          loading={loading}
          placeholder={{
            title: strings.yourArchive(),
            paragraph: strings.yourArchiveIsEmpty(),
            loading: strings.loadingArchive()
          }}
          headerTitle={strings.routes.Archive()}
        />
      </DelayLayout>

      <SelectionHeader id={route.name} items={archive} type="note" />
    </>
  );
};

export default Archive;
