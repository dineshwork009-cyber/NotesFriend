import React from "react";
import NotesPage from ".";
import { db } from "../../common/database";
import Navigation, { NavigationProps } from "../../services/navigation";
import { NotesScreenParams } from "../../stores/use-navigation-store";
import { openMonographsWebpage } from "./common";
import { strings } from "@notesfriend/intl";

export const MONOGRAPH_PLACEHOLDER_DATA = {
  title: strings.yourMonographs(),
  paragraph: strings.monographsEmpty(),
  button: strings.learnMoreMonographs(),
  action: openMonographsWebpage,
  loading: strings.loadingMonographs(),
  type: "monograph",
  buttonIcon: "information-outline"
};

export const Monographs = ({
  navigation,
  route
}: NavigationProps<"Monographs">) => {
  return (
    <NotesPage
      navigation={navigation}
      route={route}
      get={Monographs.get}
      placeholder={MONOGRAPH_PLACEHOLDER_DATA}
      onPressFloatingButton={openMonographsWebpage}
      canGoBack={route.params?.canGoBack}
      focusControl={true}
    />
  );
};

Monographs.get = async (params?: NotesScreenParams, grouped = true) => {
  if (!grouped) {
    return await db.monographs.all.items();
  }

  return await db.monographs.all.grouped(db.settings.getGroupOptions("notes"));
};

Monographs.navigate = (canGoBack?: boolean) => {
  Navigation.navigate<"Monographs">("Monographs", {
    type: "monograph",
    id: "monograph",
    canGoBack: canGoBack as boolean
  });
};
export default Monographs;
