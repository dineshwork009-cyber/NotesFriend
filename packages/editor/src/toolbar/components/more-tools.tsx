import { useEffect, useRef } from "react";
import { PopupWrapper } from "../../components/popup-presenter/index.js";
import { ToolButton } from "../components/tool-button.js";
import { usePopupManager, useToolbarLocation } from "../stores/toolbar-store.js";
import { ToolProps } from "../types.js";
import { getToolbarElement } from "../utils/dom.js";
import { ToolId } from "../tools/index.js";
import { ToolbarGroup } from "./toolbar-group.js";

type MoreToolsProps = ToolProps & {
  popupId: string;
  tools: ToolId[];
  autoCloseOnUnmount?: boolean;
  autoOpen?: boolean;
  group?: string;
};
export function MoreTools(props: MoreToolsProps) {
  const { popupId, editor, tools, autoCloseOnUnmount, autoOpen } = props;
  const toolbarLocation = useToolbarLocation();
  const isBottom = toolbarLocation === "bottom";
  const group = isBottom ? "mobile" : "toolbarGroup";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { open, toggle, isOpen, isPinned, togglePinned } = usePopupManager({
    id: popupId,
    group
  });

  useEffect(() => {
    if (autoOpen) {
      open();
      togglePinned();
    }
  }, [autoOpen]);

  return (
    <>
      <ToolButton
        {...props}
        toggled={isOpen}
        buttonRef={buttonRef}
        onClick={toggle}
      />
      <PopupWrapper
        scope="editorToolbar"
        group={group}
        id={popupId}
        position={{
          isTargetAbsolute: true,
          target: isBottom ? getToolbarElement() : buttonRef.current || "mouse",
          align: "center",
          location: isBottom ? "top" : "below",
          yOffset: 10
        }}
        autoCloseOnUnmount={autoCloseOnUnmount}
        focusOnRender={false}
        blocking={false}
        sx={{
          display: "flex",
          boxShadow: "menu",
          bg: "background",
          gap: [0, 0, "small"],
          p: ["4px", "4px", "small"],
          flex: 1,
          borderRadius: "default",
          overflowX: "auto",
          maxWidth: "95vw"
        }}
      >
        <ToolbarGroup
          tools={tools}
          editor={editor}
          groupId={popupId}
          sx={{
            p: 0,
            borderRight: autoOpen ? "none" : "1px solid var(--border)",
            pr: autoOpen ? 0 : ["4px", "4px", "small"],
            mr: autoOpen ? 0 : ["4px", "4px", "small"]
          }}
        />
        {autoOpen ? null : (
          <ToolButton
            toggled={isPinned}
            onClick={togglePinned}
            icon="pin"
            variant="small"
          />
        )}
      </PopupWrapper>
    </>
  );
}
