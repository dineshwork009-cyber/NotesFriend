import { Theme } from "@notesfriend/theme";
import { SchemeColors } from "@notesfriend/theme";
import React from "react";
import { ButtonProps } from "@theme-ui/components";
import { IconNames, Icons } from "../icons.js";
import { ToolButtonVariant } from "../types.js";
import { Button } from "../../components/button.js";
import { Icon } from "@notesfriend/ui";
import { useIsMobile } from "../stores/toolbar-store.js";

export type ToolButtonProps = ButtonProps & {
  icon: IconNames;
  iconColor?: SchemeColors;
  iconSize?: keyof Theme["iconSizes"] | number;
  toggled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  variant?: ToolButtonVariant;
};
export const ToolButton = React.memo(
  function ToolButton(props: ToolButtonProps) {
    const {
      id,
      icon,
      iconSize,
      iconColor,
      toggled,
      sx,
      buttonRef,
      variant = "normal",
      ...buttonProps
    } = props;
    const isMobile = useIsMobile();

    return (
      <Button
        variant="secondary"
        ref={buttonRef}
        tabIndex={-1}
        id={`tool-${id || icon}`}
        sx={{
          height: "unset",
          flexShrink: 0,
          p: variant === "small" ? "small" : 1,
          borderRadius: variant === "small" ? "small" : "default",
          m: 0,
          bg: toggled ? "background-selected" : "transparent",
          mr: variant === "small" ? 0 : 1,
          ":last-of-type": {
            mr: 0
          },
          ":hover:not(:disabled):not(:active)": !isMobile
            ? undefined
            : {
                bg: "transparent"
              },
          ...sx
        }}
        onMouseDown={(e) => {
          if (globalThis.keyboardShown) {
            e.preventDefault();
          }
        }}
        {...buttonProps}
      >
        <Icon
          path={Icons[icon]}
          color={iconColor || (toggled ? "icon-selected" : "icon")}
          size={iconSize || (variant === "small" ? "medium" : "big")}
        />
      </Button>
    );
  },
  (prev, next) => {
    return (
      prev.toggled === next.toggled &&
      prev.icon === next.icon &&
      prev.disabled === next.disabled &&
      prev.onClick === next.onClick &&
      JSON.stringify(prev.sx) === JSON.stringify(next.sx)
    );
  }
);
