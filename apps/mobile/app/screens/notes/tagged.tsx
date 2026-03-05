import { Tag } from "@notesfriend/core";
import React from "react";
import NotesPage from ".";
import { db } from "../../common/database";
import Navigation, { NavigationProps } from "../../services/navigation";
import useNavigationStore, {
  NotesScreenParams
} from "../../stores/use-navigation-store";
import { PLACEHOLDER_DATA, openEditor } from "./common";

export const TaggedNotes = ({
  navigation,
  route
}: NavigationProps<"TaggedNotes">) => {
  return (
    <NotesPage
      navigation={navigation}
      route={route}
      get={TaggedNotes.get}
      placeholder={PLACEHOLDER_DATA}
      onPressFloatingButton={openEditor}
      canGoBack={route.params?.canGoBack}
      focusControl={true}
    />
  );
};

TaggedNotes.get = async (params: NotesScreenParams, grouped = true) => {
  if (!grouped) {
    return await db.relations
      .from({ id: params.id, type: "tag" }, "note")
      .resolve();
  }

  return await db.relations
    .from({ id: params.id, type: "tag" }, "note")
    .selector.grouped(db.settings.getGroupOptions("notes"));
};

TaggedNotes.navigate = (item: Tag, canGoBack?: boolean) => {
  if (!item) return;

  const { focusedRouteId } = useNavigationStore.getState();

  if (focusedRouteId === item.id) {
    return;
  }

  Navigation.push<"TaggedNotes">("TaggedNotes", {
    id: item.id,
    type: "tag",
    canGoBack,
    item: item
  });
};

export default TaggedNotes;
