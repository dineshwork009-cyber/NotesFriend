import { ScopedThemeProvider, useThemeColors } from "@notesfriend/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useNavigationStore from "../../stores/use-navigation-store";
import Group from "./group";
import Home from "./home";
import { RouteParams } from "./types";
const SettingsStack = createNativeStackNavigator<RouteParams>();

export const Settings = () => {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }}
    >
      <ScopedThemeProvider value="list">
        <SettingsStack.Navigator
          initialRouteName="SettingsHome"
          screenListeners={{
            focus: (e) => {
              if (e.target?.startsWith("SettingsHome-")) {
                useNavigationStore.getState().update("Settings");
              }
            }
          }}
          screenOptions={{
            animation: "none",
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.primary.background
            }
          }}
        >
          <SettingsStack.Screen name="SettingsHome" component={Home} />
          <SettingsStack.Screen name="SettingsGroup" component={Group} />
        </SettingsStack.Navigator>
      </ScopedThemeProvider>
    </View>
  );
};

export default Settings;
