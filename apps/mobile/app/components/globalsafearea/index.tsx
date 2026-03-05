import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingStore } from "../../stores/use-setting-store";

const GlobalSafeAreaProvider = () => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    useSettingStore.getState().setInsets(insets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insets.top, insets.bottom, insets.left, insets.right]);

  return null;
};

export default GlobalSafeAreaProvider;
