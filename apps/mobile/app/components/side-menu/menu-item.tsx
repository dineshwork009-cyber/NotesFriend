import { useThemeColors } from "@notesfriend/theme";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTotalNotes } from "../../hooks/use-db-item";

import { db } from "../../common/database";
import { eSubscribeEvent } from "../../services/event-manager";
import Navigation from "../../services/navigation";
import useNavigationStore, {
  RouteParams
} from "../../stores/use-navigation-store";
import { eAfterSync } from "../../utils/events";
import { SideMenuItem } from "../../utils/menu-items";
import { AppFontSize, defaultBorderRadius } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { Pressable } from "../ui/pressable";
import Paragraph from "../ui/typography/paragraph";
import { useSideBarDraggingStore } from "./dragging-store";

export function MenuItem({
  item,
  index,
  testID,
  renderIcon
}: {
  item: SideMenuItem;
  index?: number;
  testID?: string;
  renderIcon?: (item: SideMenuItem, size: number) => React.ReactNode;
}) {
  const [itemCount, setItemCount] = useState(0);
  const { colors } = useThemeColors();
  const isFocused = useNavigationStore(
    (state) => state.focusedRouteId === item.id
  );
  const totalNotes = useTotalNotes(
    item.dataType as "notebook" | "tag" | "color"
  );
  const getTotalNotesRef = useRef(totalNotes.getTotalNotes);
  getTotalNotesRef.current = totalNotes.getTotalNotes;

  const menuItemCount = !item.data
    ? itemCount
    : totalNotes.totalNotes(item.data.id);

  useEffect(() => {
    const onSyncComplete = async () => {
      try {
        if (!item.data) {
          switch (item.id) {
            case "Notes":
              setItemCount(await db.notes.all.count());
              break;
            case "Favorites":
              setItemCount(await db.notes.favorites.count());
              break;
            case "Reminders":
              setItemCount(await db.reminders.all.count());
              break;
            case "Monographs":
              setItemCount(await db.monographs.all.count());
              break;
            case "Archive":
              setItemCount(await db.notes.archived.count());
              break;
            case "Trash":
              setItemCount((await db.trash.all()).length);
              break;
          }
        } else {
          getTotalNotesRef.current?.([item.data.id]);
        }
      } catch (e) {
        /** Empty */
      }
    };
    const event = eSubscribeEvent(eAfterSync, onSyncComplete);
    onSyncComplete();
    return () => {
      event?.unsubscribe();
    };
  }, [item.data, item.id]);

  const _onPress = () => {
    if (useSideBarDraggingStore.getState().dragging) return;
    if (item.onPress) return item.onPress(item);
    Navigation.closeDrawer();
    if (useNavigationStore.getState().currentRoute !== item.id) {
      Navigation.navigate(item.id as keyof RouteParams, {
        canGoBack: false
      });
    }
  };

  return (
    <Pressable
      testID={testID}
      key={item.id}
      onPress={_onPress}
      onLongPress={() => item.onLongPress?.(item)}
      type={isFocused ? "selected" : "plain"}
      style={{
        width: "100%",
        alignSelf: "center",
        borderRadius: defaultBorderRadius,
        flexDirection: "row",
        paddingHorizontal: DefaultAppStyles.GAP_SMALL,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DefaultAppStyles.GAP_SMALL
        }}
      >
        {renderIcon ? (
          renderIcon(item, AppFontSize.md)
        ) : (
          <Icon
            style={{
              textAlignVertical: "center",
              textAlign: "left"
            }}
            allowFontScaling
            name={item.icon}
            color={
              item.icon === "crown"
                ? colors.static.yellow
                : isFocused
                  ? colors.selected.icon
                  : colors.secondary.icon
            }
            size={AppFontSize.md}
          />
        )}

        <Paragraph
          color={
            isFocused ? colors.selected.paragraph : colors.primary.paragraph
          }
          size={AppFontSize.sm}
        >
          {item.title}
        </Paragraph>
      </View>

      <Paragraph
        size={AppFontSize.xxs}
        color={
          isFocused ? colors.primary.paragraph : colors.secondary.paragraph
        }
      >
        {menuItemCount}
      </Paragraph>
    </Pressable>
  );
}
