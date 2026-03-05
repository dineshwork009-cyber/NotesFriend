import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { ColorValue, TextProps } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppFontSize } from "../../../utils/size";

export interface IconProps extends TextProps {
  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   *
   * @default 12
   */
  size?: number | undefined;

  /**
   * Name of the icon to show
   *
   * See Icon Explorer app
   * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
   */
  name: string;

  /**
   * Color of the icon
   *
   */
  color?: ColorValue | number | undefined;
}

export default function AppIcon(props: IconProps) {
  const { colors } = useThemeColors();
  return (
    <Icon
      size={AppFontSize.md}
      color={colors.primary.icon}
      {...(props as any)}
    />
  );
}
