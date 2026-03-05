import { useEffect, useState } from "react";
import Dialog from "../components/dialog";
import { ScrollContainer } from "@notesfriend/ui";
import { Flex, Image, Label, Text } from "@theme-ui/components";
import { formatBytes } from "@notesfriend/common";
import { compressImage, FileWithURI } from "../utils/image-compressor";
import { BaseDialogProps, DialogManager } from "../common/dialog-manager";
import { strings } from "@notesfriend/intl";
import { checkFeature } from "../common";

export type ImagePickerDialogProps = BaseDialogProps<false | File[]> & {
  images: File[];
};

export const ImagePickerDialog = DialogManager.register(
  function ImagePickerDialog(props: ImagePickerDialogProps) {
    const [images, setImages] = useState<FileWithURI[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [compress, setCompress] = useState(true);
    const selectedImage = images[selectedIndex];

    useEffect(() => {
      (async function () {
        const images: FileWithURI[] = [];
        for (const image of props.images) {
          const compressed = compress
            ? await compressImage(image, {
                maxWidth: (naturalWidth) => Math.min(1920, naturalWidth * 0.7),
                width: (naturalWidth) => naturalWidth,
                height: (_, naturalHeight) => naturalHeight,
                resize: "contain",
                quality: 0.7
              })
            : image;
          images.push(
            new FileWithURI([compressed], image.name, {
              lastModified: image.lastModified,
              type: image.type
            })
          );
        }
        setImages(images);
      })();
    }, [props.images, compress]);

    useEffect(() => {
      return () => {
        images.forEach((i) => URL.revokeObjectURL(i.uri));
      };
    }, [images]);

    return (
      <Dialog
        isOpen={true}
        onClose={() => props.onClose(false)}
        positiveButton={{
          text: strings.insert(),
          onClick: () => props.onClose(images)
        }}
        negativeButton={{
          text: strings.cancel(),
          onClick: () => props.onClose(false)
        }}
      >
        {selectedImage && (
          <Flex sx={{ flexDirection: "column", alignItems: "center", mt: 4 }}>
            <Image
              src={selectedImage.uri}
              sx={{
                maxHeight: 250,
                objectFit: "contain",
                alignSelf: "center",
                borderRadius: "default"
              }}
            />
            <Text variant="subBody" sx={{ my: 2 }}>
              {selectedImage.name} ({formatBytes(selectedImage.size)})
            </Text>
          </Flex>
        )}
        {images.length > 1 ? (
          <ScrollContainer style={{ display: "flex" }}>
            {images.map((image, index) => (
              <Image
                key={image.name + image.size}
                src={image.uri}
                sx={{
                  flexShrink: 0,
                  height: "55px",
                  width: "55px",
                  objectFit: "contain",
                  border:
                    selectedIndex === index
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                  borderRadius: "default"
                }}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </ScrollContainer>
        ) : null}

        <Label variant="text.body" sx={{ mt: 2 }}>
          <input
            type="checkbox"
            style={{
              accentColor: "var(--accent)",
              marginRight: 1,
              width: 14,
              height: 14
            }}
            defaultChecked={compress}
            checked={compress}
            onChange={async () => {
              if (!(await checkFeature("fullQualityImages", { type: "toast" })))
                return;
              setCompress((s) => !s);
            }}
          />
          <span style={{ marginLeft: 5 }}>
            Enable compression (recommended)
          </span>
        </Label>
      </Dialog>
    );
  }
);
