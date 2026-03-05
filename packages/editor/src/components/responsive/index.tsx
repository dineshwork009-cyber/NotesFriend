import { PropsWithChildren } from "react";
import { useIsMobile } from "../../toolbar/stores/toolbar-store.js";
import {
  ActionSheetPresenter,
  ActionSheetPresenterProps
} from "../action-sheet/index.js";
import {
  MenuPresenter,
  MenuPresenterProps,
  PopupPresenter,
  PopupPresenterProps
} from "@notesfriend/ui";
import { getPopupContainer } from "../../toolbar/utils/dom.js";

type ResponsiveContainerProps = {
  mobile?: JSX.Element;
  desktop?: JSX.Element;
};

export function ResponsiveContainer(props: ResponsiveContainerProps) {
  const isMobile = useIsMobile();
  if (isMobile) return props.mobile || null;
  else return props.desktop || null;
}

export function DesktopOnly(props: PropsWithChildren<unknown>) {
  return <ResponsiveContainer desktop={<>{props.children}</>} />;
}

export function MobileOnly(props: PropsWithChildren<unknown>) {
  return <ResponsiveContainer mobile={<>{props.children}</>} />;
}

export type PopupType = "sheet" | "menu" | "none" | "popup";
export type ResponsivePresenterProps = MenuPresenterProps &
  ActionSheetPresenterProps &
  PopupPresenterProps & {
    mobile?: PopupType;
    desktop?: PopupType;
  };

export function ResponsivePresenter(
  props: PropsWithChildren<ResponsivePresenterProps>
) {
  const { mobile = "menu", desktop = "menu", ...restProps } = props;
  const isMobile = useIsMobile();
  if (isMobile && mobile === "sheet")
    return <ActionSheetPresenter {...restProps} />;
  else if (mobile === "menu" || desktop === "menu")
    return <MenuPresenter {...restProps} />;
  else if (mobile === "popup" || desktop === "popup") {
    return <PopupPresenter container={getPopupContainer()} {...restProps} />;
  } else return props.isOpen ? <>{props.children}</> : null;
}
