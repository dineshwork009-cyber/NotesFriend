import { Item } from "@notesfriend/core";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import useIsSelected from "../../../hooks/use-selected";
import { useTabStore } from "../../../screens/editor/tiptap/use-tab-store";

export const Filler = ({ item, color }: { item: Item; color?: string }) => {
  const { colors } = useThemeColors();
  const isEditingNote = useTabStore(
    (state) =>
      state.tabs.find((t) => t.id === state.currentTab)?.session?.noteId ===
      item.id
  );

  const [selected] = useIsSelected(item);

  return isEditingNote || selected ? (
    <View
      style={{
        position: "absolute",
        width: "110%",
        height: "100%",
        backgroundColor: colors.selected.accent
        // borderLeftWidth: 5,
        // borderLeftColor: isEditingNote
        //   ? color
        //     ? color
        //     : colors.selected.accent
        //   : "transparent"
      }}
    />
  ) : null;
};
