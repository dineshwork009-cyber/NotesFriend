import { Flex } from "@theme-ui/components";
import { Popup } from "../components/popup.js";
import { ImageAttributes } from "../../extensions/image/index.js";
import { Editor } from "../../types.js";
import { InlineInput } from "../../components/inline-input/index.js";
import { findSelectedNode } from "../../utils/prosemirror.js";
import { strings } from "@notesfriend/intl";

export type ImagePropertiesProps = {
  editor: Editor;
  onClose: () => void;
};
export function ImageProperties(props: ImagePropertiesProps) {
  const { editor, onClose } = props;

  const image = findSelectedNode(editor, "image");
  if (!image) return null;

  const { width, height, aspectRatio } = image.attrs as ImageAttributes;

  return (
    <Popup title={strings.imageProperties()} onClose={onClose}>
      <Flex sx={{ width: ["auto", 300], alignItems: "center", p: 1 }}>
        <InlineInput
          label="width"
          type="number"
          value={width || 0}
          containerProps={{
            sx: { mr: 1 }
          }}
          onChange={(e) => {
            editor.commands.setImageSize({
              width: e.target.valueAsNumber,
              height: aspectRatio
                ? e.target.valueAsNumber / aspectRatio
                : e.target.valueAsNumber
            });
          }}
        />
        <InlineInput
          label="height"
          type="number"
          value={height || 0}
          onChange={(e) => {
            editor.commands.setImageSize({
              width: aspectRatio
                ? e.target.valueAsNumber * aspectRatio
                : e.target.valueAsNumber,
              height: e.target.valueAsNumber
            });
          }}
        />
      </Flex>
    </Popup>
  );
}
