import React from "react";
import { Flex, Text } from "@theme-ui/components";
import { ToolButton } from "./tool-button.js";
import { useIsMobile } from "../stores/toolbar-store.js";
import { strings } from "@notesfriend/intl";

export type CounterProps = {
  title: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  value: string;
  disabled?: boolean;
};
function _Counter(props: CounterProps) {
  const { title, onDecrease, onIncrease, onReset, value, disabled } = props;
  const isMobile = useIsMobile();

  return (
    <Flex
      sx={{
        alignItems: "stretch",
        borderRadius: "default",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        height: "100%",
        ":hover": {
          bg: isMobile || disabled ? "transparent" : "hover-secondary"
        }
      }}
      onClick={disabled ? undefined : onReset}
      title={disabled ? "" : strings.clickToReset(title)}
    >
      <ToolButton
        toggled={false}
        title={strings.decrease(title)}
        icon="minus"
        variant={"small"}
        disabled={disabled}
        onClick={
          disabled
            ? undefined
            : (e) => {
                e.stopPropagation();
                onDecrease();
              }
        }
      />

      <Text
        sx={{
          color: "paragraph",
          fontSize: "subBody",
          alignSelf: "center",
          mx: 1,
          textAlign: "center",
          opacity: disabled ? 0.5 : 1
        }}
      >
        {value}
      </Text>

      <ToolButton
        toggled={false}
        title={strings.increase(title)}
        icon="plus"
        variant={"small"}
        disabled={disabled}
        onClick={
          disabled
            ? undefined
            : (e) => {
                e.stopPropagation();
                onIncrease();
              }
        }
      />
    </Flex>
  );
}

export const Counter = React.memo(_Counter, (prev, next) => {
  return prev.value === next.value && prev.disabled === next.disabled;
});
