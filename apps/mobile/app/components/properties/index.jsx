import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-actions-sheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../common/database";
import { DDS } from "../../services/device-detection";
import { eSendEvent, presentSheet } from "../../services/event-manager";
import { eOnLoadNote } from "../../utils/events";
import { fluidTabsRef } from "../../utils/global-refs";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import SheetProvider from "../sheet-provider";
import { IconButton } from "../ui/icon-button";
import { Pressable } from "../ui/pressable";
import { ReminderTime } from "../ui/reminder-time";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
import { DateMeta } from "./date-meta";
import { Items } from "./items";
import Notebooks from "./notebooks";
import { TagStrip, Tags } from "./tags";
import { Dialog } from "../dialog";

const Line = ({ top = 6, bottom = 6 }) => {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.primary.border,
        width: "100%",
        marginTop: top,
        marginBottom: bottom
      }}
    />
  );
};

export const Properties = ({ close = () => {}, item, buttons = [] }) => {
  const { colors } = useThemeColors();
  if (!item || !item.id) {
    return (
      <Paragraph style={{ marginVertical: 10, alignSelf: "center" }}>
        {strings.noNotePropertiesNotice()}
      </Paragraph>
    );
  }

  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="none"
      style={{
        backgroundColor: colors.primary.background,
        borderBottomRightRadius: DDS.isLargeTablet() ? 10 : 1,
        borderBottomLeftRadius: DDS.isLargeTablet() ? 10 : 1,
        maxHeight: "100%"
      }}
      nestedScrollEnabled
      bounces={false}
      data={[0]}
      keyExtractor={() => "properties-scroll-item"}
      renderItem={() => (
        <View
          style={{
            gap: DefaultAppStyles.GAP_VERTICAL
          }}
        >
          <View
            style={{
              paddingHorizontal: DefaultAppStyles.GAP
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexShrink: 1,
                  gap: 5
                }}
              >
                {item.type === "color" ? (
                  <Pressable
                    type="accent"
                    accentColor={item.colorCode}
                    accentText={colors.static.white}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                      marginRight: 10
                    }}
                  />
                ) : item.type === "tag" ? (
                  <Icon
                    name="pound"
                    size={AppFontSize.lg}
                    color={colors.primary.icon}
                  />
                ) : null}

                <Heading size={AppFontSize.lg}>{item.title}</Heading>
              </View>

              {item.type === "note" ? (
                <IconButton
                  name="open-in-new"
                  type="plain"
                  color={colors.primary.icon}
                  size={AppFontSize.lg}
                  style={{
                    alignSelf: "flex-start"
                  }}
                  onPress={() => {
                    close();
                    eSendEvent(eOnLoadNote, {
                      item: item,
                      newTab: true
                    });
                    if (!DDS.isTab) {
                      fluidTabsRef.current?.goToPage("editor");
                    }
                  }}
                />
              ) : null}
            </View>

            {(item.type === "notebook" || item.type === "reminder") &&
            item.description ? (
              <Paragraph>{item.description}</Paragraph>
            ) : null}

            {item.type === "note" ? (
              <TagStrip close={close} item={item} />
            ) : null}

            {item.type === "reminder" ? (
              <ReminderTime
                reminder={item}
                style={{
                  justifyContent: "flex-start",
                  borderWidth: 0,
                  alignSelf: "flex-start",
                  backgroundColor: "transparent",
                  paddingHorizontal: 0,
                  paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
                }}
                fontSize={AppFontSize.xs}
              />
            ) : null}
          </View>

          <DateMeta item={item} />
          <Line bottom={0} top={0} />

          {item.type === "note" ? (
            <>
              <Tags close={close} item={item} />
              <Line bottom={0} top={0} />
            </>
          ) : null}
          {item.type === "note" ? (
            <Notebooks note={item} close={close} />
          ) : null}
          <Items
            item={item}
            buttons={buttons}
            close={() => {
              close();
            }}
          />

          {DDS.isTab ? (
            <View
              style={{
                height: 20
              }}
            />
          ) : null}
          <SheetProvider context="properties" />
          <Dialog context="properties" />
        </View>
      )}
    />
  );
};

Properties.present = async (item, isSheet, buttons = []) => {
  if (!item) return;
  let type = item?.type;
  let dbItem;
  switch (type) {
    case "trash":
      dbItem = item;
      break;
    case "note":
      dbItem = await db.notes.note(item.id);
      break;
    case "notebook":
      dbItem = await db.notebooks.notebook(item.id);
      break;
    case "tag":
      dbItem = await db.tags.tag(item.id);
      break;
    case "color":
      dbItem = await db.colors.color(item.id);
      break;
    case "reminder": {
      dbItem = await db.reminders.reminder(item.id);
      break;
    }
  }

  presentSheet({
    context: isSheet ? "local" : undefined,
    component: (ref, close) => (
      <Properties
        close={close}
        actionSheetRef={ref}
        item={dbItem}
        buttons={buttons}
      />
    )
  });
};
