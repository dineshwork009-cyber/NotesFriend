import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import DelayLayout from "../../components/delay-layout";
import { Header } from "../../components/header";
import { useNavigationFocus } from "../../hooks/use-navigation-focus";
import useNavigationStore from "../../stores/use-navigation-store";
import { components } from "./components";
import { SectionItem } from "./section-item";
import { RouteParams, SettingSection } from "./types";

const keyExtractor = (item: SettingSection) => item.id;
const AnimatedKeyboardAvoidingFlatList = Animated.createAnimatedComponent(
  KeyboardAwareFlatList
);

const Group = ({
  navigation,
  route
}: NativeStackScreenProps<RouteParams, "SettingsGroup">) => {
  useNavigationFocus(navigation, {
    onFocus: () => {
      useNavigationStore.getState().setFocusedRouteId("Settings");
      return false;
    }
  });
  const renderItem = ({ item }: { item: SettingSection; index: number }) => (
    <SectionItem item={item} />
  );

  return (
    <>
      {route.params.hideHeader ? null : (
        <Header
          renderedInRoute="Settings"
          title={route.params.name as string}
          canGoBack={true}
          id="Settings"
        />
      )}
      <DelayLayout type="settings">
        <View
          style={{
            flex: 1
          }}
        >
          {route.params.component ? components[route.params.component] : null}
          {route.params.sections ? (
            <AnimatedKeyboardAvoidingFlatList
              data={route.params.sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              enableOnAndroid
              enableAutomaticScroll
            />
          ) : null}
        </View>
      </DelayLayout>
    </>
  );
};

export default Group;
