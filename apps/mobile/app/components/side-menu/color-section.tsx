import { Color } from "@notesfriend/core";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { db } from "../../common/database";
import { ColoredNotes } from "../../screens/notes/colored";
import Navigation from "../../services/navigation";
import { useMenuStore } from "../../stores/use-menu-store";
import { useSettingStore } from "../../stores/use-setting-store";
import { SideMenuItem } from "../../utils/menu-items";
import ReorderableList from "../list/reorderable-list";
import { Properties } from "../properties";
import { useSideBarDraggingStore } from "./dragging-store";
import { MenuItem } from "./menu-item";
import { Default_Drag_Action } from "../../hooks/use-actions";

export const ColorSection = React.memo(
  function ColorSection() {
    const [colorNotes] = useMenuStore((state) => [
      state.colorNotes,
      state.loadingColors
    ]);
    const loading = useSettingStore((state) => state.isAppLoading);
    const setColorNotes = useMenuStore((state) => state.setColorNotes);
    const [order, hiddensItems] = useMenuStore((state) => [
      state.order["colors"],
      state.hiddenItems["colors"]
    ]);

    useEffect(() => {
      if (!loading) {
        setColorNotes();
      }
    }, [loading, setColorNotes]);

    const onPress = React.useCallback((item: SideMenuItem) => {
      ColoredNotes.navigate(item.data as Color, false);
      setImmediate(() => {
        Navigation.closeDrawer();
      });
    }, []);

    const onLongPress = React.useCallback((item: SideMenuItem) => {
      if (useSideBarDraggingStore.getState().dragging) return;
      Properties.present(item.data as Color, false, [Default_Drag_Action]);
    }, []);

    const renderIcon = React.useCallback((item: SideMenuItem, size: number) => {
      return (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: size - 5,
              height: size - 5,
              backgroundColor: (item.data as Color).colorCode,
              borderRadius: 100
            }}
          />
        </View>
      );
    }, []);

    const menuItems = useMemo(
      () =>
        colorNotes.map((item) => ({
          id: item.id,
          title: item.title,
          icon: "circle",
          dataType: "color",
          data: item,
          onPress: onPress,
          onLongPress: onLongPress
        })) as SideMenuItem[],
      [colorNotes, onPress, onLongPress]
    );

    return (
      <ReorderableList
        onListOrderChanged={(data) => {
          db.settings.setSideBarOrder("colors", data);
        }}
        onHiddenItemsChanged={(data) => {
          db.settings.setSideBarHiddenItems("colors", data);
        }}
        disableDefaultDrag={true}
        itemOrder={order}
        hiddenItems={hiddensItems}
        alwaysBounceVertical={false}
        data={menuItems}
        style={{
          width: "100%"
        }}
        showsVerticalScrollIndicator={false}
        renderDraggableItem={({ item }) => {
          return <MenuItem item={item} renderIcon={renderIcon} />;
        }}
      />
    );
  },
  () => true
);
