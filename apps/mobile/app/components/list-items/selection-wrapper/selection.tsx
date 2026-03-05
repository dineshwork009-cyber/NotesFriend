import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsCompactModeEnabled } from "../../../hooks/use-is-compact-mode-enabled";
import useIsSelected from "../../../hooks/use-selected";
import { useSelectionStore } from "../../../stores/use-selection-store";
import { AppFontSize } from "../../../utils/size";
import { Item, TrashItem } from "@notesfriend/core";

export const SelectionIcon = ({ item }: { item: Item }) => {
  const { colors } = useThemeColors();
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const [selected] = useIsSelected(item);

  const compactMode = useIsCompactModeEnabled(
    (item as TrashItem).itemType || item.type
  );

  return selectionMode ? (
    <View
      style={{
        width: compactMode ? 30 : 40,
        height: compactMode ? 30 : 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: colors.primary.border
      }}
      pointerEvents="none"
    >
      {selected ? (
        <Icon
          size={compactMode ? AppFontSize.xl - 2 : AppFontSize.xl}
          color={selected ? colors.selected.accent : colors.primary.icon}
          name={"check"}
        />
      ) : null}
    </View>
  ) : null;
};
