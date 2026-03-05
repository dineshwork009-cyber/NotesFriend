import { MDIIcon } from "./mdi-icon";
import { Theme } from "@notesfriend/theme";
import { isThemeColor, SchemeColors } from "@notesfriend/theme";
import { Flex, FlexProps } from "@theme-ui/components";
import { useTheme } from "@emotion/react";

type MDIIconWrapper = {
  title?: string;
  path: string;
  size?: keyof Theme["iconSizes"] | number | string;
  color?: SchemeColors;
  stroke?: string;
  rotate?: boolean;
};
function MDIIconWrapper({
  title,
  path,
  size = 24,
  color = "icon",
  stroke,
  rotate
}: MDIIconWrapper) {
  const theme = useTheme() as Theme;
  const themedColor =
    theme?.colors && isThemeColor(color, theme.colors)
      ? theme.colors[color]
      : color;

  return (
    <MDIIcon
      className="icon"
      title={title}
      path={path}
      size={
        theme && typeof size === "string" && size in theme.iconSizes
          ? `${(theme?.iconSizes as any)[size] || 24}px`
          : typeof size === "string"
          ? size
          : `${size}px`
      }
      style={{
        strokeWidth: stroke || "0px",
        stroke: themedColor
      }}
      color={themedColor}
      spin={rotate}
    />
  );
}

export type IconProps = FlexProps & MDIIconWrapper;

export function Icon(props: IconProps) {
  const { sx, title, color, size, stroke, rotate, path, ...restProps } = props;

  return (
    <Flex
      sx={{
        flexShrink: 0,
        justifyContent: "center",
        alignItems: "center",
        ...sx
      }}
      {...restProps}
    >
      <MDIIconWrapper
        title={title}
        path={path}
        rotate={rotate}
        color={color}
        stroke={stroke}
        size={size}
      />
    </Flex>
  );
}
