import { getFormattedDate } from "@notesfriend/common";
import { BaseTrashItem, Notebook, TrashItem } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { notesfriend } from "../../../../e2e/test.ids";
import { useIsCompactModeEnabled } from "../../../hooks/use-is-compact-mode-enabled";
import useIsSelected from "../../../hooks/use-selected";
import { useSelectionStore } from "../../../stores/use-selection-store";
import { AppFontSize } from "../../../utils/size";
import { Properties } from "../../properties";
import AppIcon from "../../ui/AppIcon";
import { IconButton } from "../../ui/icon-button";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import { DefaultAppStyles } from "../../../utils/styles";

type NotebookItemProps = {
  item: Notebook | BaseTrashItem<Notebook>;
  totalNotes: number;
  date: number;
  index: number;
  isTrash: boolean;
};

export const NotebookItem = ({
  item,
  isTrash,
  date,
  totalNotes
}: NotebookItemProps) => {
  const { colors } = useThemeColors();
  const compactMode = useIsCompactModeEnabled(
    (item as TrashItem).itemType || item.type
  );
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const [selected] = useIsSelected(item);

  return (
    <>
      <View
        style={{
          flexGrow: 1,
          flexShrink: 1
        }}
      >
        {compactMode ? (
          <Paragraph
            size={AppFontSize.sm}
            numberOfLines={1}
            style={{
              flexWrap: "wrap"
            }}
          >
            {item.title}
          </Paragraph>
        ) : (
          <Heading
            size={AppFontSize.md}
            numberOfLines={1}
            style={{
              flexWrap: "wrap"
            }}
          >
            {item.title}
          </Heading>
        )}

        {!item.description || compactMode ? null : (
          <Paragraph
            size={AppFontSize.sm}
            numberOfLines={2}
            style={{
              flexWrap: "wrap"
            }}
          >
            {item.description}
          </Paragraph>
        )}

        {!compactMode ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL,
              height: AppFontSize.md + 2
            }}
          >
            {isTrash ? (
              <>
                <Paragraph
                  color={colors.secondary.paragraph}
                  size={AppFontSize.xs}
                  style={{
                    textAlignVertical: "center",
                    marginRight: 6
                  }}
                >
                  {strings.deletedOn(
                    new Date((item as TrashItem).dateDeleted)
                      .toISOString()
                      .slice(0, 10)
                  )}
                </Paragraph>
                <Paragraph
                  color={colors.primary.accent}
                  size={AppFontSize.xs}
                  style={{
                    textAlignVertical: "center",
                    marginRight: 6
                  }}
                >
                  {(item as TrashItem).itemType[0].toUpperCase() +
                    (item as TrashItem).itemType.slice(1)}
                </Paragraph>
              </>
            ) : (
              <Paragraph
                color={colors.secondary.paragraph}
                size={AppFontSize.xs}
                style={{
                  marginRight: 6
                }}
              >
                {getFormattedDate(date, "date")}
              </Paragraph>
            )}
            <Paragraph
              color={colors.secondary.paragraph}
              size={AppFontSize.xs}
              style={{
                marginRight: 6
              }}
            >
              {strings.notes(totalNotes)}
            </Paragraph>

            {item.pinned ? (
              <Icon
                name="pin-outline"
                size={AppFontSize.sm}
                style={{
                  marginRight: 10,
                  marginTop: 2
                }}
                color={colors.primary.accent}
              />
            ) : null}
          </View>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {compactMode ? (
          <>
            <Paragraph
              color={colors.primary.icon}
              size={AppFontSize.xs}
              style={{
                marginRight: 6
              }}
            >
              {strings.notes(totalNotes)}
            </Paragraph>
          </>
        ) : null}
        {selectionMode === "notebook" || selectionMode === "trash" ? (
          <>
            <View
              style={{
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AppIcon
                name={selected ? "checkbox-outline" : "checkbox-blank-outline"}
                color={selected ? colors.selected.icon : colors.primary.icon}
                size={AppFontSize.lg}
              />
            </View>
          </>
        ) : (
          <IconButton
            color={colors.primary.heading}
            name="dots-horizontal"
            testID={notesfriend.ids.notebook.menu}
            size={AppFontSize.xl}
            onPress={() => Properties.present(item)}
            style={{
              justifyContent: "center",
              height: 35,
              width: 35,
              borderRadius: 100,
              alignItems: "center"
            }}
          />
        )}
      </View>
    </>
  );
};
