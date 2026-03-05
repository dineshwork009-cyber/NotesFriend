import { ToolProps } from "../types.js";
import { Editor } from "../../types.js";
import { Dropdown } from "../components/dropdown.js";
import { MenuItem } from "@notesfriend/ui";
import { useCallback, useMemo } from "react";
import { Counter } from "../components/counter.js";
import { useRefValue } from "../../hooks/use-ref-value.js";
import { useToolbarStore } from "../stores/toolbar-store.js";
import { getFontById, getFontIds, getFonts } from "../../utils/font.js";
import { CodeBlock } from "../../extensions/code-block/index.js";
import { strings } from "@notesfriend/intl";

export function FontSize(props: ToolProps) {
  const { editor } = props;
  const defaultFontSize = useToolbarStore((store) => store.fontSize);
  const { fontSize } = editor.getAttributes("textStyle");
  const fontSizeAsNumber = useRefValue(
    fontSize ? parseInt(fontSize.replace("px", "")) || 14 : defaultFontSize
  );

  const decreaseFontSize = useCallback(() => {
    return Math.max(8, fontSizeAsNumber.current - 1);
  }, [fontSizeAsNumber]);

  const increaseFontSize = useCallback(() => {
    return Math.min(120, fontSizeAsNumber.current + 1);
  }, [fontSizeAsNumber]);

  return (
    <Counter
      title={strings.fontSize()}
      disabled={editor.isActive(CodeBlock.name)}
      onDecrease={() =>
        editor.chain().focus().setFontSize(`${decreaseFontSize()}px`).run()
      }
      onIncrease={() => {
        editor.chain().focus().setFontSize(`${increaseFontSize()}px`).run();
      }}
      onReset={() =>
        editor.chain().focus().setFontSize(`${defaultFontSize}px`).run()
      }
      value={fontSize || `${defaultFontSize}px`}
    />
  );
}

export function FontFamily(props: ToolProps) {
  const { editor } = props;
  const defaultFontFamily = useToolbarStore((store) => store.fontFamily);
  const currentFontFamily =
    getFontIds().find((id) =>
      editor.isActive("textStyle", { fontFamily: id })
    ) || defaultFontFamily;

  const items = useMemo(
    () => toMenuItems(editor, currentFontFamily),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFontFamily]
  );

  return (
    <Dropdown
      id="fontFamily"
      group="font"
      selectedItem={getFontById(currentFontFamily)?.title || defaultFontFamily}
      items={items}
      menuWidth={130}
      disabled={editor.isActive(CodeBlock.name)}
    />
  );
}

function toMenuItems(editor: Editor, currentFontFamily: string): MenuItem[] {
  const menuItems: MenuItem[] = [];
  for (const font of getFonts()) {
    menuItems.push({
      key: font.id,
      type: "button",
      title: font.title,
      isChecked: font.id === currentFontFamily,
      onClick: () => editor.chain().focus().setFontFamily(font.id).run(),
      styles: {
        title: {
          fontFamily: font.font
        }
      }
    });
  }
  return menuItems;
}
