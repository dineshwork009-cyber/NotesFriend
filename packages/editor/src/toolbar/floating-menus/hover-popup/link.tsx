import { ToolbarGroup } from "../../components/toolbar-group.js";
import { HoverPopupProps } from "./index.js";
import { useHoverPopupContext } from "./context.js";
import { ToolbarGroupDefinition } from "../../types.js";

const LINK_TOOLS: ToolbarGroupDefinition = [
  "openLink",
  "editLink",
  "removeLink",
  "copyLink"
];
function LinkHoverPopup(props: HoverPopupProps) {
  const { editor } = props;
  const { selectedNode } = useHoverPopupContext();
  const { node } = selectedNode || {};

  if (
    !node?.isText ||
    node.marks.length <= 0 ||
    !node.marks.some((mark) => mark.type.name === "link")
  )
    return null;

  return (
    <ToolbarGroup
      force
      tools={LINK_TOOLS}
      groupId={"linkHoverTools"}
      editor={editor}
      sx={{
        bg: "background",
        boxShadow: "menu",
        borderRadius: "default",
        p: 1
      }}
    />
  );
}

export const LinkHoverPopupHandler = {
  isActive: (e: HTMLElement) => !!e.closest("a"),
  popup: LinkHoverPopup
};
