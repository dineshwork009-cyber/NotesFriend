import { CURRENT_TOOLBAR_VERSION, migrateToolbar } from "@notesfriend/common";
import type { ToolbarGroupDefinition } from "@notesfriend/editor";
import { create } from "zustand";
import { StateStorage, persist } from "zustand/middleware";
import { db } from "../../../common/database";
import { MMKV } from "../../../common/database/mmkv";
import { useSettingStore } from "../../../stores/use-setting-store";
import { presets } from "./toolbar-definition";
export type ToolDefinition = string | string[];

export type DraggedItem = {
  item?: ToolDefinition | ToolDefinition[];
  type?: "tool" | "group" | "subgroup";
  height?: number;
  groupIndex?: number;
};

export type DraggableItem = {
  item: ToolDefinition | ToolDefinition[];
  index: number;
  parentIndex?: number;
  groupIndex?: number;
};

export interface DragState {
  dragged: DraggedItem;
  setDragged: (dragged: DraggedItem) => void;
  data: ToolbarGroupDefinition[];
  customPresetData: ToolbarGroupDefinition[];
  setData: (data: ToolbarGroupDefinition[]) => void;
  preset: "default" | "minimal" | "custom";
  setPreset: (preset: "default" | "minimal" | "custom") => void;
  init: () => Promise<void>;
}

function clone<T>(value: T[]) {
  return JSON.parse(JSON.stringify(value));
}

export const useDragState = create<DragState, any>(
  persist(
    (set, get) => ({
      preset: "default",
      dragged: {},
      setDragged: (dragged) => {
        set({ dragged });
      },
      data: presets["default"],
      customPresetData: presets["custom"],
      setData: (data) => {
        const _data = clone(data);

        presets["custom"] = _data;
        db.settings.setToolbarConfig(
          useSettingStore.getState().deviceMode || ("mobile" as any),
          {
            preset: "custom",
            config: clone(_data),
            version: CURRENT_TOOLBAR_VERSION
          }
        );
        set({ data: _data, preset: "custom", customPresetData: _data });
      },
      setPreset: (preset) => {
        db.settings.setToolbarConfig(
          useSettingStore.getState().deviceMode || ("mobile" as any),
          {
            preset,
            config: preset === "custom" ? clone(get().customPresetData) : [],
            version: CURRENT_TOOLBAR_VERSION
          }
        );
        set({
          preset,
          data:
            preset === "custom"
              ? clone(get().customPresetData)
              : clone(presets[preset])
        });
      },
      init: async () => {
        const user = await db.user?.getUser();
        if (!user) return;
        let toolbarConfig = db.settings.getToolbarConfig(
          useSettingStore.getState().deviceMode || ("mobile" as any)
        );
        if (!toolbarConfig) {
          logger.info("DragState", "No user defined toolbar config was found");
          return;
        }

        toolbarConfig = await migrateToolbar(
          useSettingStore.getState().deviceMode || ("mobile" as any),
          toolbarConfig
        );

        const preset = toolbarConfig?.preset as DragState["preset"];
        set({
          preset: preset,
          data:
            preset === "custom"
              ? clone(toolbarConfig?.config as any[])
              : clone(presets[preset]),
          customPresetData:
            preset === "custom"
              ? clone(toolbarConfig?.config as any[])
              : clone(presets["custom"])
        });
      }
    }),
    {
      name: "drag-state-storage", // unique name
      getStorage: () => MMKV as unknown as StateStorage,
      onRehydrateStorage: () => {
        return () => {
          if (!useSettingStore.getState().isAppLoading) {
            useDragState.getState().init();
          } else {
            setTimeout(() => {
              useDragState.getState().init();
            }, 1000);
          }
        };
      } // (optional) by default, 'localStorage' is used
    }
  )
);
