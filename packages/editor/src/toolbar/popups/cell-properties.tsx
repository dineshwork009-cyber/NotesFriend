import { Editor } from "../../types.js";
import { Box } from "@theme-ui/components";
import { Tab, Tabs } from "../../components/tabs/index.js";
import { Icon } from "@notesfriend/ui";
// import { MenuPresenter } from "../../components/menu/menu";
import { Popup } from "../components/popup.js";
import { Icons } from "../icons.js";
import { ColorPicker } from "./color-picker.js";
import { strings } from "@notesfriend/intl";

type CellPropertiesProps = { editor: Editor; onClose: () => void };
export function CellProperties(props: CellPropertiesProps) {
  const { editor, onClose } = props;
  const attributes = editor.getAttributes("tableCell");
  return (
    <Popup title={strings.cellProperties()} onClose={onClose}>
      <Tabs activeIndex={0}>
        <Tab
          title={
            <Icon
              title={strings.cellBackgroundColor()}
              path={Icons.backgroundColor}
              size={16}
            />
          }
        >
          <Box mt={2} />
          <ColorPicker
            editor={editor}
            expanded={true}
            color={attributes.backgroundColor}
            onChange={(color) =>
              editor.commands.setCellAttribute("backgroundColor", color)
            }
            onClear={() =>
              editor.commands.setCellAttribute("backgroundColor", undefined)
            }
          />
        </Tab>
        <Tab
          title={
            <Icon
              title={strings.cellTextColor()}
              path={Icons.textColor}
              size={16}
            />
          }
        >
          <Box mt={2} />
          <ColorPicker
            editor={editor}
            expanded={true}
            color={attributes.color}
            onChange={(color) =>
              editor.commands.setCellAttribute("color", color)
            }
            onClear={() => editor.commands.setCellAttribute("color", undefined)}
          />
        </Tab>
        <Tab
          title={
            <Icon
              title={strings.cellBorderColor()}
              path={Icons.cellBorderColor}
              size={16}
            />
          }
        >
          <Box mt={2} />
          <ColorPicker
            editor={editor}
            expanded={true}
            color={attributes.borderColor}
            onChange={(color) =>
              editor.commands.setCellAttribute("borderColor", color)
            }
            onClear={() =>
              editor.commands.setCellAttribute("borderColor", undefined)
            }
          />
        </Tab>
      </Tabs>
    </Popup>
  );
}
