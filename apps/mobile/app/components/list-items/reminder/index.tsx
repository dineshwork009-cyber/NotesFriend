import { Reminder } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { notesfriend } from "../../../../e2e/test.ids";
import useIsSelected from "../../../hooks/use-selected";
import AddReminder from "../../../screens/add-reminder";
import { eSendEvent } from "../../../services/event-manager";
import { useSelectionStore } from "../../../stores/use-selection-store";
import { eCloseSheet } from "../../../utils/events";
import { AppFontSize, defaultBorderRadius } from "../../../utils/size";
import { DefaultAppStyles } from "../../../utils/styles";
import { Properties } from "../../properties";
import AppIcon from "../../ui/AppIcon";
import { IconButton } from "../../ui/icon-button";
import { ReminderTime } from "../../ui/reminder-time";
import Heading from "../../ui/typography/heading";
import Paragraph from "../../ui/typography/paragraph";
import SelectionWrapper, { selectItem } from "../selection-wrapper";

const ReminderItem = React.memo(
  ({
    item,
    index,
    isSheet
  }: {
    item: Reminder;
    index: number;
    isSheet: boolean;
  }) => {
    const { colors } = useThemeColors();
    const openReminder = () => {
      if (selectItem(item)) return;
      AddReminder.present(item, undefined);
      if (isSheet) {
        eSendEvent(eCloseSheet);
      }
    };
    const selectionMode = useSelectionStore((state) => state.selectionMode);
    const [selected] = useIsSelected(item);
    return (
      <SelectionWrapper onPress={openReminder} item={item} isSheet={isSheet}>
        <View
          style={{
            opacity: item.disabled ? 0.5 : 1,
            maxWidth: "80%",
            flexGrow: 1
          }}
        >
          <Heading
            numberOfLines={1}
            style={{
              flexWrap: "wrap"
            }}
            size={AppFontSize.md}
          >
            {item.title}
          </Heading>

          {item.description ? (
            <Paragraph
              style={{
                flexWrap: "wrap"
              }}
              numberOfLines={2}
            >
              {item.description}
            </Paragraph>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL
            }}
          >
            {item.disabled ? (
              <View
                style={{
                  backgroundColor: colors.secondary.background,
                  borderRadius: defaultBorderRadius,
                  flexDirection: "row",
                  paddingHorizontal: DefaultAppStyles.GAP_SMALL,
                  alignItems: "center",
                  marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL,
                  justifyContent: "flex-start",
                  alignSelf: "flex-start",
                  marginRight: 10,
                  height: 30
                }}
              >
                <Icon
                  name="bell-off-outline"
                  size={AppFontSize.md}
                  color={colors.error.icon}
                />
                <Paragraph
                  size={AppFontSize.xs}
                  color={colors.secondary.paragraph}
                  style={{ marginLeft: 5 }}
                >
                  {strings.disabled()}
                </Paragraph>
              </View>
            ) : null}
            {item.mode === "repeat" && item.recurringMode ? (
              <View
                style={{
                  backgroundColor: colors.secondary.background,
                  borderRadius: defaultBorderRadius,
                  flexDirection: "row",
                  paddingHorizontal: DefaultAppStyles.GAP_SMALL,
                  alignItems: "center",
                  marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL,
                  justifyContent: "flex-start",
                  alignSelf: "flex-start",
                  marginRight: DefaultAppStyles.GAP_SMALL,
                  height: 30
                }}
              >
                <Icon
                  name="reload"
                  size={AppFontSize.md}
                  color={colors.primary.accent}
                />
                <Paragraph
                  size={AppFontSize.xs}
                  color={colors.secondary.paragraph}
                  style={{ marginLeft: 5 }}
                >
                  {strings.reminderRecurringMode[item.recurringMode]()}
                </Paragraph>
              </View>
            ) : null}

            <ReminderTime
              reminder={item}
              checkIsActive={false}
              fontSize={AppFontSize.xxs}
              style={{
                justifyContent: "flex-start",
                paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL / 2,
                alignSelf: "flex-start"
              }}
            />
          </View>
        </View>

        {selectionMode === "note" || selectionMode === "trash" ? (
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
            testID={notesfriend.listitem.menu}
            color={colors.primary.paragraph}
            name="dots-horizontal"
            size={AppFontSize.xl}
            onPress={() => Properties.present(item, isSheet)}
            style={{
              justifyContent: "center",
              height: 35,
              width: 35,
              borderRadius: 100,
              alignItems: "center"
            }}
          />
        )}
      </SelectionWrapper>
    );
  },
  (prev, next) => {
    if (prev.item?.dateModified !== next.item?.dateModified) {
      return false;
    }
    return true;
  }
);
ReminderItem.displayName = "ReminderItem";

export default ReminderItem;
