import { Editor } from "../../types.js";
import { MenuButtonItem } from "@notesfriend/ui";
import { ToolButton } from "../components/tool-button.js";
import { ToolDefinition, ToolProps } from "../types.js";
import { IconNames, Icons } from "../icons.js";

export function menuButtonToTool(
  constructItem: (editor: Editor) => MenuButtonItem
) {
  return function Tool(props: ToolProps & { icon: IconNames }) {
    const item = constructItem(props.editor);
    return (
      <ToolButton
        {...props}
        icon={props.icon}
        toggled={item.isChecked || false}
        title={item.title}
        onClick={item.onClick}
      />
    );
  };
}

export function toolToMenuButton(tool: ToolDefinition): MenuButtonItem {
  return {
    ...tool,
    type: "button",
    icon: Icons[tool.icon],
    key: tool.title
  };
}
