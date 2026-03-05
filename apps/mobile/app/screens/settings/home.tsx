import { strings } from "@notesfriend/intl";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import DelayLayout from "../../components/delay-layout";
import { Header } from "../../components/header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import useNavigationStore from "../../stores/use-navigation-store";
import { SectionGroup } from "./section-group";
import { settingsGroups } from "./settings-data";
import { RouteParams, SettingSection } from "./types";
import SettingsUserSection from "./user-section";
import { LegendList } from "@legendapp/list";

const keyExtractor = (item: SettingSection) => item.id;

const Home = ({
  navigation
}: NativeStackScreenProps<RouteParams, "SettingsHome">) => {
  useNavigationFocus(navigation, {
    onFocus: () => {
      useNavigationStore.getState().setFocusedRouteId("Settings");
      return false;
    },
    focusOnInit: true
  });

  const renderItem = ({ item }: { item: SettingSection; index: number }) =>
    item.id === "account" ? (
      <SettingsUserSection item={item} />
    ) : (
      <SectionGroup item={item} />
    );

  return (
    <>
      <Header
        renderedInRoute="Settings"
        title={strings.routes.Settings()}
        canGoBack={true}
        hasSearch={false}
        id="Settings"
      />
      <DelayLayout type="settings">
        <LegendList
          data={settingsGroups}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </DelayLayout>
    </>
  );
};

export default Home;
