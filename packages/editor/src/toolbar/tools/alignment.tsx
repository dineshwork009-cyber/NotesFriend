import { ToolProps } from "../types.js";
import { ToolButton } from "../components/tool-button.js";
import { useRefValue } from "../../hooks/use-ref-value.js";
import { IconNames } from "../icons.js";
import { CodeBlock } from "../../extensions/code-block/index.js";

type Alignment = "left" | "right" | "center" | "justify";
type AlignmentToolProps = ToolProps & {
  alignment: Alignment;
};
function AlignmentTool(props: AlignmentToolProps) {
  const { editor, alignment } = props;
  const alignmentRef = useRefValue(alignment);

  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      onClick={() => {
        editor.chain().focus().setTextAlign(alignmentRef.current).run();
      }}
      disabled={editor.isActive(CodeBlock.name)}
      toggled={false}
    />
  );
}

export function Alignment(props: ToolProps) {
  const { editor } = props;
  const { textAlign } = {
    ...editor.getAttributes("paragraph"),
    ...editor.getAttributes("heading")
  } as { textAlign: Alignment };

  const newAlignment: Alignment =
    textAlign === "left"
      ? "center"
      : textAlign === "center"
      ? "right"
      : textAlign === "right"
      ? "justify"
      : textAlign === "justify"
      ? "left"
      : "left";

  const icon: IconNames =
    textAlign === "center"
      ? "alignCenter"
      : textAlign === "justify"
      ? "alignJustify"
      : textAlign === "right"
      ? "alignRight"
      : "alignLeft";

  return <AlignmentTool alignment={newAlignment} {...props} icon={icon} />;
}
