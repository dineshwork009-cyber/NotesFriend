import { ToolbarGroupDefinition, ToolButtonVariant } from "../types.js";
import { findTool } from "../tools/index.js";
import { Flex, FlexProps } from "@theme-ui/components";
import { Editor } from "../../types.js";
import { MoreTools } from "./more-tools.js";
import { getToolDefinition } from "../tool-definitions.js";
import { strings } from "@notesfriend/intl";

export type ToolbarGroupProps = FlexProps & {
  tools: ToolbarGroupDefinition;
  editor: Editor;
  variant?: ToolButtonVariant;
  force?: boolean;
  groupId: string;
};
export function ToolbarGroup(props: ToolbarGroupProps) {
  const { tools, editor, force, sx, groupId, ...flexProps } = props;

  return (
    <Flex
      className="toolbar-group"
      sx={{
        gap: [0, 0, "small"],
        p: ["4px", "4px", "small"],
        flexShrink: 0,
        ...sx
      }}
      {...flexProps}
    >
      {tools.map((toolId) => {
        if (Array.isArray(toolId)) {
          return (
            <MoreTools
              parentGroup={groupId}
              key={"more-tools"}
              title={strings.more()}
              icon="more"
              popupId={toolId.join("")}
              tools={toolId}
              editor={editor}
            />
          );
        } else {
          const Component = findTool(toolId);
          const toolDefinition = getToolDefinition(toolId);
          return (
            <Component
              parentGroup={groupId}
              key={toolDefinition.title}
              editor={editor}
              force={force}
              {...toolDefinition}
            />
          );
        }
      })}
    </Flex>
  );
}
