import React from "react";
import { db } from "../../common/database";
import { FloatingButton } from "../../components/container/floating-button";
import DelayLayout from "../../components/delay-layout";
import { presentDialog } from "../../components/dialog/functions";
import { Header } from "../../components/header";
import List from "../../components/list";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import { ToastManager } from "../../services/event-manager";
import Navigation, { NavigationProps } from "../../services/navigation";
import useNavigationStore from "../../stores/use-navigation-store";
import { useSelectionStore } from "../../stores/use-selection-store";
import { useTrash, useTrashStore } from "../../stores/use-trash-store";
import SelectionHeader from "../../components/selection-header";
import { strings } from "@notesfriend/intl";

const onPressFloatingButton = () => {
  presentDialog({
    title: strings.clearTrash(),
    paragraph: strings.clearTrashConfirm(),
    positiveText: strings.clear(),
    negativeText: strings.cancel(),
    positivePress: async () => {
      await db.trash?.clear();
      useTrashStore.getState().refresh();
      useSelectionStore.getState().clearSelection();
      ToastManager.show({
        heading: strings.trashCleared(),
        type: "success",
        context: "local"
      });
    },
    positiveType: "errorShade"
  });
};
const PLACEHOLDER_DATA = (trashCleanupInterval = 7) => ({
  title: strings.trash(),
  paragraph:
    trashCleanupInterval === -1
      ? strings.noTrashCleanupInterval()
      : trashCleanupInterval === 1
      ? strings.trashCleanupIntervalTextDaily()
      : strings.trashCleanupIntervalTextDays(trashCleanupInterval),
  loading: strings.loadingTrash()
});

export const Trash = ({ navigation, route }: NavigationProps<"Trash">) => {
  const [trash, loading] = useTrash();
  const isFocused = useNavigationFocus(navigation, {
    onFocus: () => {
      Navigation.routeNeedsUpdate(
        route.name,
        Navigation.routeUpdateFunctions[route.name]
      );
      useNavigationStore.getState().setFocusedRouteId(route.name);
      return false;
    },
    onBlur: () => false
  });

  return (
    <>
      <Header
        renderedInRoute={route.name}
        title={route.name}
        id={route.name}
        canGoBack={false}
        hasSearch={true}
        onSearch={() => {
          Navigation.push("Search", {
            placeholder: strings.searchInRoute(route.name),
            type: "trash",
            title: route.name,
            route: route.name
          });
        }}
      />
      <DelayLayout wait={loading}>
        <List
          data={trash}
          dataType="trash"
          renderedInRoute="Trash"
          loading={!isFocused}
          placeholder={PLACEHOLDER_DATA(db.settings.getTrashCleanupInterval())}
          headerTitle="Trash"
        />

        {trash && trash?.placeholders?.length !== 0 ? (
          <FloatingButton
            onPress={onPressFloatingButton}
            alwaysVisible={true}
          />
        ) : null}
      </DelayLayout>
      <SelectionHeader
        id={route.name}
        items={trash}
        type="trash"
        renderedInRoute={route.name}
      />
    </>
  );
};

export default Trash;
