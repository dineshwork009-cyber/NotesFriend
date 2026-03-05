import { SchemeColors } from "@notesfriend/theme";
import { Flex, FlexProps, Text } from "@theme-ui/components";
import { PropsWithChildren, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "../icons";

export type AccordionProps = {
  title: string;
  isClosed: boolean;
  color?: SchemeColors;
  testId?: string;
  buttonSx?: FlexProps["sx"];
  titleSx?: FlexProps["sx"];
  containerSx?: FlexProps["sx"];
};

export default function Accordion(
  props: PropsWithChildren<AccordionProps> & FlexProps
) {
  const {
    isClosed,
    title,
    color,
    children,
    testId,
    sx,
    containerSx,
    ...restProps
  } = props;
  const [isContentHidden, setIsContentHidden] = useState(isClosed);

  return (
    <Flex sx={{ flexDirection: "column", ...sx }} {...restProps}>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          bg: "var(--background-secondary)",
          p: 1,
          borderRadius: "default",
          ...props.buttonSx
        }}
        onClick={() => {
          setIsContentHidden((state) => !state);
        }}
        data-test-id={testId}
      >
        <Text variant="subtitle" sx={{ color, ...props.titleSx }}>
          {title}
        </Text>
        {isContentHidden ? (
          <ChevronDown size={16} color={color} />
        ) : (
          <ChevronUp size={16} color={color} />
        )}
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          ...containerSx,
          display: isContentHidden ? "none" : "flex"
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
}
