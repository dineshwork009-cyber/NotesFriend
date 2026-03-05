import { useEffect, PropsWithChildren } from "react";
import {
  PositionOptions,
  PopupPresenterProps,
  PopupPresenter
} from "@notesfriend/ui";
import {
  getPopupContainer,
  getPopupRoot,
  getToolbarElement
} from "../../toolbar/utils/dom.js";
import {
  useIsMobile,
  useToolbarStore
} from "../../toolbar/stores/toolbar-store.js";
import React from "react";
import {
  ResponsivePresenter,
  ResponsivePresenterProps
} from "../responsive/index.js";

export type PopupWrapperProps = UsePopupHandlerOptions & {
  autoCloseOnUnmount?: boolean;
  position: PositionOptions;
} & Partial<Omit<PopupPresenterProps, "onClose" | "isOpen">>;
export function PopupWrapper(props: PropsWithChildren<PopupWrapperProps>) {
  const { id, position, children, autoCloseOnUnmount, ...presenterProps } =
    props;
  const { closePopup, isPopupOpen } = usePopupHandler(props);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!autoCloseOnUnmount) return;
    return () => {
      closePopup(id);
    };
  }, [autoCloseOnUnmount, id, closePopup]);

  return (
    <PopupPresenter
      key={id}
      onClose={() => closePopup(id)}
      position={position}
      blocking
      focusOnRender
      className={isMobile ? "editor-mobile-toolbar-popup" : undefined}
      isMobile={isMobile}
      container={getPopupContainer()}
      {...presenterProps}
      isOpen={isPopupOpen}
    >
      {children}
    </PopupPresenter>
  );
}

type UsePopupHandlerOptions = {
  id: string;
  group: string;
  onClosed?: () => void;
};
export function usePopupHandler(options: UsePopupHandlerOptions) {
  const { id, onClosed, group } = options;
  const openedPopups = useToolbarStore((store) => store.openedPopups);
  const closePopup = useToolbarStore((store) => store.closePopup);
  const closePopupGroup = useToolbarStore((store) => store.closePopupGroup);

  const isPopupOpen = typeof openedPopups[id] === "object";
  const isPopupDefined = typeof openedPopups[id] !== "undefined";

  useEffect(() => {
    // we don't want to close the popup just when it is about to open.
    if (!isPopupOpen && isPopupDefined) onClosed?.();
  }, [isPopupOpen, isPopupDefined, onClosed]);

  useEffect(() => {
    // if another popup in the same group is open, close it.
    if (isPopupOpen) {
      closePopupGroup(group, [id]);
    }
  }, [onClosed, isPopupOpen, closePopupGroup, id, group]);

  return { isPopupOpen, closePopup };
}

type ShowPopupOptions = {
  popup: (closePopup: () => void) => React.ReactNode;
} & Partial<ResponsivePresenterProps>;
export function showPopup(options: ShowPopupOptions) {
  const { popup, ...props } = options;

  const root = getPopupRoot();
  function hide() {
    root.unmount();
  }

  root.render(
    <ResponsivePresenter
      isOpen
      position={{
        target: getToolbarElement(),
        isTargetAbsolute: true,
        location: "below",
        align: "end",
        yOffset: 10
      }}
      blocking
      focusOnRender
      container={getPopupContainer()}
      {...props}
      onClose={() => {
        hide();
        props.onClose?.();
      }}
    >
      {popup(hide)}
    </ResponsivePresenter>
  );

  return hide;
}
