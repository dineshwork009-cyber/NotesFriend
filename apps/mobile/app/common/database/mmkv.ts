import { Platform } from "react-native";
import { ProcessingModes, MMKVLoader } from "react-native-mmkv-storage";

export const MMKV = new MMKVLoader()
  .setProcessingMode(
    Platform.OS === "ios"
      ? ProcessingModes.MULTI_PROCESS
      : ProcessingModes.SINGLE_PROCESS
  )
  .disableIndexing()
  .initialize();
