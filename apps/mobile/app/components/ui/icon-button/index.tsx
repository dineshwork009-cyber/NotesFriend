import { useThemeColors } from "@notesfriend/theme";
import React, { useRef } from "react";
import {
  ColorValue,
  GestureResponderEvent,
  TextStyle,
  useWindowDimensions
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { hexToRGBA, RGB_Linear_Shade } from "../../../utils/colors";
import { AppFontSize } from "../../../utils/size";
import NativeTooltip from "../../../utils/tooltip";
import { Pressable, PressableProps } from "../pressable";
export interface IconButtonProps extends PressableProps {
  name: string;
  color?: ColorValue;
  size?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  disabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: number;
  iconStyle?: TextStyle;
}

export const IconButton = ({
  onPress,
  name,
  color,
  style,
  size = AppFontSize.xxl,
  iconStyle = {},
  left = 10,
  right = 10,
  top = 30,
  bottom = 10,
  onLongPress,
  tooltipText,
  type = "plain",
  fwdRef,
  tooltipPosition = NativeTooltip.POSITIONS.TOP,
  ...restProps
}: IconButtonProps) => {
  const { colors } = useThemeColors();
  const localRef = useRef(null);
  const { fontScale } = useWindowDimensions();
  const growFactor = 1 + (fontScale - 1) / 10;

  const _onLongPress = (event: GestureResponderEvent) => {
    if (onLongPress) {
      onLongPress(event);
      return;
    }
    if (tooltipText) {
      NativeTooltip.show(
        {
          target: fwdRef?.current || localRef.current
        },
        tooltipText,
        tooltipPosition
      );
    }
  };

  return (
    <Pressable
      {...restProps}
      fwdRef={fwdRef || localRef}
      onPress={onPress}
      hitSlop={{ top: top, left: left, right: right, bottom: bottom }}
      onLongPress={_onLongPress}
      type={type}
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 40 * growFactor,
        height: 40 * growFactor,
        ...style
      }}
    >
      <Icon
        name={name}
        style={iconStyle as any}
        allowFontScaling
        color={
          restProps.disabled
            ? RGB_Linear_Shade(-0.05, hexToRGBA(colors.secondary.background))
            : colors.static[color as never] || color
        }
        size={size}
      />
    </Pressable>
  );
};
