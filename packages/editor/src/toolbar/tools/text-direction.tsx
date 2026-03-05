import { ToolProps } from "../types.js";
import { ToolButton } from "../components/tool-button.js";
import { IconNames } from "../icons.js";
import { useRefValue } from "../../hooks/use-ref-value.js";
import {
  getTextDirection,
  TextDirections
} from "../../extensions/text-direction/index.js";
import { CodeBlock } from "../../extensions/code-block/index.js";

type TextDirectionToolProps = ToolProps & {
  direction: TextDirections;
};
function TextDirectionTool(props: TextDirectionToolProps) {
  const { editor, direction } = props;
  const directionRef = useRefValue(direction);

  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      onClick={() =>
        editor.chain().focus().setTextDirection(directionRef.current).run()
      }
      disabled={editor.isActive(CodeBlock.name)}
      toggled={false}
    />
  );
}

export function TextDirection(props: ToolProps) {
  const { editor } = props;
  const textDirection = getTextDirection(editor);

  const newTextDirection: TextDirections = textDirection ? undefined : "rtl";

  const icon: IconNames = textDirection ? "rtl" : "ltr";

  return (
    <TextDirectionTool direction={newTextDirection} {...props} icon={icon} />
  );
}
