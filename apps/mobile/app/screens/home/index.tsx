import { strings } from "@notesfriend/intl";
import React from "react";
import { FloatingButton } from "../../components/container/floating-button";
import DelayLayout from "../../components/delay-layout";
import { Header } from "../../components/header";
import List from "../../components/list";
import SelectionHeader from "../../components/selection-header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import Navigation, { NavigationProps } from "../../services/navigation";
import SettingsService from "../../services/settings";
import useNavigationStore from "../../stores/use-navigation-store";
import { useNotes } from "../../stores/use-notes-store";
import { openEditor } from "../notes/common";

export const Home = ({ navigation, route }: NavigationProps<"Notes">) => {
  const [notes, loading] = useNotes();

  const isFocused = useNavigationFocus(navigation, {
    onFocus: (prev) => {
      Navigation.routeNeedsUpdate(
        route.name,
        Navigation.routeUpdateFunctions[route.name]
      );
      useNavigationStore.getState().setFocusedRouteId(route.name);
      return !prev?.current;
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
        onSearch={() => {
          Navigation.push("Search", {
            placeholder: strings.searchInRoute(route.name),
            type: "note",
            title: route.name,
            route: route.name
          });
        }}
        id={route.name}
        onPressDefaultRightButton={openEditor}
      />

      <DelayLayout wait={loading}>
        <List
          data={notes}
          dataType="note"
          renderedInRoute={route.name}
          loading={loading || !isFocused}
          headerTitle={strings.routes[route.name]()}
          placeholder={{
            title: route.name?.toLowerCase(),
            paragraph: strings.notesEmpty(),
            button: strings.createNewNote(),
            action: openEditor,
            loading: strings.loadingNotes()
          }}
        />
        {!notes || !notes.placeholders?.length ? null : (
          <FloatingButton onPress={openEditor} alwaysVisible />
        )}
      </DelayLayout>
      <SelectionHeader id={route.name} items={notes} type="note" />
    </>
  );
};

export default Home;
