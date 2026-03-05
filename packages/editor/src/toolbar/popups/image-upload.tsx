import { Input } from "@theme-ui/components";
import { useState } from "react";
import { Flex, Text } from "@theme-ui/components";
import { ImageAttributes } from "../../extensions/image/index.js";
import { Popup } from "../components/popup.js";
import { downloadImage, toDataURL } from "../../utils/downloader.js";
import { useToolbarStore } from "../stores/toolbar-store.js";
import { strings } from "@notesfriend/intl";
import { hasPermission } from "../../types.js";

export type ImageUploadPopupProps = {
  onInsert: (image: Partial<ImageAttributes>) => void;
  onClose: () => void;
};
export function ImageUploadPopup(props: ImageUploadPopupProps) {
  const { onInsert, onClose } = props;
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string>();
  const [url, setUrl] = useState<string>("");
  const downloadOptions = useToolbarStore((store) => store.downloadOptions);

  return (
    <Popup
      title={strings.attachImageFromURL()}
      onClose={onClose}
      action={{
        loading: isDownloading,
        title: strings.insert(),
        disabled: !url,
        onClick: async () => {
          if (!hasPermission("insertAttachment")) {
            return false;
          }

          setIsDownloading(true);
          setError(undefined);

          try {
            const image = await downloadImage(url, downloadOptions);
            if (!image) return;
            const { blob, size, mimeType } = image;
            onInsert({ src: await toDataURL(blob), size, mime: mimeType });
          } catch (e) {
            if (e instanceof Error) setError(e.message);
          } finally {
            setIsDownloading(false);
          }
        }
      }}
    >
      <Flex sx={{ px: 1, flexDirection: "column", width: ["auto", 350] }}>
        <Input
          type="url"
          autoFocus
          placeholder={strings.pasteImageURL()}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(undefined);
          }}
        />

        {error ? (
          <Text
            variant={"error"}
            sx={{
              bg: "var(--background-error)",
              mt: 1,
              p: 1,
              borderRadius: "default"
            }}
          >
            Failed to download image: {error.toLowerCase()}.
          </Text>
        ) : (
          <Text
            variant={"subBody"}
            sx={{
              bg: "shade",
              color: "accent",
              mt: 1,
              p: 1,
              borderRadius: "default"
            }}
          >
            To protect your privacy, we will download the image &amp; add it to
            your attachments.
          </Text>
        )}
      </Flex>
    </Popup>
  );
}
