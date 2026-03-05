import { useSettingStore } from "../stores/use-setting-store";

const useGlobalSafeAreaInsets = () => {
  const insets = useSettingStore((state) => state.insets);
  return insets;
};

export default useGlobalSafeAreaInsets;
