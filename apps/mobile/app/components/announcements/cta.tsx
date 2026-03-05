import React from "react";
import { Linking, View } from "react-native";
import { useThemeColors } from "@notesfriend/theme";
import { eSendEvent } from "../../services/event-manager";
import { eCloseAnnouncementDialog } from "../../utils/events";
import { AppFontSize } from "../../utils/size";
import { sleep } from "../../utils/time";
import SheetProvider from "../sheet-provider";
import { Button } from "../ui/button";
import { allowedOnPlatform, BodyItemProps, getStyle } from "./functions";
import { DefaultAppStyles } from "../../utils/styles";
import { Action } from "../../stores/use-message-store";

export const Cta = (props: BodyItemProps) => {
  const { colors } = useThemeColors();
  let buttons =
    props.item.actions.filter((item) => allowedOnPlatform(item.platforms)) ||
    [];

  const onPress = async (item: Action) => {
    if (!props.inline) {
      eSendEvent(eCloseAnnouncementDialog);
      await sleep(500);
    }
    if (item.type === "link") {
      Linking.openURL(item.data).catch(() => {
        /* empty */
      });
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        ...getStyle(props.item.style),
        flexDirection: props.inline ? "row" : "column",
        gap: DefaultAppStyles.GAP_SMALL
      }}
    >
      <SheetProvider context="premium_cta" />

      {props.inline ? (
        <>
          {buttons.length > 0 &&
            buttons.slice(0, 1).map((item) => (
              <Button
                key={item.title}
                title={item.title}
                fontSize={AppFontSize.sm}
                type="transparent"
                textStyle={{
                  textDecorationLine: "underline"
                }}
                onPress={() => onPress(item)}
                bold
                style={{
                  paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL,
                  alignSelf: "flex-start",
                  paddingHorizontal: 0
                }}
              />
            ))}

          {buttons.length > 1 &&
            buttons.slice(1, 2).map((item) => (
              <Button
                key={item.title}
                title={item.title}
                fontSize={AppFontSize.sm}
                type="plain"
                onPress={() => onPress(item)}
                style={{
                  paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL,
                  alignSelf: "flex-start",
                  paddingHorizontal: 0
                }}
                textStyle={{
                  textDecorationLine: "underline"
                }}
              />
            ))}
        </>
      ) : (
        <>
          {buttons.length > 0 &&
            buttons.slice(0, 1).map((item) => (
              <Button
                key={item.title}
                title={item.title}
                buttonType={{
                  color: colors.primary.accent,
                  text: colors.primary.accentForeground,
                  selected: colors.primary.accent,
                  opacity: 1
                }}
                onPress={() => onPress(item)}
                style={{
                  width: "100%"
                }}
              />
            ))}

          {buttons.length > 1 &&
            buttons.slice(1, 2).map((item) => (
              <Button
                key={item.title}
                title={item.title}
                fontSize={AppFontSize.xs}
                type="plain"
                onPress={() => onPress(item)}
                width={null}
                height={30}
                style={{
                  minWidth: "50%",
                  width: "100%"
                }}
                textStyle={{
                  textDecorationLine: "underline"
                }}
              />
            ))}
        </>
      )}
    </View>
  );
};
