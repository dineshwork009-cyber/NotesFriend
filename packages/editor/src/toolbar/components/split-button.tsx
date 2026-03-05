import { PropsWithChildren } from "react";
import { Flex } from "@theme-ui/components";
import { ToolButton, ToolButtonProps } from "./tool-button.js";
import { useIsMobile, useToolbarLocation } from "../stores/toolbar-store.js";
import React from "react";

export type SplitButtonProps = ToolButtonProps & {
  onOpen: () => void;
};
function _SplitButton(props: PropsWithChildren<SplitButtonProps>) {
  const { children, onOpen, sx, toggled, buttonRef, ...toolButtonProps } =
    props;

  const toolbarLocation = useToolbarLocation();
  const isMobile = useIsMobile();

  return (
    <>
      <Flex
        ref={buttonRef}
        sx={{
          flexShrink: 0,
          alignItems: "stretch",
          borderRadius: "default",
          overflow: "hidden",
          ":hover": {
            bg: isMobile ? "transparent" : "hover-secondary"
          }
        }}
      >
        <ToolButton
          {...toolButtonProps}
          sx={{ mr: 0, borderRadius: 0, ...sx }}
          toggled={false}
        />
        <ToolButton
          variant="small"
          icon={toolbarLocation === "bottom" ? "chevronUp" : "chevronDown"}
          toggled={toggled}
          onClick={onOpen}
          sx={{ m: 0, borderRadius: 0, height: "unset" }}
        />
      </Flex>
      {children}
    </>
  );
}
export const SplitButton = React.memo(_SplitButton, (prev, next) => {
  return (
    prev.buttonRef === next.buttonRef &&
    prev.toggled === next.toggled &&
    JSON.stringify(prev.sx) === JSON.stringify(next.sx) &&
    prev.children === next.children
  );
});
