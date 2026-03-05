import { useWindowControls } from "../../hooks/use-window-controls";
import { isMac } from "../../utils/platform";
import { BaseThemeProvider } from "../theme-provider";
import { strings } from "@notesfriend/intl";
import { desktop } from "../../common/desktop-bridge";
import {
  WindowClose,
  WindowMaximize,
  WindowMinimize,
  WindowRestore
} from "../icons";
import { Button, Flex } from "@theme-ui/components";
import useMobile from "../../hooks/use-mobile";
import useTablet from "../../hooks/use-tablet";

export function getWindowControls(
  hasNativeWindowControls: boolean,
  isFullscreen?: boolean,
  isMaximized?: boolean,
  isTablet?: boolean,
  isMobile?: boolean
) {
  if (isMobile || isTablet) return [];
  return [
    {
      title: strings.minimize(),
      icon: WindowMinimize,
      hidden: hasNativeWindowControls || isFullscreen,
      enabled: true,
      onClick: () => desktop?.window.minimze.mutate()
    },
    {
      title: isMaximized ? strings.restore() : strings.maximize(),
      icon: isMaximized ? WindowRestore : WindowMaximize,
      enabled: true,
      hidden: hasNativeWindowControls || isFullscreen,
      onClick: () =>
        isMaximized
          ? desktop?.window.restore.mutate()
          : desktop?.window.maximize.mutate()
    },
    {
      title: strings.close(),
      icon: WindowClose,
      hidden: hasNativeWindowControls || isFullscreen,
      enabled: true,
      onClick: () => window.close()
    }
  ];
}
export const TITLE_BAR_HEIGHT = 37;
export function TitleBar({ isUnderlay = isMac() }: { isUnderlay?: boolean }) {
  const { isFullscreen, hasNativeWindowControls, isMaximized } =
    useWindowControls();
  const isTablet = useTablet();
  const isMobile = useMobile();
  if ((!isMac() && !isMobile && !isTablet) || (isFullscreen && isMac()))
    return null;

  const tools = getWindowControls(
    hasNativeWindowControls,
    isFullscreen,
    isMaximized
  );
  return (
    <BaseThemeProvider
      scope="titleBar"
      className="titlebar"
      sx={{
        // background: "background",
        height: TITLE_BAR_HEIGHT,
        minHeight: TITLE_BAR_HEIGHT,
        maxHeight: TITLE_BAR_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        flexShrink: 0,
        width: "100%",
        zIndex: 1,
        //borderBottom: "1px solid var(--border)",
        ...(isUnderlay
          ? {
              position: "absolute",
              top: 0
            }
          : {})
      }}
      injectCssVars
    >
      {tools.filter((t) => !t.hidden).length > 0 ? (
        <svg
          className="titlebarLogo"
          style={{
            alignSelf: "center",
            height: 16,
            width: 12,
            marginRight: 10,
            marginLeft: 10
          }}
        >
          <use href="#themed-logo" />
        </svg>
      ) : null}
      <Flex sx={{ alignItems: "center" }}>
        {tools.map((tool) => (
          <Button
            data-test-id={tool.title}
            disabled={!tool.enabled}
            variant={tool.title === "Close" ? "error" : "secondary"}
            title={tool.title}
            key={tool.title}
            sx={{
              height: "100%",
              alignItems: "center",
              bg: "transparent",
              display: tool.hidden ? "none" : "flex",
              borderRadius: 0,
              flexShrink: 0,
              "&:hover svg path": {
                fill:
                  tool.title === "Close"
                    ? "var(--accentForeground-error) !important"
                    : "var(--icon)"
              }
            }}
            onClick={tool.onClick}
          >
            <tool.icon size={18} />
          </Button>
        ))}
      </Flex>
    </BaseThemeProvider>
  );
}
