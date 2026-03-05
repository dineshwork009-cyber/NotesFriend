import { ToolProps } from "../types.js";
import { Editor } from "../../types.js";
import { Dropdown } from "../components/dropdown.js";
import { MenuItem } from "@notesfriend/ui";
import {
  ToolbarLocation,
  useToolbarLocation
} from "../stores/toolbar-store.js";
import { useMemo } from "react";
import { CodeBlock } from "../../extensions/code-block/index.js";
import { strings } from "@notesfriend/intl";
import { keybindings } from "@notesfriend/common";

const defaultLevels = [1, 2, 3, 4, 5, 6] as const;

export function Headings(props: ToolProps) {
  const { editor } = props;
  const toolbarLocation = useToolbarLocation();

  const currentHeadingLevel = defaultLevels.find((level) =>
    editor.isActive("heading", { level })
  );
  const items = useMemo(
    () => toMenuItems(editor, toolbarLocation, currentHeadingLevel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentHeadingLevel, toolbarLocation]
  );

  return (
    <Dropdown
      id="headings"
      group="headings"
      selectedItem={
        currentHeadingLevel
          ? strings.heading(currentHeadingLevel)
          : strings.paragraph()
      }
      items={items}
      menuWidth={130}
      disabled={editor.isActive(CodeBlock.name)}
    />
  );
}

function toMenuItems(
  editor: Editor,
  toolbarLocation: ToolbarLocation,
  currentHeadingLevel?: number
): MenuItem[] {
  const menuItems: MenuItem[] = defaultLevels.map((level) => ({
    type: "button",
    key: `heading-${level}`,
    title: toolbarLocation === "bottom" ? `H${level}` : strings.heading(level),
    isChecked: level === currentHeadingLevel,
    modifier: keybindings[`insertHeading${level}`].keys,
    onClick: () =>
      editor
        ?.chain()
        .focus()
        .updateAttributes("textStyle", { fontSize: null, fontStyle: null })
        .setHeading({ level })
        .run()
  }));
  const paragraph: MenuItem = {
    key: "paragraph",
    type: "button",
    title: strings.paragraph(),
    isChecked: !currentHeadingLevel,
    modifier: keybindings.insertParagraph.keys,
    onClick: () => editor.chain().focus().setParagraph().run()
  };
  return [paragraph, ...menuItems];
}
