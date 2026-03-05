import React from "react";
import { View, ViewProps } from "react-native";
import { DDS } from "../../services/device-detection";
import { useThemeColors } from "@notesfriend/theme";
import { getElevationStyle } from "../../utils/elevation";
import { getContainerBorder } from "../../utils/colors";

const DialogContainer = ({
  width,
  height,
  style,
  ...restProps
}: ViewProps & {
  width?: any;
  height?: any;
  noBorder?: boolean;
}) => {
  const { colors } = useThemeColors();

  return (
    <View
      {...restProps}
      style={[
        style,
        {
          width: width || DDS.isTab ? 500 : "85%",
          maxHeight: height || 450,
          borderRadius: 10,
          backgroundColor: colors.primary.background,
          paddingTop: 12
        },
        restProps?.noBorder
          ? {}
          : {
              ...getElevationStyle(5),
              ...getContainerBorder(colors.secondary.background, 0.8, 0.05)
            }
      ]}
    />
  );
};

export default DialogContainer;
