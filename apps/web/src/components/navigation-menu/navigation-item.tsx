import { Button, Flex, FlexProps, Text } from "@theme-ui/components";
import { Menu } from "../../hooks/use-menu";
import { PropsWithChildren } from "react";
import { Icon } from "../icons";
import { SchemeColors, createButtonVariant } from "@notesfriend/theme";
import { MenuItem } from "@notesfriend/ui";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppEventManager, AppEvents } from "../../common/app-events";

type NavigationItemProps = {
  icon?: Icon;
  color?: SchemeColors;
  title?: string;
  isCollapsed?: boolean;
  isLoading?: boolean;
  selected?: boolean;
  onClick?: () => void;
  menuItems?: MenuItem[];
};

function NavigationItem(
  props: PropsWithChildren<
    NavigationItemProps & { containerRef?: React.Ref<HTMLElement> } & FlexProps
  >
) {
  const {
    icon: Icon,
    color,
    title,
    isLoading,
    children,
    isCollapsed,
    selected,
    onClick,
    menuItems,
    sx,
    containerRef,
    ...restProps
  } = props;

  return (
    <Flex
      {...restProps}
      ref={containerRef}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.focus();
      }}
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
        px: isCollapsed ? 1 : 2,
        py: 1,
        alignItems: "center",
        position: "relative",
        ":focus": { bg: selected ? "hover-selected" : "hover" },
        ...sx
      }}
      onClick={() => {
        AppEventManager.publish(AppEvents.toggleSideMenu, false);
        if (onClick) onClick();
      }}
      data-test-id={`navigation-item`}
      title={title}
      onContextMenu={(e) => {
        if (!menuItems) return;
        e.preventDefault();
        e.stopPropagation();
        Menu.openMenu(menuItems);
      }}
    >
      <Flex
        sx={{
          p: 0,
          flex: 1,
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start"
        }}
      >
        {Icon ? (
          <Icon
            size={isCollapsed ? 16 : 14}
            color={color || (selected ? "icon-selected" : "icon")}
            rotate={isLoading}
          />
        ) : null}

        {isCollapsed ? null : (
          <Text
            variant="body"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "normal",
              color: selected ? "paragraph-selected" : "paragraph"
            }}
            ml={1}
            data-test-id="title"
          >
            {title}
          </Text>
        )}
      </Flex>
      {children && !isCollapsed ? children : null}
    </Flex>
  );
}
export default NavigationItem;

export function SortableNavigationItem(
  props: PropsWithChildren<
    {
      id: string;
      onDragEnter?: React.DragEventHandler<HTMLElement>;
      onDragLeave?: React.DragEventHandler<HTMLElement>;
      onDrop?: React.DragEventHandler<HTMLElement>;
    } & NavigationItemProps
  >
) {
  const { id, ...restProps } = props;
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  return (
    <NavigationItem
      {...restProps}
      containerRef={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        visibility: active?.id === id ? "hidden" : "visible"
      }}
      {...listeners}
      {...attributes}
    />
  );
}
