import { LegendList } from "@legendapp/list";
import { useIsFeatureAvailable } from "@notesfriend/common";
import { Color, Note } from "@notesfriend/core";
import { strings } from "@notesfriend/intl";
import { useThemeColors } from "@notesfriend/theme";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { notesfriend } from "../../../e2e/test.ids";
import { db } from "../../common/database";
import { eSendEvent, ToastManager } from "../../services/event-manager";
import Navigation from "../../services/navigation";
import { useMenuStore } from "../../stores/use-menu-store";
import { useRelationStore } from "../../stores/use-relation-store";
import { useSettingStore } from "../../stores/use-setting-store";
import { refreshNotesPage } from "../../utils/events";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import ColorPicker from "../dialogs/color-picker";
import PaywallSheet from "../sheets/paywall";
import { Button } from "../ui/button";
import { Pressable } from "../ui/pressable";

const ColorItem = ({ item, note }: { item: Color; note: Note }) => {
  const { colors } = useThemeColors();
  const [isLinked, setIsLinked] = useState<boolean>();
  const setColorNotes = useMenuStore((state) => state.setColorNotes);
  useEffect(() => {
    const checkIsLinked = async (color: Color) => {
      const hasRelation = await db.relations.from(color, "note").has(note.id);
      return hasRelation;
    };

    checkIsLinked(item).then((info) => setIsLinked(info));
  }, [item, note.id]);

  const toggleColor = async () => {
    await db.relations.to(note, "color").unlink();

    if (!isLinked) {
      await db.relations.add(item, note);
    }

    useRelationStore.getState().update();
    setColorNotes();
    Navigation.queueRoutesForUpdate();
    eSendEvent(refreshNotesPage);
  };

  return (
    <Pressable
      type="accent"
      accentColor={item.colorCode}
      accentText={colors.static.white}
      testID={notesfriend.ids.dialogs.actionsheet.color(item.colorCode)}
      key={item.id}
      onPress={toggleColor}
      style={{
        width: 35,
        height: 35,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5
      }}
    >
      {isLinked ? (
        <Icon
          testID="icon-check"
          name="check"
          color="white"
          size={AppFontSize.lg}
        />
      ) : null}
    </Pressable>
  );
};

export const ColorTags = ({ item }: { item: Note }) => {
  const colorFeature = useIsFeatureAvailable("colors");
  const { colors } = useThemeColors();
  const colorNotes = useMenuStore((state) => state.colorNotes);
  const isTablet = useSettingStore((state) => state.deviceMode) !== "mobile";
  const updater = useRelationStore((state) => state.updater);
  const [visible, setVisible] = useState(false);
  const note = item;

  const renderItem = useCallback(
    ({ item }: { item: Color }) => (
      <ColorItem note={note} key={item.id} item={item} />
    ),
    [note]
  );

  const onPress = React.useCallback(async () => {
    if (colorFeature && !colorFeature.isAllowed) {
      ToastManager.show({
        message: colorFeature.error,
        type: "info",
        context: "local",
        actionText: strings.upgrade(),
        func: () => {
          PaywallSheet.present(colorFeature);
          ToastManager.hide();
        }
      });
      return;
    }
    useSettingStore.getState().setSheetKeyboardHandler(false);
    setVisible(true);
  }, []);

  return (
    <>
      <ColorPicker
        visible={visible}
        setVisible={setVisible}
        onColorAdded={async (color) => {
          await db.relations.to(note, "color").unlink();
          await db.relations.add(color, note);
          useRelationStore.getState().update();
          useMenuStore.getState().setColorNotes();
          Navigation.queueRoutesForUpdate();
          eSendEvent(refreshNotesPage);
        }}
      />
      <View
        style={{
          flexGrow: isTablet ? undefined : 1,
          flexDirection: "row",
          marginLeft: 5,
          flexShrink: 2
        }}
      >
        {!colorNotes || !colorNotes.length ? (
          <Button
            onPress={onPress}
            buttonType={{
              text: colors.primary.accent
            }}
            title={strings.addColor()}
            type="secondary"
            icon="plus"
            iconPosition="right"
            height={30}
            fontSize={AppFontSize.xs}
            style={{
              marginRight: 5,
              paddingHorizontal: DefaultAppStyles.GAP_SMALL,
              paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
            }}
          />
        ) : (
          <LegendList
            data={colorNotes}
            estimatedItemSize={30}
            horizontal
            extraData={updater}
            bounces={false}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
              <Pressable
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 5
                }}
                type="secondary"
                onPress={onPress}
              >
                <Icon
                  testID="icon-plus"
                  name="plus"
                  color={colors.primary.icon}
                  size={AppFontSize.lg}
                />
              </Pressable>
            }
          />
        )}
      </View>
    </>
  );
};
