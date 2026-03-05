import { ToolProps } from "../types.js";
import { ToolButton } from "../components/tool-button.js";
import { useToolbarLocation } from "../stores/toolbar-store.js";
import { CodeBlock } from "../../extensions/code-block/index.js";

export function Italic(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("italic")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    />
  );
}

export function Strikethrough(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("strike")}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    />
  );
}

export function Underline(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("underline")}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    />
  );
}

export function Code(props: ToolProps) {
  const { editor } = props;

  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("code")}
      disabled={editor.isActive(CodeBlock.name)}
      onClick={() => editor.chain().focus().toggleCode().run()}
    />
  );
}

export function Bold(props: ToolProps) {
  const { editor } = props;

  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("bold")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    />
  );
}

export function Subscript(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("subscript")}
      disabled={editor.isActive(CodeBlock.name)}
      onClick={() => editor.chain().focus().toggleSubscript().run()}
    />
  );
}

export function Superscript(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={editor.isActive("superscript")}
      disabled={editor.isActive(CodeBlock.name)}
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
    />
  );
}

export function ClearFormatting(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={() =>
        editor?.chain().focus().unsetAllMarks().unsetMark("link").run()
      }
    />
  );
}

export function CodeRemove(props: ToolProps) {
  const { editor } = props;
  const isBottom = useToolbarLocation() === "bottom";
  if (!editor.isActive("code") || !isBottom) return null;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={() => editor.chain().focus().unsetMark("code").run()}
    />
  );
}

export function Math(props: ToolProps) {
  const { editor } = props;
  return (
    <ToolButton
      icon={props.icon}
      title={props.title}
      toggled={false}
      onClick={() => editor.chain().focus().insertMathInline().run()}
      disabled={editor.isActive(CodeBlock.name)}
    />
  );
}
