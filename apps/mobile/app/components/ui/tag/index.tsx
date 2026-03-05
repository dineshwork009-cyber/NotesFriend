import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { ViewStyle } from "react-native";
import { AppFontSize } from "../../../utils/size";
import Paragraph from "../typography/paragraph";
import { DefaultAppStyles } from "../../../utils/styles";

export default function Tag({
  text,
  textColor,
  background,
  visible,
  style
}: {
  text: string;
  background?: string;
  textColor?: string;
  visible?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useThemeColors();
  return !visible ? null : (
    <Paragraph
      style={{
        backgroundColor: background || colors.primary.accent,
        borderRadius: 100,
        paddingHorizontal: DefaultAppStyles.GAP_SMALL / 2,
        paddingVertical: 2,
        marginLeft: 2,
        marginTop: -DefaultAppStyles.GAP_VERTICAL,
        height: 20,
        textAlignVertical: "center",
        textAlign: "center",
        ...style
      }}
      color={textColor || colors.primary.accentForeground}
      size={AppFontSize.xxs}
    >
      {text}
    </Paragraph>
  );
}
