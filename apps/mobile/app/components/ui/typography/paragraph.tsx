import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { Text, TextProps } from "react-native";
import { AppFontSize } from "../../../utils/size";
interface ParagraphProps extends TextProps {
  color?: string;
  size?: number;
}
const Paragraph = ({
  color,
  size = AppFontSize.sm,
  style,
  ...restProps
}: ParagraphProps) => {
  const { colors } = useThemeColors();

  return (
    <Text
      {...restProps}
      style={[
        {
          fontSize: size || AppFontSize.sm,
          color: color || colors.primary.paragraph,
          fontWeight: "400",
          fontFamily: "Inter-Regular"
        },
        style
      ]}
    />
  );
};

export default Paragraph;
