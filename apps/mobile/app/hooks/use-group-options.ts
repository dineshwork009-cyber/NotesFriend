import { useEffect, useState } from "react";
import { db } from "../common/database";
import { eSubscribeEvent, eUnSubscribeEvent } from "../services/event-manager";
import Navigation from "../services/navigation";
import { eGroupOptionsUpdated } from "../utils/events";
import { useSettingStore } from "../stores/use-setting-store";

export function useGroupOptions(type: any) {
  const appLoading = useSettingStore((state) => state.isAppLoading);
  const [groupOptions, setGroupOptions] = useState(
    db.settings?.getGroupOptions(type)
  );
  useEffect(() => {
    const onUpdate = (groupType: string) => {
      if (groupType !== type) return;
      const options = db.settings?.getGroupOptions(type) as any;
      if (!options) return;
      if (
        groupOptions?.groupBy !== options.groupBy ||
        groupOptions?.sortBy !== options.sortBy ||
        groupOptions?.sortDirection !== groupOptions?.sortDirection
      ) {
        setGroupOptions({ ...options });
        Navigation.queueRoutesForUpdate();
      }
    };

    eSubscribeEvent(eGroupOptionsUpdated, onUpdate);

    if (!appLoading) {
      onUpdate(type);
    }

    return () => {
      eUnSubscribeEvent(eGroupOptionsUpdated, onUpdate);
    };
  }, [type, groupOptions, appLoading]);

  return groupOptions;
}
