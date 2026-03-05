import { ToolProps } from "../types.js";
import { ToolButton } from "../components/tool-button.js";
import { MoreTools } from "../components/more-tools.js";
import { useToolbarLocation } from "../stores/toolbar-store.js";
import {
  findSelectedNode,
  selectionToOffset
} from "../../utils/prosemirror.js";

export function WebClipSettings(props: ToolProps) {
  const { editor } = props;
  const isBottom = useToolbarLocation() === "bottom";
  if (!editor.isActive("webclip") || !isBottom) return null;

  return (
    <MoreTools
      {...props}
      autoCloseOnUnmount
      popupId="webclipSettings"
      tools={["webclipFullScreen", "webclipOpenSource"]}
    />
  );
}

export function WebClipFullScreen(props: ToolProps) {
  const { editor } = props;

  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={() => {
        const offset = selectionToOffset(editor.state);
        if (!offset) return;

        const dom = editor.view.nodeDOM(offset.from);
        if (!dom || !(dom instanceof HTMLElement)) return;

        const iframe = dom.querySelector("iframe");
        if (!iframe) return;

        iframe.requestFullscreen();
        editor.commands.updateAttributes("webclip", {
          fullscreen: true
        });
      }}
    />
  );
}

export function WebClipOpenExternal(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={async () => {
        const offset = selectionToOffset(editor.state);
        if (!offset) return;

        const dom = editor.view.nodeDOM(offset.from);
        if (!dom || !(dom instanceof HTMLElement)) return;

        const iframe = dom.querySelector("iframe");
        if (!iframe || !iframe.contentDocument) return;

        const url = URL.createObjectURL(
          new Blob(
            ["\ufeff", iframe.contentDocument.documentElement.outerHTML],
            { type: "text/html" }
          )
        );
        editor.storage.openLink?.(url);
      }}
    />
  );
}

export function WebClipOpenSource(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={async () => {
        const node = findSelectedNode(editor, "webclip");
        if (!node) return;
        editor.storage.openLink?.(node.attrs.src);
      }}
    />
  );
}
