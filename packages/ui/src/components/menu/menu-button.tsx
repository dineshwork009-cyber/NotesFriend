import { useRef } from "react";
import { Flex, Text, Button } from "@theme-ui/components";
import { Icon } from "../icon/index.js";
import { MenuButtonItem, MenuItemComponentProps } from "./types.js";
import { mdiCheck, mdiChevronRight, mdiCrown, mdiLock } from "@mdi/js";

type MenuButtonProps = {
  item: MenuButtonItem;
  isFocused?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
} & MenuItemComponentProps;

export function MenuButton(props: MenuButtonProps) {
  const { item, isFocused, onMouseEnter, onMouseLeave, onClick } = props;
  const {
    title,
    key,
    icon,
    tooltip,
    isDisabled,
    isChecked,
    menu,
    modifier,
    styles,
    premium,
    variant = "normal"
  } = item;
  const itemRef = useRef<HTMLButtonElement>(null);

  return (
    <Flex
      as="li"
      sx={{ flexShrink: 0, flexDirection: "column" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        id={`menu-item-${key}`}
        data-test-id={`menu-button-${key}`}
        key={key}
        ref={itemRef}
        tabIndex={-1}
        variant="menuitem"
        title={tooltip}
        disabled={isDisabled}
        onClick={(e) => onClick?.(e.nativeEvent)}
        sx={{
          bg: isFocused && "background-selected",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Flex
          sx={{ fontSize: "inherit", fontFamily: "inherit", flexShrink: 0 }}
        >
          <Icon
            path={icon || ""}
            size={"medium"}
            sx={{ mr: 1 }}
            color={
              (styles?.icon?.color as string) ||
              (variant === "dangerous" ? "icon-error" : "icon")
            }
          />
          <Text
            as="span"
            variant={"body"}
            sx={{
              fontSize: "inherit",
              fontFamily: "inherit",
              color: variant === "dangerous" ? "paragraph-error" : "paragraph",
              textAlign: "left",
              flexShrink: 0,
              ...styles?.title
            }}
          >
            {title}
          </Text>
        </Flex>
        {isChecked || menu || modifier || premium ? (
          <Flex
            sx={{ ml: 4, flexShrink: 0, gap: 1 }}
            data-test-id={`toggle-state-${isChecked ? "on" : "off"}`}
          >
            {premium && (
              <Icon path={mdiCrown} size={"small"} color={"#e8b923"} />
            )}
            {modifier && (
              <Text
                as="span"
                sx={{
                  fontFamily: "body",
                  fontSize: "subBody",
                  color: "paragraph-secondary",
                  mr: isChecked || menu ? 1 : 19
                }}
              >
                {translateModifier(modifier)}
              </Text>
            )}
            {isChecked && (
              <Icon
                path={mdiCheck}
                size={"small"}
                color={variant === "dangerous" ? "icon-error" : "icon"}
              />
            )}
            {menu && (
              <Icon
                path={mdiChevronRight}
                size={"small"}
                color={variant === "dangerous" ? "icon-error" : "icon"}
              />
            )}
          </Flex>
        ) : null}
      </Button>
    </Flex>
  );
}

function translateModifier(modifier: string) {
  const platform = getPlatform();
  if (platform === "Android" || platform === "iOS") return "";
  const isMacOS = platform === "macOS";
  const parts = modifier.split("-");
  return parts
    .map((p) => {
      if (isMacOS) {
        return p === "Mod" ? "⌘" : p === "Alt" ? "⌥" : p === "Shift" ? "⇧" : p;
      }
      return p === "Mod" ? "Ctrl" : p;
    })
    .join(isMacOS ? "" : "+");
}

function getPlatform() {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    return "macOS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return "Windows";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else if (!os && /Linux/.test(platform)) {
    return "Linux";
  }

  return os;
}
