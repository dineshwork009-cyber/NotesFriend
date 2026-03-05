import { useThemeColors } from "@notesfriend/theme";
import React from "react";
import { View } from "react-native";
import { useMessageStore } from "../../stores/use-message-store";
import { useSelectionStore } from "../../stores/use-selection-store";
import { allowedOnPlatform, renderItem } from "./functions";
import { getContainerBorder } from "../../utils/colors";
import { DefaultAppStyles } from "../../utils/styles";
import Heading from "../ui/typography/heading";
import { AppFontSize } from "../../utils/size";
import { Button } from "../ui/button";
import { strings } from "@notesfriend/intl";

export const Announcement = () => {
  const { colors } = useThemeColors();
  const [announcements, remove] = useMessageStore((state) => [
    state.announcements,
    state.remove
  ]);
  let announcement = announcements.length > 0 ? announcements[0] : null;
  const selectionMode = useSelectionStore((state) => state.selectionMode);

  return !announcement || selectionMode ? null : (
    <View
      style={{
        backgroundColor: colors.primary.background,
        width: "100%",
        paddingHorizontal: DefaultAppStyles.GAP,
        paddingVertical: DefaultAppStyles.GAP_VERTICAL
      }}
    >
      <View
        style={{
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: colors.secondary.background,
          paddingBottom: 12,
          ...getContainerBorder(colors.secondary.background)
        }}
      >
        <View
          style={{
            width: "100%",
            marginTop: DefaultAppStyles.GAP_VERTICAL
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: DefaultAppStyles.GAP,
              borderBottomWidth: 1,
              borderBottomColor: colors.primary.border,
              paddingBottom: DefaultAppStyles.GAP_VERTICAL_SMALL
            }}
          >
            <Heading color={colors.secondary.heading} size={AppFontSize.xxs}>
              {strings.announcement()}
            </Heading>

            <Button
              type="plain"
              icon="close"
              onPress={() => {
                remove(announcement.id);
              }}
              iconSize={20}
              fontSize={AppFontSize.xs}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 0,
                zIndex: 10
              }}
            />
          </View>

          {announcement?.body
            .filter((item) => allowedOnPlatform(item.platforms))
            .map((item, index) =>
              renderItem({
                item: item,
                index: index,
                inline: true
              })
            )}
        </View>
      </View>
    </View>
  );
};
