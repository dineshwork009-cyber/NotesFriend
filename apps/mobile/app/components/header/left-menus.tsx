import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { notesfriend } from "../../../e2e/test.ids";
import Navigation from "../../services/navigation";
import { useSettingStore } from "../../stores/use-setting-store";
import { fluidTabsRef } from "../../utils/global-refs";
import { IconButton } from "../ui/icon-button";

export const LeftMenus = ({
  canGoBack,
  onLeftButtonPress
}: {
  canGoBack?: boolean;
  onLeftButtonPress?: () => void;
}) => {
  const { colors } = useThemeColors();
  const deviceMode = useSettingStore((state) => state.deviceMode);
  const isTablet = deviceMode === "tablet";

  const _onLeftButtonPress = () => {
    if (onLeftButtonPress) return onLeftButtonPress();

    if (!canGoBack) {
      if (fluidTabsRef.current?.isDrawerOpen()) {
        Navigation.closeDrawer();
      } else {
        Navigation.openDrawer();
      }
      return;
    }
    Navigation.goBack();
  };

  return isTablet && !canGoBack ? null : (
    <IconButton
      testID={notesfriend.ids.default.header.buttons.left}
      left={40}
      top={40}
      onPress={_onLeftButtonPress}
      onLongPress={() => {
        Navigation.popToTop();
      }}
      name={canGoBack ? "arrow-left" : "menu"}
      color={colors.primary.icon}
    />
  );
};
