import React, { useState } from "react";
import { View } from "react-native";
import { useThemeColors } from "@notesfriend/theme";
import { AppFontSize } from "../../utils/size";
import Paragraph from "../ui/typography/paragraph";
import { getFormattedDate } from "@notesfriend/common";
import { strings } from "@notesfriend/intl";
import { DefaultAppStyles } from "../../utils/styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { db } from "../../common/database";
import { Item, Note } from "@notesfriend/core";
import AppIcon from "../ui/AppIcon";
export const DateMeta = ({ item }: { item: Item }) => {
  const { colors, isDark } = useThemeColors();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateCreated, setDateCreated] = useState(item.dateCreated);

  function getDateMeta() {
    let keys = Object.keys(item);
    if (keys.includes("dateEdited"))
      keys.splice(
        keys.findIndex((k) => k === "dateModified"),
        1
      );
    return keys.filter((key) => key.startsWith("date") && key !== "date");
  }

  const renderItem = (key: string) =>
    !item[key as keyof Item] ? null : (
      <View
        key={key}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL / 2
        }}
      >
        <Paragraph size={AppFontSize.xs} color={colors.secondary.paragraph}>
          {strings.dateDescFromKey(
            key as
              | "dateDeleted"
              | "dateEdited"
              | "dateModified"
              | "dateCreated"
              | "dateUploaded"
          )}
        </Paragraph>
        <Paragraph
          size={AppFontSize.xs}
          color={colors.secondary.paragraph}
          onPress={
            item.type !== "note"
              ? undefined
              : () => {
                  setIsDatePickerVisible(true);
                }
          }
        >
          {getFormattedDate(
            key === "dateCreated"
              ? dateCreated
              : (item[key as keyof Item] as string),
            "date-time"
          )}
          {key === "dateCreated" && item.type === "note" ? (
            <>
              {" "}
              <AppIcon name="pencil" size={AppFontSize.md} />
            </>
          ) : null}
        </Paragraph>
      </View>
    );

  return (
    <>
      {item.type === "note" ? (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={async (date: Date) => {
            await db.notes.add({
              id: item.id,
              dateCreated: date.getTime()
            });
            setDateCreated(date.getTime());
            setIsDatePickerVisible(false);
          }}
          onCancel={() => {
            setIsDatePickerVisible(false);
          }}
          maximumDate={new Date((item as Note).dateEdited)}
          isDarkModeEnabled={isDark}
          is24Hour={db.settings.getTimeFormat() === "24-hour"}
          date={new Date(dateCreated)}
        />
      ) : null}

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.primary.border,
          paddingHorizontal: DefaultAppStyles.GAP,
          paddingTop: DefaultAppStyles.GAP_VERTICAL_SMALL
        }}
      >
        {getDateMeta().map(renderItem)}
      </View>
    </>
  );
};
