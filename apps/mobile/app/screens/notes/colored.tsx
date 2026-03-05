import { Color } from "@notesfriend/core";
import React from "react";
import NotesPage from ".";
import { db } from "../../common/database";
import Navigation, { NavigationProps } from "../../services/navigation";
import useNavigationStore, {
  NotesScreenParams
} from "../../stores/use-navigation-store";
import { PLACEHOLDER_DATA, openEditor } from "./common";
export const ColoredNotes = ({
  navigation,
  route
}: NavigationProps<"ColoredNotes">) => {
  return (
    <NotesPage
      navigation={navigation}
      route={route}
      get={ColoredNotes.get}
      placeholder={PLACEHOLDER_DATA}
      onPressFloatingButton={openEditor}
      canGoBack={route.params?.canGoBack}
      focusControl={true}
    />
  );
};

ColoredNotes.get = async (params: NotesScreenParams, grouped = true) => {
  if (!grouped) {
    return await db.relations
      .from({ id: params.id, type: "color" }, "note")
      .resolve();
  }

  return await db.relations
    .from({ id: params.id, type: "color" }, "note")
    .selector.grouped(db.settings.getGroupOptions("notes"));
};

ColoredNotes.navigate = (item: Color, canGoBack: boolean) => {
  if (!item) return;

  const { focusedRouteId } = useNavigationStore.getState();

  if (focusedRouteId === item.id) {
    return;
  }

  Navigation.push<"ColoredNotes">("ColoredNotes", {
    type: "color",
    id: item.id,
    canGoBack,
    item: item
  });
};

export default ColoredNotes;
