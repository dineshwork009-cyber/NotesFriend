import { createButtonVariant } from "@notesfriend/theme";
import { Button, Flex, FlexProps } from "@theme-ui/components";
import { Icon } from "../icons";

type TabItemProps = {
  icon: Icon;
  title?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function TabItem(props: TabItemProps & FlexProps) {
  const {
    icon: Icon,
    color,
    title,
    selected,
    onClick,
    sx,
    ...restProps
  } = props;

  return (
    <Flex
      {...restProps}
      sx={{
        ...createButtonVariant(
          selected ? "background-selected" : "transparent",
          "transparent",
          {
            hover: {
              bg: selected ? "hover-selected" : "hover"
            }
          }
        ),
        borderRadius: "default",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        ":focus": { bg: selected ? "hover-selected" : "hover" },
        p: 1,
        ...sx
      }}
      title={title}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <Icon size={16} color={color || (selected ? "icon-selected" : "icon")} />
    </Flex>
  );
}
