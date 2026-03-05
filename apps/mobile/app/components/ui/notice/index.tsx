import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View, ViewStyle } from "react-native";
import { getContainerBorder } from "../../../utils/colors";
import { AppFontSize } from "../../../utils/size";
import { DefaultAppStyles } from "../../../utils/styles";
import AppIcon from "../AppIcon";
import Paragraph from "../typography/paragraph";

export interface NoticeProps {
  type?: "alert" | "information";
  text: string;
  size?: "small" | "large";
  selectable?: boolean;
  style?: ViewStyle;
}

export const Notice = ({
  type = "alert",
  text,
  size = "large",
  selectable,
  style
}: NoticeProps) => {
  const { colors } = useThemeColors();
  const isSmall = size === "small";

  return (
    <View
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        paddingLeft: 5,
        paddingVertical: DefaultAppStyles.GAP_VERTICAL,
        flexDirection: "row",
        backgroundColor: colors.secondary.background,
        borderRadius: isSmall ? 5 : 10,
        alignItems: "flex-start",
        gap: 5,
        ...getContainerBorder(colors.secondary.background),
        ...style
      }}
    >
      <AppIcon
        size={isSmall ? AppFontSize.md + 2 : AppFontSize.xxl}
        name={type}
        color={type === "alert" ? colors.error.icon : colors.primary.accent}
      />
      <Paragraph
        style={{
          flexShrink: 1
        }}
        selectable={selectable}
        size={isSmall ? AppFontSize.xs : AppFontSize.sm}
      >
        {text}
      </Paragraph>
    </View>
  );
};
