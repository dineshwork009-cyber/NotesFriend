import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { Platform, Text, TextProps, ViewStyle } from "react-native";
import { AppFontSize } from "../../../utils/size";
interface HeadingProps extends TextProps {
  color?: string;
  size?: number;
  extraBold?: boolean;
}

const extraBoldStyle = {
  fontFamily: Platform.OS === "android" ? "Inter-Bold" : undefined,
  fontWeight: Platform.OS === "ios" ? "800" : undefined
};
const boldStyle = {
  fontFamily: Platform.OS === "android" ? "Inter-SemiBold" : undefined,
  fontWeight: Platform.OS === "ios" ? "600" : undefined
};

const Heading = ({
  color,
  size = AppFontSize.xl,
  style,
  extraBold,
  ...restProps
}: HeadingProps) => {
  const { colors } = useThemeColors();

  return (
    <Text
      allowFontScaling={true}
      {...restProps}
      style={[
        {
          fontSize: size || AppFontSize.xl,
          color: color || colors.primary.heading
        },
        extraBold ? (extraBoldStyle as ViewStyle) : (boldStyle as ViewStyle),
        style
      ]}
    ></Text>
  );
};

export default Heading;
