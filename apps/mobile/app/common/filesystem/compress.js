import { Dimensions, Image, Platform } from "react-native";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFetchBlob from "react-native-blob-util";

/**
 * Scale down & compress images to screen width
 * for loading in editor.
 * @returns
 */
export async function compressToBase64(path, type) {
  const { width: screenWidth, scale } = Dimensions.get("window");

  return new Promise((resolve) => {
    Image.getSize(path, async (width) => {
      const response = await ImageResizer.createResizedImage(
        path,
        screenWidth * scale,
        99999,
        type,
        width <= 1920 ? 100 : 90,
        0,
        undefined,
        true,
        {
          mode: "contain",
          onlyScaleDown: true
        }
      );

      const base64 = await RNFetchBlob.fs.readFile(
        Platform.OS === "ios"
          ? response.uri?.replace("file://", "")
          : response.uri,
        "base64"
      );
      RNFetchBlob.fs.unlink(path.replace("file://", "")).catch(() => {
        /* empty */
      });
      RNFetchBlob.fs.unlink(response.uri.replace("file://", "")).catch(() => {
        /* empty */
      });

      resolve(base64);
    });
  });
}

export async function compressToFile(path, type) {
  const response = await ImageResizer.createResizedImage(
    path,
    1920,
    99999,
    type,
    80,
    0,
    undefined,
    true,
    {
      mode: "contain",
      onlyScaleDown: true
    }
  );
  RNFetchBlob.fs.unlink(path.replace("file://", "")).catch(() => {
    /* empty */
  });
  return response.uri;
}
